import { useState, useRef, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import type { SocraticMessage, HintTier } from '../types';
import { Send, Bot, User, Sparkles, HelpCircle, ShieldCheck, Award, MessageSquareQuote, AlertTriangle, RotateCcw, Compass, Lightbulb, Footprints, Layers } from 'lucide-react';
import { MathRenderer } from '../utils/mathRenderer';
import confetti from 'canvas-confetti';

interface ChatInterfaceProps {
  messages: SocraticMessage[];
  onSendMessage: (text: string) => void;
  onSelectHintLevel: (level: 1 | 2 | 3) => void;
  onRequestHintChoice: () => void;
  currentTier: HintTier;
  isLoading: boolean;
  showHintChooser: boolean;
  isCorrect: boolean;
  masteryCelebration?: string;
  errorMessage?: string | null;
  onRetry?: () => void;
}

export const ChatInterface: FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onSelectHintLevel,
  onRequestHintChoice,
  currentTier,
  isLoading,
  showHintChooser,
  isCorrect,
  masteryCelebration,
  errorMessage,
  onRetry
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showHintChooser, errorMessage]);

  useEffect(() => {
    if (isCorrect) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F28C00', '#10B981', '#FF9A24', '#6ffbbe']
      });
    }
  }, [isCorrect]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="saas-card p-6 bg-white border border-brand-border flex flex-col h-full shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-brand-border">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-brand-orange-light border border-brand-orange/30 flex items-center justify-center text-brand-orange">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-brand-dark">Socratic Dialogue</h3>
            <span className="text-[10px] font-mono text-brand-gray">Guiding you to self-discovery</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-mono font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Zero-Leakage Guard
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1.5 min-h-[300px]">
        {messages.length === 0 && !isLoading && !showHintChooser && !errorMessage && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-brand-gray">
            <div className="h-12 w-12 rounded-2xl bg-brand-orange-light flex items-center justify-center text-brand-orange mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-brand-dark">Ready to review your work!</p>
            <p className="text-xs text-brand-gray max-w-xs mt-1 leading-relaxed">
              Enter your problem or derivation on the left, then click <strong>"Ask Socratic Tutor"</strong> to choose your hint level.
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isBot = msg.role === 'assistant';
          const tierNum = Number(msg.tier || currentTier || 1);
          return (
            <div
              key={index}
              className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              <div
                className={`h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isBot
                    ? 'bg-brand-orange text-white shadow-sm'
                    : 'bg-brand-dark text-white shadow-sm'
                }`}
              >
                {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isBot
                    ? 'bg-brand-gray-light border border-brand-border text-brand-dark shadow-sm'
                    : 'bg-brand-orange text-white shadow-md shadow-orange-500/10'
                }`}
              >
                {/* Header Hint Level Badge */}
                {isBot && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-border">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-brand-orange border border-brand-orange/30 shadow-xs">
                      Hint Level {tierNum}
                    </span>
                    {msg.identified_error_type && (
                      <span className="text-[10px] text-brand-gray font-mono truncate max-w-[160px]">
                        {msg.identified_error_type}
                      </span>
                    )}
                  </div>
                )}

                {/* Guidance Body */}
                <div className={`${isBot ? 'text-brand-dark' : 'text-white'} font-body leading-relaxed`}>
                  <MathRenderer content={msg.content} />
                </div>

                {/* Socratic Inquiry Highlight Box */}
                {isBot && msg.probing_question && (
                  <div className="mt-3 p-3.5 rounded-xl bg-white border border-brand-orange/40 text-brand-dark shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-orange mb-1">
                      <MessageSquareQuote className="w-3.5 h-3.5" />
                      <span>Socratic Inquiry:</span>
                    </div>
                    <div className="text-xs italic text-brand-dark font-medium leading-relaxed">
                      <MathRenderer content={msg.probing_question} />
                    </div>
                  </div>
                )}

                {/* Hint Level Switch Buttons on bot response */}
                {isBot && index === messages.length - 1 && (
                  <div className="mt-3 pt-2.5 border-t border-brand-border flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono text-brand-gray">Try another level:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => onSelectHintLevel(lvl as 1 | 2 | 3)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition border ${
                            tierNum === lvl
                              ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
                              : 'bg-white text-brand-gray hover:text-brand-orange hover:border-brand-orange/40 border-brand-border'
                          }`}
                        >
                          Hint {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* STEP 2: ASK FOR HINT LEVEL CARD */}
        {showHintChooser && !isLoading && (
          <div className="p-5 rounded-2xl bg-white border-2 border-brand-orange shadow-lg space-y-4 animate-fade-in">
            <div className="border-b border-brand-border pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-brand-orange-light flex items-center justify-center text-brand-orange">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-sm font-bold text-brand-dark">
                  How much help do you want?
                </h4>
              </div>
              <p className="text-[11px] text-brand-gray mt-1">
                Choose your hint level before I analyze your work.
              </p>
            </div>

            {/* 3 Hint Level Option Cards */}
            <div className="space-y-2.5">
              {/* Option 1 */}
              <button
                onClick={() => onSelectHintLevel(1)}
                className="w-full text-left p-3.5 rounded-xl border border-brand-border hover:border-brand-orange hover:bg-brand-orange-light/40 transition group relative shadow-xs bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-orange-light border border-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition shrink-0 mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-dark group-hover:text-brand-orange transition">
                      ① Hint 1 — Small Hint
                    </div>
                    <div className="text-[11px] text-brand-gray mt-0.5 leading-relaxed">
                      "Give me a small clue so I can continue myself."
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 2 */}
              <button
                onClick={() => onSelectHintLevel(2)}
                className="w-full text-left p-3.5 rounded-xl border border-brand-border hover:border-brand-orange hover:bg-brand-orange-light/40 transition group relative shadow-xs bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-orange-light border border-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition shrink-0 mt-0.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-dark group-hover:text-brand-orange transition">
                      ② Hint 2 — Guided Hint
                    </div>
                    <div className="text-[11px] text-brand-gray mt-0.5 leading-relaxed">
                      "Give me a stronger explanation and point me toward the next step."
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 3 */}
              <button
                onClick={() => onSelectHintLevel(3)}
                className="w-full text-left p-3.5 rounded-xl border border-brand-border hover:border-brand-orange hover:bg-brand-orange-light/40 transition group relative shadow-xs bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-brand-orange-light border border-brand-orange/20 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition shrink-0 mt-0.5">
                    <Footprints className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-brand-dark group-hover:text-brand-orange transition">
                      ③ Hint 3 — Detailed Guidance
                    </div>
                    <div className="text-[11px] text-brand-gray mt-0.5 leading-relaxed">
                      "Give me detailed step-by-step guidance, but still help me understand rather than simply giving the final answer."
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="h-7 w-7 rounded-xl bg-brand-orange text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-brand-gray-light border border-brand-border rounded-2xl p-3.5 text-xs text-brand-dark flex items-center gap-2.5 shadow-sm">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping" />
              <span className="font-mono text-[11px] font-semibold text-brand-dark">
                Analyzing with Hint Level {Number(currentTier || 1)}...
              </span>
            </div>
          </div>
        )}

        {/* Error Alert with Retry Action */}
        {errorMessage && !isLoading && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900">Analysis Error</p>
                <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
            {onRetry && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={onRetry}
                  className="btn-primary-orange flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Hint {Number(currentTier || 1)}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Eureka Celebration Banner */}
        {isCorrect && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3.5 shadow-md">
            <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-900">🎉 Eureka Moment! You discovered the fix!</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {masteryCelebration || 'Your updated derivation is completely sound and verified.'}
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Hint Level Bar & Quick Actions */}
      <div className="flex items-center justify-between py-2.5 text-[11px] shrink-0 border-t border-brand-border mt-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-brand-gray font-semibold">Hint Level:</span>
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => onSelectHintLevel(lvl as 1 | 2 | 3)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition border ${
                Number(currentTier) === lvl
                  ? 'bg-brand-orange text-white border-brand-orange shadow-xs'
                  : 'bg-white text-brand-gray hover:text-brand-orange hover:border-brand-orange/40 border-brand-border'
              }`}
            >
              Hint {lvl}
            </button>
          ))}
        </div>

        <button
          onClick={onRequestHintChoice}
          className="text-[10px] font-mono text-brand-orange hover:underline font-bold flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3" />
          <span>Change Help Level</span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative mt-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a clarifying question or describe your step..."
          disabled={isLoading}
          className="w-full bg-brand-gray-light border border-brand-border rounded-xl pl-3.5 pr-11 py-2.5 text-xs text-brand-dark placeholder-brand-gray focus:outline-none focus:border-brand-orange focus:bg-white transition shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-40 disabled:pointer-events-none text-white transition shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
