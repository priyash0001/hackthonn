import type { FC } from 'react';
import { ShieldCheck, HelpCircle, Award } from 'lucide-react';

interface MetricChartProps {
  baselineLeakage: number;
  socraticLeakage: number;
  inquiryRatio: number;
  pedagogicalScore: number;
}

export const MetricChart: FC<MetricChartProps> = ({
  baselineLeakage,
  socraticLeakage,
  inquiryRatio,
  pedagogicalScore,
}) => {
  const metrics = [
    {
      title: 'Answer Leakage Rate',
      qualifier: 'Lower is Better',
      icon: ShieldCheck,
      baseline: baselineLeakage,
      socratic: socraticLeakage,
      unit: '%',
    },
    {
      title: 'Socratic Inquiry Ratio',
      qualifier: 'Higher is Better',
      icon: HelpCircle,
      baseline: 0,
      socratic: inquiryRatio,
      unit: '%',
    },
    {
      title: 'Pedagogical Quality Score',
      qualifier: 'Higher is Better',
      icon: Award,
      baseline: 0,
      socratic: pedagogicalScore,
      unit: '/100',
    },
  ];

  return (
    <div className="saas-card p-6 bg-white border border-brand-border space-y-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-brand-border pb-3.5">
        <div>
          <h3 className="text-sm font-bold text-brand-dark">
            Visual Benchmark Comparison
          </h3>
          <p className="text-xs text-brand-gray mt-0.5">
            Baseline Direct Solvers vs. Gemma 4 SocraticLens
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block" />
            <span className="text-brand-gray font-mono">Baseline Direct AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span className="text-emerald-700 font-mono font-bold">SocraticLens</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-brand-dark flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-brand-orange" />
                  {m.title}
                  <span className="text-[10px] font-mono text-brand-gray ml-1">({m.qualifier})</span>
                </span>
              </div>

              {/* Baseline Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-20 text-[11px] text-brand-gray font-mono">Baseline:</span>
                  <div className="flex-1 h-3.5 bg-brand-gray-light rounded-full overflow-hidden border border-brand-border relative">
                    <div
                      style={{ width: `${Math.min(100, m.baseline)}%` }}
                      className="h-full bg-rose-500 rounded-full transition-all duration-700"
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-rose-600 text-xs">
                    {m.baseline}{m.unit}
                  </span>
                </div>

                {/* SocraticLens Bar */}
                <div className="flex items-center gap-2.5 text-xs">
                  <span className="w-20 text-[11px] text-emerald-700 font-mono font-bold">Socratic:</span>
                  <div className="flex-1 h-3.5 bg-brand-gray-light rounded-full overflow-hidden border border-brand-border relative">
                    <div
                      style={{ width: `${Math.min(100, m.socratic)}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700 shadow-sm shadow-emerald-500/20"
                    />
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-emerald-600 text-xs">
                    {m.socratic}{m.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
