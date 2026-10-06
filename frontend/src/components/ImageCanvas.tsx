import { useRef, useState, useEffect } from 'react';
import type { FC, ChangeEvent, MouseEvent } from 'react';
import type { BoundingBox, SubjectArea } from '../types';
import { Upload, Edit3, Image as ImageIcon, Trash2, Eye, FileText } from 'lucide-react';
import { AnnotationOverlay } from './AnnotationOverlay';

interface ImageCanvasProps {
  imageBase64: string | null;
  setImageBase64: (val: string | null) => void;
  studentWorkText: string;
  setStudentWorkText: (val: string) => void;
  problemText: string;
  setProblemText: (val: string) => void;
  subject: SubjectArea;
  setSubject: (val: SubjectArea) => void;
  boundingBoxes: BoundingBox[];
}

export const ImageCanvas: FC<ImageCanvasProps> = ({
  imageBase64,
  setImageBase64,
  studentWorkText,
  setStudentWorkText,
  problemText,
  setProblemText,
  subject,
  setSubject,
  boundingBoxes
}) => {
  const [activeMode, setActiveMode] = useState<'text' | 'draw' | 'image'>('text');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (activeMode === 'draw' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#F28C00';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [activeMode]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setImageBase64(b64);
      setActiveMode('image');
    };
    reader.readAsDataURL(file);
  };

  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (canvasRef.current) {
      const b64 = canvasRef.current.toDataURL('image/png');
      setImageBase64(b64);
    }
  };

  const clearDrawing = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    setImageBase64(null);
  };

  return (
    <div className="saas-card p-6 bg-white border border-brand-border flex flex-col h-full shadow-sm">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-brand-border">
        <h2 className="text-sm font-bold text-brand-dark">
          Student Workspace & Derivation
        </h2>

        {/* Input Mode Tabs */}
        <div className="flex items-center bg-brand-gray-light p-1 rounded-xl border border-brand-border text-xs font-semibold">
          <button
            onClick={() => setActiveMode('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeMode === 'text'
                ? 'bg-white text-brand-orange shadow-sm border border-brand-border'
                : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>LaTeX & Steps</span>
          </button>
          <button
            onClick={() => setActiveMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeMode === 'image'
                ? 'bg-white text-brand-orange shadow-sm border border-brand-border'
                : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Upload</span>
          </button>
          <button
            onClick={() => setActiveMode('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeMode === 'draw'
                ? 'bg-white text-brand-orange shadow-sm border border-brand-border'
                : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Sketch Pad</span>
          </button>
        </div>
      </div>

      {/* Subject Selector & Problem Statement Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-4">
        <div className="sm:col-span-1">
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-gray mb-1">
            Subject Area
          </label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as SubjectArea)}
            className="w-full bg-white border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-dark font-medium focus:outline-none focus:border-brand-orange shadow-sm"
          >
            <option value="math">Calculus & Math</option>
            <option value="physics">Physics & Mechanics</option>
            <option value="circuits">Circuits & EE</option>
            <option value="proofs">Geometry & Proofs</option>
            <option value="general">General STEM</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-brand-gray mb-1">
            Problem Statement / Prompt
          </label>
          <input
            type="text"
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            placeholder="Enter problem statement..."
            className="w-full bg-white border border-brand-border rounded-xl px-3.5 py-2 text-xs text-brand-dark font-mono focus:outline-none focus:border-brand-orange shadow-sm"
          />
        </div>
      </div>

      {/* Main Workspace Canvas Area */}
      <div className="flex-1 min-h-[340px] flex flex-col relative bg-brand-gray-light rounded-2xl border border-brand-border p-4 overflow-hidden notebook-grid">
        {activeMode === 'text' && (
          <div className="h-full flex flex-col gap-3">
            <div className="flex-1 flex flex-col">
              <textarea
                value={studentWorkText}
                onChange={(e) => setStudentWorkText(e.target.value)}
                placeholder="Enter your derivation or solution here..."
                className="w-full flex-1 bg-white border border-brand-border rounded-xl p-4 text-xs font-mono text-brand-dark focus:outline-none focus:border-brand-orange resize-none leading-relaxed shadow-sm"
              />
            </div>

            {/* Visual Step Annotations Overlay */}
            {boundingBoxes.length > 0 && (
              <div className="bg-white border border-brand-border rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-brand-dark flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-brand-orange" />
                    <span>Gemma 4 Step Attention & Error Inspection</span>
                  </span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {boundingBoxes.map((box, i) => (
                    <div
                      key={i}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between border ${
                        box.status === 'error'
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : box.status === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      <span className="truncate max-w-xs">{box.label}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold shrink-0 ml-2">
                        {box.status === 'error' ? '⚡ Mistake Step' : '✓ Verified'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeMode === 'image' && (
          <div className="h-full flex flex-col items-center justify-center relative">
            {imageBase64 ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
                <div className="relative inline-block max-h-[340px] max-w-full">
                  <img
                    src={imageBase64}
                    alt="Student Work"
                    className="max-h-[340px] max-w-full rounded-xl object-contain border border-brand-border shadow-sm block"
                  />
                  <AnnotationOverlay boundingBoxes={boundingBoxes} />
                </div>
                <button
                  onClick={() => setImageBase64(null)}
                  className="absolute top-2 right-2 z-20 p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold flex items-center gap-1 shadow-md transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-brand-border hover:border-brand-orange bg-white rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition group"
              >
                <div className="h-12 w-12 rounded-2xl bg-brand-orange-light border border-brand-orange/30 flex items-center justify-center text-brand-orange group-hover:scale-110 transition mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-brand-dark mb-1">
                  Upload Handwritten Notebook or Diagram
                </p>
                <p className="text-[11px] text-brand-gray text-center">
                  PNG, JPG, or PDF photo of student solution
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}

        {activeMode === 'draw' && (
          <div className="h-full flex flex-col relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-brand-gray font-mono">
                Draw solution, circuit, or diagram:
              </span>
              <button
                onClick={clearDrawing}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-brand-gray-light border border-brand-border text-[11px] text-brand-gray flex items-center gap-1 font-mono shadow-sm"
              >
                <Trash2 className="w-3 h-3 text-slate-400" />
                <span>Clear</span>
              </button>
            </div>
            <div className="flex-1 bg-white rounded-xl border border-brand-border overflow-hidden relative shadow-inner">
              <canvas
                ref={canvasRef}
                width={700}
                height={340}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full cursor-crosshair"
              />
              <AnnotationOverlay boundingBoxes={boundingBoxes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
