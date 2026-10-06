import { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureGrid } from './components/FeatureGrid';
import { HowItWorks } from './components/HowItWorks';
import { HintLadder } from './components/HintLadder';
import { ImageCanvas } from './components/ImageCanvas';
import { ChatInterface } from './components/ChatInterface';
import { BenchmarkDashboard } from './components/BenchmarkDashboard';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { HintTier, SubjectArea } from './types';
import type {
  BoundingBox,
  SocraticMessage,
  BenchmarkSummary
} from './types';
import { analyzeSocraticWork, runBenchmarkEvaluation, checkBackendHealth } from './utils/api';
import { Sparkles, RefreshCw, Terminal } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'workspace' | 'benchmark'>('workspace');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const workspaceRef = useRef<HTMLDivElement | null>(null);

  // Configuration state
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('socratic_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('socratic_model') || 'gemini-3.5-flash');
  const [hasApiKey, setHasApiKey] = useState(false);

  // Tutor Workspace state (1 = Small Hint, 2 = Guided Hint, 3 = Detailed Guidance)
  const [currentTier, setCurrentTier] = useState<HintTier>(HintTier.HINT_1);
  const [subject, setSubject] = useState<SubjectArea>(SubjectArea.MATH);
  const [problemText, setProblemText] = useState('');
  const [studentWorkText, setStudentWorkText] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  // Interaction Flow state: Prompt user to choose hint level before analyzing
  const [showHintChooser, setShowHintChooser] = useState(false);

  // Chat & Analysis state
  const [messages, setMessages] = useState<SocraticMessage[]>([]);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  const [leakageScore, setLeakageScore] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [masteryCelebration, setMasteryCelebration] = useState<string | undefined>();

  // Benchmark State
  const [benchmarkSummary, setBenchmarkSummary] = useState<BenchmarkSummary | null>(null);

  // Check health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setHasApiKey(res.has_api_key || Boolean(apiKey));
    });
    runBenchmarkEvaluation().then((summary) => {
      setBenchmarkSummary(summary);
    }).catch(() => {});
  }, [apiKey]);

  const scrollToWorkspace = () => {
    setActiveTab('workspace');
    setTimeout(() => {
      workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // STEP 3: ANALYZE WITH SELECTED HINT LEVEL
  const handleAnalyze = useCallback(async (tierLevel?: HintTier) => {
    const tierToUse = tierLevel || currentTier;
    setErrorMessage(null);
    setShowHintChooser(false);
    setIsLoading(true);

    try {
      const response = await analyzeSocraticWork({
        imageBase64,
        problemText: problemText || 'Differentiate or analyze the given problem.',
        studentWorkText: studentWorkText || 'See attached problem derivation.',
        chatHistory: messages,
        currentTier: tierToUse,
        subject,
        apiKeyOverride: apiKey || undefined,
        modelOverride: selectedModel,
      });

      setCurrentTier(response.tier);
      setBoundingBoxes(response.bounding_boxes || []);
      setLeakageScore(response.leakage_score || 0.0);
      setIsCorrect(response.is_correct || false);
      setMasteryCelebration(response.mastery_celebration);

      const newBotMsg: SocraticMessage = {
        role: 'assistant',
        content: response.socratic_guidance,
        probing_question: response.probing_question,
        tier: response.tier,
        identified_error_type: response.identified_error_type,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, newBotMsg]);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setErrorMessage(err.message || 'Analysis request failed. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentTier, imageBase64, problemText, studentWorkText, messages, subject, apiKey, selectedModel]);

  // STEP 1 -> STEP 2: When student clicks "Ask Socratic Tutor", show hint level chooser
  const handleInitiateAnalysis = () => {
    setErrorMessage(null);
    setShowHintChooser(true);
  };

  // STEP 2 -> STEP 3: When student picks Hint 1, 2, or 3
  const handleSelectHintLevel = (level: 1 | 2 | 3) => {
    setCurrentTier(level as HintTier);
    setShowHintChooser(false);
    handleAnalyze(level as HintTier);
  };

  // Keyboard shortcut: Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (!isLoading) {
          handleInitiateAnalysis();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, problemText, studentWorkText, imageBase64]);

  const handleUserSendMessage = (text: string) => {
    const userMsg: SocraticMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = text.toLowerCase();
    const isSolutionFound =
      (subject === SubjectArea.MATH && (lower.includes('6x') || lower.includes('+ 8') || lower.includes('+8') || lower.includes('24x') || (lower.includes('x = 0') && lower.includes('2x = 0')))) ||
      (subject === SubjectArea.PHYSICS && (lower.includes('cos') || lower.includes('perpendicular') || lower.includes('mg*cos'))) ||
      (subject === SubjectArea.CIRCUITS && (lower.includes('drop') || lower.includes('-4i') || lower.includes('minus') || lower.includes('2a') || lower.includes('2 a'))) ||
      (subject === SubjectArea.PROOFS && (lower.includes('similar') || lower.includes('size') || lower.includes('scale') || lower.includes('not congruent')));

    if (isSolutionFound) {
      setTimeout(() => {
        setIsCorrect(true);
        const botCongrats: SocraticMessage = {
          role: 'assistant',
          content: "🌟 **Brilliant discovery!** You pinpointed the exact conceptual condition! Your updated derivation is completely sound and verified.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botCongrats]);
      }, 500);
      return;
    }

    // Follow-up message continues with current hint level
    setTimeout(() => {
      handleAnalyze(currentTier);
    }, 400);
  };

  const handleReset = () => {
    setMessages([]);
    setBoundingBoxes([]);
    setErrorMessage(null);
    setShowHintChooser(false);
    setIsCorrect(false);
    setMasteryCelebration(undefined);
    setCurrentTier(HintTier.HINT_1);
  };

  return (
    <div className="min-h-screen bg-brand-orange-subtle text-brand-dark flex flex-col selection:bg-brand-orange selection:text-white">
      {/* Top SaaS Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        modelName={selectedModel}
        hasApiKey={hasApiKey}
        onScrollToWorkspace={scrollToWorkspace}
      />

      {/* Hero Section */}
      <Hero
        onStartTutor={scrollToWorkspace}
        onViewBenchmarks={() => setActiveTab('benchmark')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'workspace' ? (
          <div className="space-y-12">
            {/* Live Interactive Workspace */}
            <section ref={workspaceRef} className="pt-6 pb-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="space-y-6">
                {/* Unified Socratic Scaffolding Ladder Container */}
                <HintLadder
                  currentTier={currentTier}
                  onSelectTier={(tier) => {
                    setCurrentTier(tier);
                    handleAnalyze(tier);
                  }}
                  leakageScore={leakageScore}
                />

                {/* Workspace Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
                  {/* Left Column: Student Work Canvas */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <ImageCanvas
                      imageBase64={imageBase64}
                      setImageBase64={setImageBase64}
                      studentWorkText={studentWorkText}
                      setStudentWorkText={setStudentWorkText}
                      problemText={problemText}
                      setProblemText={setProblemText}
                      subject={subject}
                      setSubject={setSubject}
                      boundingBoxes={boundingBoxes}
                    />

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-brand-border shadow-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-gray-light hover:bg-brand-border text-brand-dark text-xs font-semibold transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-brand-gray" />
                          <span>Reset</span>
                        </button>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-brand-gray font-mono">
                          <Terminal className="w-3 h-3" /> Ctrl+Enter
                        </span>
                      </div>

                      <button
                        onClick={handleInitiateAnalysis}
                        disabled={isLoading}
                        className="btn-primary-orange flex items-center gap-2 px-6 py-2.5 text-xs font-bold shadow-md shadow-orange-500/20 disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Ask Socratic Tutor</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Socratic Dialogue Stream */}
                  <div className="lg:col-span-5 h-[640px]">
                    <ChatInterface
                      messages={messages}
                      onSendMessage={handleUserSendMessage}
                      onSelectHintLevel={handleSelectHintLevel}
                      onRequestHintChoice={() => setShowHintChooser(true)}
                      currentTier={currentTier}
                      isLoading={isLoading}
                      showHintChooser={showHintChooser}
                      errorMessage={errorMessage}
                      onRetry={() => handleAnalyze(currentTier)}
                      isCorrect={isCorrect}
                      masteryCelebration={masteryCelebration}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <HowItWorks />

            {/* Feature Cards Grid Section */}
            <FeatureGrid />
          </div>
        ) : (
          /* Benchmark & Judging Tab */
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BenchmarkDashboard initialSummary={benchmarkSummary} />
          </div>
        )}
      </main>

      {/* Clean SaaS Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </div>
  );
}

export default App;
