export const HintTier = {
  HINT_1: 1, // Hint 1: Small Hint
  HINT_2: 2, // Hint 2: Guided Hint
  HINT_3: 3, // Hint 3: Detailed Guidance
} as const;

export type HintTier = typeof HintTier[keyof typeof HintTier];

export const SubjectArea = {
  MATH: 'math',
  PHYSICS: 'physics',
  CIRCUITS: 'circuits',
  PROOFS: 'proofs',
  CHEMISTRY: 'chemistry',
  GENERAL: 'general',
} as const;

export type SubjectArea = typeof SubjectArea[keyof typeof SubjectArea];

export interface BoundingBox {
  label: string;
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
  status: 'ok' | 'warning' | 'error' | 'focus';
}

export interface SocraticMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  probing_question?: string;
  tier?: HintTier;
  timestamp?: string;
  identified_error_type?: string;
}

export interface SocraticResponse {
  tier: HintTier;
  socratic_guidance: string;
  probing_question: string;
  identified_error_type?: string;
  bounding_boxes: BoundingBox[];
  leakage_score: number;
  is_correct: boolean;
  mastery_celebration?: string;
  model_used: string;
}

export interface BenchmarkItem {
  id: string;
  title: string;
  subject: SubjectArea;
  problem_statement: string;
  student_work: string;
  actual_mistake: string;
  ground_truth_answer: string;
  tier_expectations: Record<number, string>;
}

export interface EvaluationResult {
  item_id: string;
  title: string;
  subject: SubjectArea;
  direct_model_response: string;
  direct_leaked: boolean;
  socratic_response: string;
  socratic_leaked: boolean;
  socratic_inquiry_present: boolean;
  pedagogical_score: number;
}

export interface BenchmarkSummary {
  total_test_cases: number;
  baseline_direct_leakage_rate: number;
  socratic_lens_leakage_rate: number;
  socratic_inquiry_ratio: number;
  mean_pedagogical_score: number;
  evaluation_results: EvaluationResult[];
  domain_breakdown?: Record<string, {
    total: number;
    baseline_leakage_rate: number;
    socratic_leakage_rate: number;
    inquiry_ratio: number;
    mean_score: number;
  }>;
}
