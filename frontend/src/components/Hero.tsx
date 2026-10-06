import type { FC } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Bot, Sparkles, HelpCircle } from 'lucide-react';

interface HeroProps {
  onStartTutor: () => void;
  onViewBenchmarks: () => void;
}

export const Hero: FC<HeroProps> = ({ onStartTutor, onViewBenchmarks }) => {
  return (
    <section className="py-8 md:py-12 border-b border-brand-border bg-gradient-to-b from-white to-brand-orange-subtle overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange-light border border-brand-orange/30 text-brand-orange text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Track 1: Best Use of Gemma 4 · Sub-statement 2</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-dark tracking-tight leading-[1.15]">
              The AI STEM Tutor that{' '}
              <span className="text-brand-orange relative whitespace-nowrap">
                won't give you
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand-orange/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>{' '}
              the answer.
            </h1>

            <p className="text-lg text-brand-gray leading-relaxed max-w-xl">
              Powered by <strong>Google Gemma 4 Multimodal</strong>. SocraticLens reviews handwritten notebook steps, circuits, and geometry proofs, guiding students toward self-discovery through 4 graduated scaffolding tiers without ever leaking the final solution.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onStartTutor}
                className="btn-primary-orange flex items-center justify-center gap-2 px-7 py-4 text-sm font-bold shadow-lg shadow-orange-500/25"
              >
                <span>Launch Interactive Tutor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onViewBenchmarks}
                className="btn-secondary-clean flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold"
              >
                <span>View Empirical Benchmarks</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-brand-border">
              <div>
                <div className="text-2xl font-extrabold text-brand-orange font-mono">0.0%</div>
                <div className="text-xs text-brand-gray mt-0.5">Solution Leakage Rate</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-brand-dark font-mono">4 Tiers</div>
                <div className="text-xs text-brand-gray mt-0.5">Socratic Scaffolding</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-brand-dark font-mono">100/100</div>
                <div className="text-xs text-brand-gray mt-0.5">Pedagogical Index</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative Subtle Glow */}
              <div className="absolute -inset-4 bg-brand-orange/10 rounded-3xl blur-2xl -z-10" />

              {/* Main Product Window Preview */}
              <div className="saas-card rounded-2xl border border-brand-border bg-white p-5 shadow-xl space-y-4">
                {/* Header Window Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-medium text-brand-gray ml-2">
                      SocraticLens · Calculus Derivation Review
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Anti-Leakage Guard
                  </span>
                </div>

                {/* Simulated Student Workspace Card */}
                <div className="p-3.5 rounded-xl bg-brand-gray-light border border-brand-border notebook-grid space-y-2">
                  <div className="flex items-center justify-between text-xs text-brand-gray font-mono">
                    <span>Problem: $f(x) = (3x^2 + 5)^4$</span>
                    <span className="text-brand-orange font-semibold">Tier 2: Conceptual Nudge</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-brand-border font-mono text-xs text-brand-dark space-y-1 shadow-sm">
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Step 1: Power Rule Outer $\rightarrow 4(3x^2 + 5)^3$</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-700">
                      <span>Step 2: $f'(x) = 4(3x^2 + 5)^3$</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded">
                        Missing Inner Factor $(6x)$
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Socratic Dialogue Card */}
                <div className="p-4 rounded-xl bg-brand-orange-light/60 border border-brand-orange/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-brand-orange flex items-center justify-center text-white">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-brand-dark">Gemma 4 Socratic Guidance</span>
                  </div>

                  <p className="text-xs text-brand-gray leading-relaxed">
                    "You handled the outer exponent brilliantly with the power rule! Now, when differentiating composite functions of the form $f(g(x))$, what theorem reminds us to account for the rate of change of the inside function $g(x)$?"
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-brand-orange">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Probing inquiry preserves 100% student discovery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
