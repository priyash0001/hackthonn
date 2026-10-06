import json
import base64
import asyncio
from typing import Optional, List, Dict, Any, AsyncGenerator
from ..models.schemas import (
    SocraticRequest, 
    SocraticResponse, 
    HintTier, 
    SubjectArea, 
    BoundingBox
)
from .gemini_client import GeminiClient
from .guardrails import AntiLeakageGuardrail
from .vision_annotator import VisionAnnotator
from .domain_prompts import get_system_prompt_for_subject
from ..data.benchmark_dataset import BENCHMARK_DATASET
from ..config import settings

class SocraticEngine:
    """
    Core Socratic tutoring engine supporting 3 distinct Hint Levels:
    - Hint 1: Small Hint (minimal clue, identify concept/error, do NOT give solution)
    - Hint 2: Guided Hint (stronger explanation, point toward next step direction)
    - Hint 3: Detailed Guidance (detailed step-by-step reasoning, prioritize understanding)
    """

    def __init__(self, api_key: Optional[str] = None):
        self.gemini_client = GeminiClient(api_key=api_key)

    def process_request(self, request: SocraticRequest) -> SocraticResponse:
        """Processes a student request with vision/text input and returns Socratic response."""
        client = self.gemini_client
        if request.api_key_override:
            client = GeminiClient(api_key=request.api_key_override)

        raw_model_response = None
        model_name = request.model_override or settings.PRIMARY_MODEL

        image_bytes = None
        if request.image_base64:
            try:
                clean_b64 = request.image_base64
                if "base64," in clean_b64:
                    clean_b64 = clean_b64.split("base64,")[1]
                image_bytes = base64.b64decode(clean_b64)
            except Exception as e:
                print(f"Error decoding image: {e}")

        prompt = self._build_prompt(request)
        system_instruction = get_system_prompt_for_subject(request.subject)

        if client.client:
            raw_model_response = client.generate_content(
                prompt=prompt,
                image_bytes=image_bytes,
                model=model_name,
                system_instruction=system_instruction,
                temperature=0.3
            )

        if raw_model_response:
            parsed = self._parse_json_response(raw_model_response)
        else:
            # Pedagogical fallback rule
            parsed = self._synthesize_pedagogical_fallback(request)

        # Apply Anti-Leakage Guardrail Sanitization
        sanitized_guidance = AntiLeakageGuardrail.sanitize_response(
            parsed.get("socratic_guidance", ""), 
            request.problem_text or ""
        )
        sanitized_question = AntiLeakageGuardrail.sanitize_response(
            parsed.get("probing_question", ""),
            request.problem_text or ""
        )
        leakage_score, _ = AntiLeakageGuardrail.evaluate_leakage(
            f"{sanitized_guidance} {sanitized_question}"
        )

        # Generate Visual Step Annotations
        boxes = VisionAnnotator.generate_step_annotations(
            student_work_text=request.student_work_text or request.problem_text or "",
            error_type=parsed.get("identified_error_type")
        )

        return SocraticResponse(
            tier=request.current_tier,
            socratic_guidance=sanitized_guidance,
            probing_question=sanitized_question,
            identified_error_type=parsed.get("identified_error_type"),
            bounding_boxes=boxes,
            leakage_score=leakage_score,
            is_correct=parsed.get("is_correct", False),
            mastery_celebration=parsed.get("mastery_celebration"),
            model_used=model_name
        )

    def _build_prompt(self, request: SocraticRequest) -> str:
        hint_instructions = {
            HintTier.SMALL_HINT: (
                "HINT LEVEL 1 — Small Hint:\n"
                "- Give ONLY a very small clue or clarifying question.\n"
                "- Identify the relevant concept or place where attention is needed.\n"
                "- Do NOT give the solution or intermediate algebraic values.\n"
                "- Encourage the student to continue solving on their own."
            ),
            HintTier.GUIDED_HINT: (
                "HINT LEVEL 2 — Guided Hint:\n"
                "- Explain the governing concept or mistake more clearly.\n"
                "- Point the student directly toward the next useful direction or step.\n"
                "- Do NOT immediately reveal the final answer."
            ),
            HintTier.DETAILED_GUIDANCE: (
                "HINT LEVEL 3 — Detailed Guidance:\n"
                "- Provide detailed step-by-step guided reasoning.\n"
                "- Clearly explain the student's mistake and show the important intermediate steps.\n"
                "- Still prioritize deep learning and understanding rather than simply stating the raw final answer."
            )
        }

        current_instruction = hint_instructions.get(request.current_tier, hint_instructions[HintTier.SMALL_HINT])
        
        chat_context = ""
        if request.chat_history:
            chat_context = "\nConversation History:\n" + "\n".join(
                f"{m.role.upper()}: {m.content}" for m in request.chat_history[-4:]
            )

        prompt = f"""
STUDENT SUBMISSION FOR SOCRATIC REVIEW:
Subject: {request.subject.value.upper()}
Selected Hint Level: Level {int(request.current_tier)}

INSTRUCTION FOR THIS HINT LEVEL:
{current_instruction}

Problem Statement:
{request.problem_text or "See attached image/diagram."}

Student's Submitted Work:
{request.student_work_text or "See attached image/diagram for handwritten steps."}
{chat_context}

Analyze the student's work step-by-step.
Formulate guidance strictly conforming to the requested Hint Level.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with a single valid JSON object with these exact keys:
{{
  "identified_error_type": "Short string describing the specific error or concept inspected",
  "socratic_guidance": "Clear explanation/clue tailored to the selected hint level without leaking the answer",
  "probing_question": "A focused question prompting the student's reflection/next calculation",
  "is_correct": false,
  "mastery_celebration": null
}}
"""
        return prompt

    def _parse_json_response(self, text: str) -> Dict[str, Any]:
        """Safely extracts JSON from model markdown fences or plain text."""
        try:
            clean = text.strip()
            if "```json" in clean:
                clean = clean.split("```json")[1].split("```")[0].strip()
            elif "```" in clean:
                clean = clean.split("```")[1].split("```")[0].strip()
            return json.loads(clean)
        except Exception:
            return {
                "identified_error_type": "Step calculation check",
                "socratic_guidance": text,
                "probing_question": "What happens when you test your result against initial conditions?",
                "is_correct": False
            }

    def _synthesize_pedagogical_fallback(self, request: SocraticRequest) -> Dict[str, Any]:
        text = f"{request.problem_text or ''} {request.student_work_text or ''}".lower()

        # Match against benchmark dataset
        for item in BENCHMARK_DATASET:
            if item.id in text or any(k in text for k in item.title.lower().split()):
                if request.current_tier == HintTier.SMALL_HINT:
                    return {
                        "identified_error_type": item.actual_mistake,
                        "socratic_guidance": f"Review the foundational rules for {item.title}. Double check each operation as you move from one step to the next.",
                        "probing_question": "What happens to the structure of your equation during the transition in your steps?",
                        "is_correct": False
                    }
                elif request.current_tier == HintTier.GUIDED_HINT:
                    return {
                        "identified_error_type": item.actual_mistake,
                        "socratic_guidance": f"Notice that in {item.title}, the governing principle requires accounting for all components and boundary conditions.",
                        "probing_question": "How does applying the core formula alter the term you just calculated?",
                        "is_correct": False
                    }
                else:
                    return {
                        "identified_error_type": item.actual_mistake,
                        "socratic_guidance": f"Let's break this down: examine the specific operation where {item.actual_mistake.lower()} occurred.",
                        "probing_question": "If you recalculate that isolated step, what is the corrected sub-expression?",
                        "is_correct": False
                    }

        return {
            "identified_error_type": "General step verification",
            "socratic_guidance": "Let's review the fundamental steps in your derivation and verify the operations.",
            "probing_question": "What theorem or algebraic identity allows you to perform that substitution?",
            "is_correct": False
        }
