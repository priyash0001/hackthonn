import type { FC } from 'react';
import type { HintTier } from '../types';
import { Lightbulb, Compass, Footprints, ShieldCheck, Check } from 'lucide-react';

interface HintLadderProps {
  currentTier: HintTier;
  onSelectTier: (tier: HintTier) => void;
  leakageScore: number;
}

export const HintLadder: FC<HintLadderProps> = ({
  currentTier,
  onSelectTier,
  leakageScore
}) => {
  const tiers = [
    {
      tier: 1 as HintTier,
      title: 'Hint 1 — Small Hint',
      subtitle: 'Minimal Clue',
      desc: '"Give me a small clue so I can continue myself."',
      icon: Lightbulb,
    },
    {
      tier: 2 as HintTier,
      title: 'Hint 2 — Guided Hint',
      subtitle: 'Conceptual Next Step',
      desc: '"Give me a stronger explanation and point me toward the next step."',
      icon: Compass,
    },
    {
      tier: 3 as HintTier,
      title: 'Hint 3 — Detailed Guidance',
      subtitle: 'Step-by-Step Breakdown',
      desc: '"Give me detailed step-by-step guidance without revealing the raw final answer."',
      icon: Footprints,
    }
  ];

  return (
    <div className="saas-card p-6 bg-white border border-brand-border shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-brand-dark">
              Socratic Scaffolding Ladder
            </h3>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-brand-orange-light text-brand-orange border border-brand-orange/30">
              Assistance Level {Number(currentTier || 1)} of 3
            </span>
          </div>
          <p className="text-xs text-brand-gray mt-0.5">
            Choose how much guidance you want before analyzing your work.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="font-mono text-[11px] text-emerald-800">
            Solution Leakage: <strong>{leakageScore > 0 ? `${(leakageScore * 100).toFixed(0)}%` : '0.0% (Forbidden)'}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tiers.map((t) => {
          const Icon = t.icon;
          const isActive = Number(currentTier) === Number(t.tier);
          const isCompleted = Number(currentTier) > Number(t.tier);
          return (
            <button
              key={t.tier}
              onClick={() => onSelectTier(t.tier)}
              className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-brand-orange-subtle border-brand-orange ring-2 ring-brand-orange/20 shadow-sm'
                  : isCompleted
                  ? 'bg-emerald-50/50 border-emerald-200 hover:border-brand-orange/50'
                  : 'bg-white border-brand-border hover:border-brand-orange/40 hover:bg-brand-orange-subtle'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange" />
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-brand-orange text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-brand-gray-light text-brand-gray'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-dark block">
                      {t.title}
                    </span>
                    <span className="text-[10px] font-mono text-brand-gray block">
                      {t.subtitle}
                    </span>
                  </div>
                </div>

                {isCompleted && (
                  <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-brand-gray line-clamp-2 leading-relaxed mt-1 italic">
                {t.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
