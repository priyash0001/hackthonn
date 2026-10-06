from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class HintTier(int, Enum):
    SMALL_HINT = 1        # Hint 1: Small Hint (small clue)
    GUIDED_HINT = 2       # Hint 2: Guided Hint (stronger explanation & next direction)
    DETAILED_GUIDANCE = 3 # Hint 3: Detailed Guidance (step-by-step conceptual breakdown)

class SubjectArea(str, Enum):
    MATH = "math"
    PHYSICS = "physics"
    CIRCUITS = "circuits"
    PROOFS = "proofs"
    CHEMISTRY = "chemistry"
    GENERAL = "general"

class BoundingBox(BaseModel):
    label: str = Field(..., description="Description of the annotated region (e.g. 'Step 2: Sign error')")
    ymin: float = Field(..., ge=0.0, le=1000.0, description="Normalized top coordinate 0-1000")
    xmin: float = Field(..., ge=0.0, le=1000.0, description="Normalized left coordinate 0-1000")
    ymax: float = Field(..., ge=0.0, le=1000.0, description="Normalized bottom coordinate 0-1000")
    xmax: float = Field(..., ge=0.0, le=1000.0, description="Normalized right coordinate 0-1000")
    status: str = Field("warning", description="ok | warning | error | focus")

class SocraticMessage(BaseModel):
    role: str = Field(..., description="'user' | 'assistant' | 'system'")
    content: str
    timestamp: Optional[str] = None

class SocraticRequest(BaseModel):
    image_base64: Optional[str] = None
    problem_text: Optional[str] = None
    student_work_text: Optional[str] = None
    chat_history: List[SocraticMessage] = []
    current_tier: HintTier = HintTier.SMALL_HINT
    subject: SubjectArea = SubjectArea.GENERAL
    api_key_override: Optional[str] = None
    model_override: Optional[str] = None

class SocraticResponse(BaseModel):
    tier: HintTier
    socratic_guidance: str = Field(..., description="The carefully crafted Socratic guiding response")
    probing_question: str = Field(..., description="Key question to encourage self-reflection")
    identified_error_type: Optional[str] = None
    bounding_boxes: List[BoundingBox] = []
    leakage_score: float = Field(0.0, description="0.0 = zero answer leakage, 1.0 = direct answer leaked")
    is_correct: bool = False
    mastery_celebration: Optional[str] = None
    model_used: str = "gemini-3.5-flash"

class BenchmarkItem(BaseModel):
    id: str
    title: str
    subject: SubjectArea
    problem_statement: str
    student_work: str
    actual_mistake: str
    ground_truth_answer: str
    tier_expectations: Dict[int, str] = {}

class BenchmarkEvaluationResult(BaseModel):
    item_id: str
    title: str
    subject: SubjectArea
    direct_model_response: str
    direct_leaked: bool
    socratic_response: str
    socratic_leaked: bool
    socratic_inquiry_present: bool
    pedagogical_score: float

class BenchmarkSummary(BaseModel):
    total_test_cases: int
    baseline_direct_leakage_rate: float
    socratic_lens_leakage_rate: float
    socratic_inquiry_ratio: float
    mean_pedagogical_score: float
    evaluation_results: List[BenchmarkEvaluationResult]
    domain_breakdown: Optional[Dict[str, Any]] = None
