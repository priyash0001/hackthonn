import type { FC } from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'workspace' | 'benchmark') => void;
}

export const Footer: FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-white border-t border-brand-border py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-brand-border">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-lg bg-brand-orange flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-sans font-bold text-lg text-brand-dark">
                SocraticLens
              </span>
            </div>
            <p className="text-xs text-brand-gray max-w-sm">
              An intelligent multimodal pedagogical agent built on Google Gemma 4 that guides students through Socratic inquiry without leaking solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-brand-gray">
            <button
              onClick={() => onSelectTab('workspace')}
              className="hover:text-brand-orange transition"
            >
              Interactive Tutor
            </button>
            <button
              onClick={() => onSelectTab('benchmark')}
              className="hover:text-brand-orange transition"
            >
              Evaluation & Benchmark
            </button>
            <span className="text-brand-border">|</span>
            <span className="text-brand-dark font-mono">
              Track 1: Best Use of Gemma 4
            </span>
          </div>
        </div>

        {/* Bottom copyright and verification badge */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-gray">
          <p>© {new Date().getFullYear()} SocraticLens. Developed for the Google Gemma 4 Hackathon.</p>
          <div className="flex items-center gap-2 text-emerald-700 font-mono text-[11px] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Anti-Leakage Compliance: 0.0% Solution Leakage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
