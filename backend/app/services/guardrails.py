import re
from typing import Tuple, List

class AntiLeakageGuardrail:
    """
    Ensures that SocraticLens NEVER reveals the direct solution or final value.
    Inspects responses and sanitizes any accidental answers.
    """
    
    LEAKAGE_TRIGGER_PATTERNS = [
        r"(?:the\s+)?(?:correct\s+)?(?:final\s+)?answer\s+(?:is|=|should\s+be)\s*[:=]?\s*([^\n\.,]+)",
        r"(?:the\s+)?solution\s+(?:is|=|should\s+be)\s*[:=]?\s*([^\n\.,]+)",
        r"therefore,\s*[a-zA-Z]\s*=\s*([^\n\.,]+)",
        r"so\s+(?:we\s+get|it\s+equals)\s*[:=]?\s*([^\n\.,]+)",
        r"you\s+should\s+get\s+([^\n\.,]+)",
        r"which\s+gives\s+(?:us\s+)?([^\n\.,]+)",
    ]

    @classmethod
    def evaluate_leakage(cls, text: str, ground_truth_answer: str = "") -> Tuple[float, List[str]]:
        """
        Returns (leakage_score: 0.0 to 1.0, detected_leaks: list[str])
        0.0 = clean Socratic guidance (no answer leaked)
        1.0 = direct answer revealed
        """
        leaks = []
        lower_text = text.lower()
        
        # 1. Check if ground truth answer is explicitly printed
        if ground_truth_answer:
            clean_gt = ground_truth_answer.strip().lower()
            if clean_gt and len(clean_gt) > 1:
                # Direct match check with word/boundary awareness
                pattern = r"(?<![a-zA-Z0-9])" + re.escape(clean_gt) + r"(?![a-zA-Z0-9])"
                if re.search(pattern, lower_text):
                    leaks.append(f"Ground truth answer '{clean_gt}' detected in response")

        # 2. Check for giveaway phrasing
        for pattern in cls.LEAKAGE_TRIGGER_PATTERNS:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for m in matches:
                leaks.append(f"Answer revealing pattern: '{m.group(0)}'")

        if not leaks:
            return 0.0, []
        
        score = min(1.0, len(leaks) * 0.5)
        return score, leaks

    @classmethod
    def sanitize_response(cls, text: str, ground_truth_answer: str = "") -> str:
        """
        If a response accidentally leaks the final answer, sanitize it and wrap it into a Socratic inquiry.
        """
        score, leaks = cls.evaluate_leakage(text, ground_truth_answer)
        if score == 0.0:
            return text

        # Sanitize giveaway phrases
        sanitized = text
        for pattern in cls.LEAKAGE_TRIGGER_PATTERNS:
            sanitized = re.sub(
                pattern, 
                "what happens when you evaluate this step carefully?", 
                sanitized, 
                flags=re.IGNORECASE
            )

        if ground_truth_answer:
            clean_gt = ground_truth_answer.strip()
            if clean_gt and len(clean_gt) > 1:
                pattern = r"(?<![a-zA-Z0-9])" + re.escape(clean_gt) + r"(?![a-zA-Z0-9])"
                sanitized = re.sub(pattern, "[...your computed result...]", sanitized, flags=re.IGNORECASE)

        # Append pedagogical reinforcement
        sanitized += "\n\n💡 *Let's pause here: What do you observe about the relationship in this step?*"
        return sanitized
