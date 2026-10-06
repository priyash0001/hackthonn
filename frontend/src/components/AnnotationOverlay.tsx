import type { FC } from 'react';
import type { BoundingBox } from '../types';

interface AnnotationOverlayProps {
  boundingBoxes: BoundingBox[];
}

export const AnnotationOverlay: FC<AnnotationOverlayProps> = ({ boundingBoxes }) => {
  if (!boundingBoxes || boundingBoxes.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {boundingBoxes.map((box, index) => {
        const top = `${(box.ymin / 1000) * 100}%`;
        const left = `${(box.xmin / 1000) * 100}%`;
        const width = `${((box.xmax - box.xmin) / 1000) * 100}%`;
        const height = `${((box.ymax - box.ymin) / 1000) * 100}%`;

        const statusStyles = {
          error: 'border-rose-500 bg-rose-500/15 text-rose-700 shadow-rose-500/20',
          warning: 'border-amber-500 bg-amber-500/15 text-amber-700 shadow-amber-500/20',
          ok: 'border-emerald-500 bg-emerald-500/15 text-emerald-700 shadow-emerald-500/20',
          focus: 'border-brand-orange bg-brand-orange/15 text-brand-orange shadow-orange-500/20',
        }[box.status] || 'border-brand-orange bg-brand-orange/15 text-brand-orange';

        const labelBadge = {
          error: 'bg-rose-600 text-white',
          warning: 'bg-amber-600 text-white',
          ok: 'bg-emerald-600 text-white',
          focus: 'bg-brand-orange text-white',
        }[box.status] || 'bg-brand-orange text-white';

        return (
          <div
            key={index}
            style={{ top, left, width, height }}
            className={`absolute border-2 rounded-lg transition-all duration-300 shadow-md ${statusStyles}`}
          >
            <div
              className={`absolute -top-3 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow-sm whitespace-nowrap ${labelBadge}`}
            >
              {box.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
