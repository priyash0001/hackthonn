import { HintTier, SubjectArea } from '../types';
import type { SocraticResponse, BenchmarkItem, BenchmarkSummary, SocraticMessage } from '../types';

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    // If frontend is served by FastAPI on port 8000
    if (window.location.port === '8000' || window.location.origin.includes(':8000')) {
      return '';
    }
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
}

export async function checkBackendHealth() {
  const baseUrl = getApiBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${baseUrl}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (error) {
    console.warn('Backend offline or unreachable, using client-side fallback mode:', error);
    return { status: 'offline', service: 'Local Mode', has_api_key: false };
  }
}

export async function analyzeSocraticWork(params: {
  imageBase64?: string | null;
  problemText?: string;
  studentWorkText?: string;
  chatHistory?: SocraticMessage[];
  currentTier: HintTier;
  subject: SubjectArea;
  apiKeyOverride?: string;
  modelOverride?: string;
}): Promise<SocraticResponse> {
  const baseUrl = getApiBaseUrl();
  const controller = new AbortController();
  // 35-second client timeout
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(`${baseUrl}/api/socratic/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        image_base64: params.imageBase64,
        problem_text: params.problemText,
        student_work_text: params.studentWorkText,
        chat_history: params.chatHistory || [],
        current_tier: params.currentTier,
        subject: params.subject,
        api_key_override: params.apiKeyOverride,
        model_override: params.modelOverride || 'gemma-4-26b-a4b-it',
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let detail = 'Analysis request failed';
      try {
        const err = await response.json();
        detail = err.detail || detail;
      } catch {}
      throw new Error(`Server Error (${response.status}): ${detail}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Model request timed out after 35 seconds. Please click Retry.');
    }
    console.error('API call failed:', error);
    throw error;
  }
}

export async function fetchBenchmarkDataset(): Promise<BenchmarkItem[]> {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/benchmark/dataset`);
    if (!res.ok) throw new Error('Failed to fetch dataset');
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch benchmark dataset:', error);
    return [];
  }
}

export async function runBenchmarkEvaluation(): Promise<BenchmarkSummary> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/api/benchmark/run`);
  if (!res.ok) throw new Error('Benchmark execution failed');
  return await res.json();
}
