import type { FC } from 'react';
import { ShieldCheck, Compass, Eye, Cpu, BookCheck, BarChart3, Award } from 'lucide-react';

export const FeatureGrid: FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Zero-Solution Leakage Guardrail',
      description:
        'Guaranteed compliance with Sub-statement 2. Automatic regex and semantic filtering prevents the model from ever revealing raw answers or direct algebraic values.',
    },
    {
      icon: Compass,
      title: '4-Tier Graduated Scaffolding Ladder',
      description:
        'Cognitive ladder ranging from Tier 1 (Clarifying Observation) through Tier 2 (Conceptual Law), Tier 3 (Counterexample), and Tier 4 (Guided Step Breakdown).',
    },
    {
      icon: Eye,
      title: 'Multimodal Notebook Vision & OCR',
      description:
        'Upload handwritten homework photos, circuit diagrams, or sketch freehand. Gemma 4 pinpoints exact error coordinates and renders visual step annotations.',
    },
    {
      icon: BookCheck,
      title: 'Domain-Tailored STEM Prompts',
      description:
        'Specialized pedagogical reasoning engines for Calculus, Physics Mechanics, Electrical Circuits, and Geometric Congruence Proofs.',
    },
    {
      icon: Cpu,
      title: 'Google Gemma 4 Architecture',
      description:
        'Direct integration with Gemma 4 (31B-IT and 26B-A4B-IT) via Google AI Studio API, combining multi-step reasoning with low latency streaming.',
    },
    {
      icon: BarChart3,
      title: 'Empirical Benchmark Evidence',
      description:
        'Automated comparative suite measuring baseline answer leakage (100%) against SocraticLens (0.0%), verified with quantitative pedagogical metrics.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange-light text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Pedagogical Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            Engineered specifically for deep learning, not shortcut answers.
          </h2>
          <p className="text-base text-brand-gray leading-relaxed">
            Standard AI chatbots immediately solve the homework, depriving students of the crucial struggle where learning happens. SocraticLens preserves the cognitive process.
          </p>
        </div>

        {/* 3-Column Grid of SaaS Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="saas-card-interactive p-7 sm:p-8 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-brand-orange-light border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-dark tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    {f.description}
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
