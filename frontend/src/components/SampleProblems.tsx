import type { FC } from 'react';
import type { LucideIcon } from 'lucide-react';
import { SubjectArea } from '../types';
import { Sigma, Zap, Orbit, BookCheck, Calculator, Sparkles } from 'lucide-react';

export interface SampleProblem {
  id: string;
  title: string;
  subject: SubjectArea;
  badge: string;
  problemText: string;
  studentWorkText: string;
  icon: LucideIcon;
}

export const SAMPLE_PROBLEMS: SampleProblem[] = [
  {
    id: 'calc-01',
    title: 'Chain Rule Power Mistake',
    subject: SubjectArea.MATH,
    badge: 'Calculus',
    icon: Sigma,
    problemText: 'Differentiate with respect to x: f(x) = (3x^2 + 5)^4',
    studentWorkText: 'f(x) = (3x^2 + 5)^4\nStep 1: Power rule -> 4*(3x^2 + 5)^3\nStep 2: f\'(x) = 4(3x^2 + 5)^3'
  },
  {
    id: 'phys-02',
    title: 'Ramp Normal Force Mistake',
    subject: SubjectArea.PHYSICS,
    badge: 'Physics',
    icon: Orbit,
    problemText: 'A block of mass m rests on a frictionless ramp inclined at angle theta. Find normal force N.',
    studentWorkText: 'Free Body Diagram:\n- Gravity = mg downwards\n- Ramp Normal = N perpendicular\nEquation:\nN - mg = 0 => N = mg'
  },
  {
    id: 'circ-03',
    title: 'KVL Loop Sign Convention',
    subject: SubjectArea.CIRCUITS,
    badge: 'Circuits',
    icon: Zap,
    problemText: 'Single loop circuit: 12V battery and resistors R1=4 ohms, R2=2 ohms in series. Write KVL to find current I.',
    studentWorkText: 'Loop clockwise:\n+12V (source) + 4I + 2I = 0\n12 + 6I = 0 => I = -2A'
  },
  {
    id: 'geom-04',
    title: 'AAA Triangle Congruence Proof',
    subject: SubjectArea.PROOFS,
    badge: 'Geometry',
    icon: BookCheck,
    problemText: 'Triangles ABC & DEF have equal corresponding angles A=D, B=E, C=F. Prove triangle congruence.',
    studentWorkText: 'Proof:\n1. Angle A = Angle D\n2. Angle B = Angle E\n3. Angle C = Angle F\nConclusion: ABC is congruent to DEF by AAA theorem.'
  },
  {
    id: 'alg-05',
    title: 'Bracket Sign Distribution',
    subject: SubjectArea.MATH,
    badge: 'Algebra',
    icon: Calculator,
    problemText: 'Simplify algebraic expression: 5x - (3x - 8)',
    studentWorkText: 'Expression: 5x - (3x - 8)\nStep 1: 5x - 3x - 8\nStep 2: 2x - 8'
  }
];

interface SampleProblemsProps {
  onSelectProblem: (problem: SampleProblem) => void;
  selectedProblemId?: string;
}

export const SampleProblems: FC<SampleProblemsProps> = ({
  onSelectProblem,
  selectedProblemId
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-brand-orange-light flex items-center justify-center text-brand-orange">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
            Quick Problem Presets
          </span>
          <span className="text-xs text-brand-gray hidden sm:inline">• Click to load curated test cases</span>
        </div>
        <span className="text-xs text-brand-gray font-mono">5 Presets</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {SAMPLE_PROBLEMS.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedProblemId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectProblem(p)}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all text-xs relative overflow-hidden group ${
                isSelected
                  ? 'bg-white border-brand-orange ring-2 ring-brand-orange/20 shadow-md shadow-orange-500/10'
                  : 'bg-white border-brand-border hover:border-brand-orange/50 hover:bg-brand-orange-subtle'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-orange" />
              )}
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                  isSelected
                    ? 'bg-brand-orange-light text-brand-orange border-brand-orange/30'
                    : 'bg-brand-gray-light text-brand-gray border-brand-border'
                }`}>
                  {p.badge}
                </span>
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-orange' : 'text-brand-gray group-hover:text-brand-orange'}`} />
              </div>
              <span className={`font-semibold truncate w-full ${isSelected ? 'text-brand-dark' : 'text-brand-dark group-hover:text-brand-orange'}`}>
                {p.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
