import type { FC } from 'react';
import { ShieldCheck, Settings, Sparkles, Cpu, Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'workspace' | 'benchmark';
  setActiveTab: (tab: 'workspace' | 'benchmark') => void;
  onOpenSettings: () => void;
  modelName: string;
  hasApiKey: boolean;
  onScrollToWorkspace?: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  modelName,
  hasApiKey,
  onScrollToWorkspace,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('workspace')}>
          <div className="h-10 w-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-md shadow-orange-500/20 text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-sans font-bold text-lg text-brand-dark tracking-tight">
                SocraticLens
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-md bg-brand-orange-light text-brand-orange border border-brand-orange/20">
                Gemma 4
              </span>
            </div>
            <p className="text-[11px] text-brand-gray hidden sm:block">
              Socratic STEM Tutoring Platform
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-brand-gray-light p-1 rounded-xl border border-brand-border">
          <button
            onClick={() => {
              setActiveTab('workspace');
              if (onScrollToWorkspace) onScrollToWorkspace();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workspace'
                ? 'bg-white text-brand-orange shadow-sm border border-brand-border'
                : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Interactive Tutor
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'benchmark'
                ? 'bg-white text-brand-orange shadow-sm border border-brand-border'
                : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            Evaluation & Benchmark
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Zero Leakage Badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono text-[11px]">
              Zero-Leakage: {hasApiKey ? 'Cloud Verified' : 'Active'}
            </span>
          </div>

          {/* Model Status / Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-brand-gray-light border border-brand-border text-brand-gray hover:text-brand-dark text-xs font-medium transition shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-brand-orange" />
            <span className="hidden sm:inline font-mono text-[11px]">{modelName.replace('-it', '')}</span>
            <Settings className="w-3 h-3 text-slate-400" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => {
              setActiveTab('workspace');
              if (onScrollToWorkspace) onScrollToWorkspace();
            }}
            className="btn-primary-orange flex items-center space-x-1.5 px-4 py-2 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Live Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
