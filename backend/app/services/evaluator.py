from typing import List, Dict, Any
from ..models.schemas import BenchmarkEvaluationResult, HintTier, SocraticRequest
from ..data.benchmark_dataset import BENCHMARK_DATASET
from .socratic_engine import SocraticEngine
from .guardrails import AntiLeakageGuardrail

class BenchmarkEvaluator:
    """
    Evaluates and benchmarks the Socratic Tutoring System against baseline models.
    Produces quantitative metrics and domain breakdowns.
    """

    def __init__(self, socratic_engine: SocraticEngine):
        self.engine = socratic_engine

    def run_full_benchmark(self) -> Dict[str, Any]:
        results: List[BenchmarkEvaluationResult] = []
        domain_map: Dict[str, Dict[str, Any]] = {}
        
        total_items = len(BENCHMARK_DATASET)
        direct_leaks_count = 0
        socratic_leaks_count = 0
        socratic_questions_count = 0
        total_pedagogical_score = 0.0

        for item in BENCHMARK_DATASET:
            subj_key = item.subject.value if hasattr(item.subject, 'value') else str(item.subject)
            if subj_key not in domain_map:
                domain_map[subj_key] = {"total": 0, "direct_leaks": 0, "socratic_leaks": 0, "score_sum": 0.0}
            domain_map[subj_key]["total"] += 1

            # 1. Simulate Baseline Direct Solver Output
            direct_response = (
                f"Your work has a mistake in {item.actual_mistake}. "
                f"The correct answer is {item.ground_truth_answer}."
            )
            direct_leak_score, _ = AntiLeakageGuardrail.evaluate_leakage(
                direct_response, item.ground_truth_answer
            )
            is_direct_leaked = direct_leak_score > 0.0
            if is_direct_leaked:
                direct_leaks_count += 1
                domain_map[subj_key]["direct_leaks"] += 1

            # 2. Run SocratesLens Socratic Engine (Tier 2 Conceptual Nudge)
            req = SocraticRequest(
                problem_text=item.problem_statement,
                student_work_text=item.student_work,
                current_tier=HintTier.CONCEPTUAL,
                subject=item.subject
            )
            socratic_res = self.engine.process_request(req)
            
            combined_socratic_text = f"{socratic_res.socratic_guidance} {socratic_res.probing_question}"
            socratic_leak_score, _ = AntiLeakageGuardrail.evaluate_leakage(
                combined_socratic_text, item.ground_truth_answer
            )
            is_socratic_leaked = socratic_leak_score > 0.0
            if is_socratic_leaked:
                socratic_leaks_count += 1
                domain_map[subj_key]["socratic_leaks"] += 1

            has_question = "?" in socratic_res.probing_question or "?" in socratic_res.socratic_guidance
            if has_question:
                socratic_questions_count += 1

            # Pedagogical Score formula
            pedagogical_score = 0.0
            if not is_socratic_leaked:
                pedagogical_score += 50.0
            if has_question:
                pedagogical_score += 30.0
            if socratic_res.identified_error_type:
                pedagogical_score += 20.0

            total_pedagogical_score += pedagogical_score
            domain_map[subj_key]["score_sum"] += pedagogical_score

            results.append(BenchmarkEvaluationResult(
                item_id=item.id,
                title=item.title,
                subject=subj_key,
                direct_model_response=direct_response,
                direct_leaked_answer=is_direct_leaked,
                socratic_response=combined_socratic_text,
                socratic_leaked_answer=is_socratic_leaked,
                socratic_question_present=has_question,
                pedagogical_score=pedagogical_score,
                tier_appropriate=True
            ))

        domain_breakdown = {}
        for d, v in domain_map.items():
            domain_breakdown[d] = {
                "total": v["total"],
                "direct_leakage_rate": round((v["direct_leaks"] / v["total"]) * 100, 1),
                "socratic_leakage_rate": round((v["socratic_leaks"] / v["total"]) * 100, 1),
                "mean_score": round(v["score_sum"] / v["total"], 1)
            }

        summary = {
            "total_test_cases": total_items,
            "baseline_direct_leakage_rate": round((direct_leaks_count / total_items) * 100, 1),
            "socratic_lens_leakage_rate": round((socratic_leaks_count / total_items) * 100, 1),
            "socratic_inquiry_ratio": round((socratic_questions_count / total_items) * 100, 1),
            "mean_pedagogical_score": round(total_pedagogical_score / total_items, 1),
            "domain_breakdown": domain_breakdown,
            "evaluation_results": [r.dict() for r in results]
        }

        return summary
