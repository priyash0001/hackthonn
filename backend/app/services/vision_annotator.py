from typing import List, Optional
from ..models.schemas import BoundingBox

class VisionAnnotator:
    """
    Parses spatial error references or generates normalized bounding boxes [0-1000]
    to highlight handwritten student work regions.
    """

    @classmethod
    def generate_step_annotations(
        cls, 
        student_work_text: str = "",
        error_type: Optional[str] = None
    ) -> List[BoundingBox]:
        """
        Synthesizes visual bounding boxes corresponding to handwritten / diagram steps.
        In multimodal Gemma 4 calls, the model produces normalized coordinate annotations.
        """
        boxes = []
        lines = [line.strip() for line in (student_work_text or "").split("\n") if line.strip()]
        
        if not lines:
            # Default highlight if no detailed breakdown
            boxes.append(BoundingBox(
                label="Area under inspection",
                ymin=200, xmin=100, ymax=600, xmax=900,
                status="focus"
            ))
            return boxes

        total_lines = len(lines)
        step_height = min(700 / max(1, total_lines), 200)

        for idx, line in enumerate(lines):
            ymin = 120 + idx * step_height
            ymax = ymin + step_height - 20
            
            # Simple heuristic detection for demo/mock or fallback
            is_suspicious = False
            if error_type:
                suspicious_terms = ["-", "+", "d/dx", "kvl", "v=", "f=", "sin", "cos", "="]
                if any(term in line.lower() for term in suspicious_terms) and idx >= 1:
                    is_suspicious = True

            boxes.append(BoundingBox(
                label=f"Step {idx + 1}: {line[:35]}...",
                ymin=round(ymin, 1),
                xmin=80,
                ymax=round(ymax, 1),
                xmax=920,
                status="error" if (is_suspicious and idx == total_lines - 1) else "ok"
            ))

        return boxes
