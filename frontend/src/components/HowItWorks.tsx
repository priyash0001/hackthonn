import type { FC } from 'react';
import { Upload, Search, MessageSquare, Sparkles } from 'lucide-react';

export const HowItWorks: FC = () => {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Submit Your Steps',
      description: 'Paste LaTeX derivation steps, upload notebook photos, or sketch a diagram on the canvas.',
    },
    {
      number: '02',
      icon: Search,
      title: 'Vision & Mistake Localization',
      description: 'Gemma 4 Multimodal analyzes the mathematical transitions and flags the exact line or coordinate of confusion.',
    },
    {
      number: '03',
      icon: MessageSquare,
      title: 'Socratic Dialogue & Scaffolding',
      description: 'Receive tiered reflective questions and conceptual nudges designed to prompt the student to think.',
    },
    {
      number: '04',
      icon: Sparkles,
      title: 'Self-Discovery Eureka',
      description: 'Identify and fix the mistake independently, cementing long-term mastery and conceptual understanding.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-orange-subtle border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-light text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <span>The Socratic Method</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            How SocraticLens guides your learning
          </h2>
          <p className="text-base text-brand-gray">
            A structured, 4-step pedagogical workflow that turns mistakes into deep cognitive insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="saas-card p-6 flex flex-col justify-between relative bg-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl bg-brand-orange-light border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black font-mono text-brand-border">
                      {s.number}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-brand-dark pt-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
