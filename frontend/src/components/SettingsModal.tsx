import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { X, Key, Cpu, Check, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const SettingsModal: FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(selectedModel || 'gemini-3.5-flash');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    setApiKey(tempKey);
    setSelectedModel(tempModel);
    localStorage.setItem('socratic_api_key', tempKey);
    localStorage.setItem('socratic_model', tempModel);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const models = [
    { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Recommended 1st)', desc: 'Ultra-fast sub-second reasoning model (Primary)' },
    { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (2nd)', desc: 'Low-latency high-throughput engine' },
    { id: 'gemma-4-26b-a4b-it', name: 'Gemma 4 (26B-A4B-IT) (3rd)', desc: 'Official Track 1 open-weights multimodal model' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-brand-border p-6 max-w-lg w-full shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-orange-light flex items-center justify-center text-brand-orange">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-brand-dark">Model & API Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-gray hover:text-brand-dark hover:bg-brand-gray-light transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 pt-4">
          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-brand-dark">
                Google AI Studio API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-brand-orange hover:underline flex items-center gap-1 font-medium"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Paste your Google AI Studio API key (AIza... or AQ.Ab...)"
              className="w-full bg-brand-gray-light border border-brand-border rounded-xl px-3.5 py-2.5 text-xs text-brand-dark font-mono focus:outline-none focus:border-brand-orange focus:bg-white shadow-sm"
            />
            <p className="text-[11px] text-brand-gray mt-1.5">
              Your key is stored locally for direct private requests.
            </p>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-bold text-brand-dark mb-2 block">
              Execution Model Priority
            </label>
            <div className="space-y-2">
              {models.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition ${
                    tempModel === m.id
                      ? 'border-brand-orange bg-brand-orange-light/50 ring-1 ring-brand-orange/30'
                      : 'border-brand-border bg-white hover:bg-brand-gray-light'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    checked={tempModel === m.id}
                    onChange={() => setTempModel(m.id)}
                    className="mt-0.5 text-brand-orange focus:ring-brand-orange"
                  />
                  <div>
                    <span className="text-xs font-bold text-brand-dark block">{m.name}</span>
                    <span className="text-[11px] text-brand-gray block mt-0.5">{m.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-gray hover:text-brand-dark transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-orange flex items-center space-x-1.5 px-5 py-2 text-xs font-bold shadow-md shadow-orange-500/20"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
