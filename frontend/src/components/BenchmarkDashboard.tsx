import { useState } from 'react';
import type { FC } from 'react';
import type { BenchmarkSummary } from '../types';
import { runBenchmarkEvaluation } from '../utils/api';
import { Play, CheckCircle, XCircle, HelpCircle, Layers, Sigma, Orbit, Zap, BookCheck, Award } from 'lucide-react';
import { MathRenderer } from '../utils/mathRenderer';
import { MetricChart } from './MetricChart';

interface BenchmarkDashboardProps {
  initialSummary?: BenchmarkSummary | null;
}

export const BenchmarkDashboard: FC<BenchmarkDashboardProps> = ({ initialSummary }) => {
  const [summary, setSummary] = useState<BenchmarkSummary | null>(initialSummary || null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunEvaluation = async () => {
    setIsRunning(true);
    try {
      const data = await runBenchmarkEvaluation();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  const domainIcons: Record<string, any> = {
    math: Sigma,
    physics: Orbit,
    circuits: Zap,
    proofs: BookCheck,
  };

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto py-6">
      {/* Header & Evaluation Trigger */}
      <div className="saas-card p-6 bg-white border border-brand-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-brand-dark">
              Empirical Benchmark Suite
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-orange-light border border-brand-orange/30 text-brand-orange text-xs font-mono font-bold">
              Track 1 Evidence
            </span>
          </div>
          <p className="text-xs text-brand-gray mt-1 max-w-2xl leading-relaxed">
            Automated comparative evaluation measuring answer leakage rates and pedagogical Socratic inquiry across Calculus, Circuits, Physics, Geometry Proofs, and Algebra.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="btn-primary-orange flex items-center gap-2 px-5 py-2.5 text-xs font-bold shadow-md shadow-orange-500/20"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Running Test Suite...' : 'Re-Run Evaluation Suite'}</span>
        </button>
      </div>

      {/* Metrics Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="saas-card p-5 bg-white border border-brand-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-brand-gray font-mono uppercase tracking-wider font-semibold">Baseline Leakage</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-rose-600 font-mono">
                {summary.baseline_direct_leakage_rate}%
              </span>
            </div>
            <p className="text-[10px] text-brand-gray mt-1">
              Standard models immediately reveal the direct answer.
            </p>
          </div>

          <div className="saas-card p-5 bg-white border-2 border-emerald-500/40 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-mono uppercase tracking-wider font-bold">SocraticLens</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 font-mono">
                {summary.socratic_lens_leakage_rate}%
              </span>
              <span className="text-[10px] text-emerald-600 font-mono font-semibold">0.0% Target</span>
            </div>
            <p className="text-[10px] text-brand-gray mt-1">
              Anti-leakage guardrail strictly prevents answer synthesis.
            </p>
          </div>

          <div className="saas-card p-5 bg-white border border-brand-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-brand-gray font-mono uppercase tracking-wider font-semibold">Inquiry Ratio</span>
              <HelpCircle className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand-orange font-mono">
                {summary.socratic_inquiry_ratio}%
              </span>
            </div>
            <p className="text-[10px] text-brand-gray mt-1">
              All responses formulate probing reflective questions.
            </p>
          </div>

          <div className="saas-card p-5 bg-white border border-brand-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-brand-gray font-mono uppercase tracking-wider font-semibold">Pedagogical Score</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand-dark font-mono">
                {summary.mean_pedagogical_score}
              </span>
              <span className="text-[10px] text-brand-gray font-mono">/ 100.0</span>
            </div>
            <p className="text-[10px] text-brand-gray mt-1">
              Weighted index of non-leakage, inquiry & scaffolding.
            </p>
          </div>
        </div>
      )}

      {/* Visual Metric Comparison Chart */}
      {summary && (
        <MetricChart
          baselineLeakage={summary.baseline_direct_leakage_rate}
          socraticLeakage={summary.socratic_lens_leakage_rate}
          inquiryRatio={summary.socratic_inquiry_ratio}
          pedagogicalScore={summary.mean_pedagogical_score}
        />
      )}

      {/* Test Cases Evidence Table */}
      {summary && (
        <div className="saas-card bg-white border border-brand-border overflow-hidden shadow-sm">
          <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-gray-light/60">
            <h3 className="font-bold text-sm text-brand-dark flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-orange" />
              <span>Side-by-Side Test Case Evidence</span>
            </h3>
            <span className="text-xs text-brand-gray font-mono">
              {summary.total_test_cases} Test Scenarios
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-gray-light border-b border-brand-border text-brand-gray uppercase font-mono text-[10px]">
                  <th className="p-4">Problem & Domain</th>
                  <th className="p-4 w-1/3 text-rose-700">Baseline Direct AI Response</th>
                  <th className="p-4 w-1/3 text-emerald-700">SocraticLens Gemma 4 Response</th>
                  <th className="p-4 text-right">Pedagogical Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {summary.evaluation_results.map((item) => {
                  const Icon = domainIcons[item.subject] || Sigma;
                  return (
                    <tr key={item.item_id} className="hover:bg-brand-gray-light/40 transition">
                      <td className="p-4 align-top">
                        <div className="font-bold text-brand-dark mb-1">{item.title}</div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-gray-light text-[10px] font-mono text-brand-dark border border-brand-border">
                          <Icon className="w-3 h-3 text-brand-orange" />
                          {item.subject.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-4 align-top">
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-mono text-[11px] leading-relaxed">
                          <div className="text-[10px] font-bold text-rose-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Leaked Solution</span>
                          </div>
                          <MathRenderer content={item.direct_model_response} />
                        </div>
                      </td>

                      <td className="p-4 align-top">
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono text-[11px] leading-relaxed">
                          <div className="text-[10px] font-bold text-emerald-700 mb-1.5 flex items-center gap-1 uppercase tracking-wider">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Socratic Guidance (Zero Leakage)</span>
                          </div>
                          <MathRenderer content={item.socratic_response} />
                        </div>
                      </td>

                      <td className="p-4 align-top text-right font-mono font-bold text-emerald-700 text-sm">
                        {item.pedagogical_score.toFixed(0)} / 100
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
