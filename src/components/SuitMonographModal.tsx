import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { BespokeSuit } from '../types/tailor';
import { ResilientImage } from './ResilientImage';

interface SuitMonographModalProps {
  suit: BespokeSuit | null;
  onClose: () => void;
  onCommissionSuit: (suitName: string) => void;
}

export function SuitMonographModal({
  suit,
  onClose,
  onCommissionSuit,
}: SuitMonographModalProps) {
  useEffect(() => {
    if (!suit) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [suit, onClose]);

  return (
    <AnimatePresence>
      {suit && (
        <motion.div
          key="suit-monograph-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="suit-monograph-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#111114] border border-[#F4F1EA]/12 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl my-auto"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close suit detail view"
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#09090B]/80 border border-[#F4F1EA]/15 text-[#F4F1EA] hover:text-[#C8A464] hover:border-[#C8A464]/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Visual Panel */}
            <div className="lg:col-span-6 bg-[#09090B] relative min-h-[340px] lg:min-h-[600px]">
              <ResilientImage
                src={suit.image}
                alt={`${suit.name} — ${suit.cloth}`}
                title={suit.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-[#F4F1EA]/85">
                <span>{suit.category}</span>
                <span className="tabular-nums font-mono">
                  Archive {suit.commissionYear}
                </span>
              </div>
            </div>

            {/* Right Editorial Monograph */}
            <div className="lg:col-span-6 p-7 md:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-[#C8A464] tracking-wide mb-2">
                    {suit.mill} · {suit.weightGsm} g/m²
                  </p>
                  <h2
                    id="suit-monograph-title"
                    className="font-serif text-3xl md:text-4xl text-[#F4F1EA] leading-tight"
                  >
                    {suit.name}
                  </h2>
                  <p className="text-sm text-[#A19E95] mt-1.5">{suit.subtitle}</p>
                </div>

                <p className="text-sm md:text-[15px] text-[#F4F1EA]/85 leading-relaxed">
                  {suit.story}
                </p>

                {/* Tabular Specification Grid */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#F4F1EA]/10 text-xs">
                  <div>
                    <p className="text-[#A19E95] mb-1">Cloth</p>
                    <p className="text-[#F4F1EA] font-medium">{suit.cloth}</p>
                  </div>
                  <div>
                    <p className="text-[#A19E95] mb-1">Bench Hours</p>
                    <p className="text-[#F4F1EA] font-medium tabular-nums">
                      {suit.tailoringHours} Hand Hours
                    </p>
                  </div>
                  <div>
                    <p className="text-[#A19E95] mb-1">Silhouette</p>
                    <p className="text-[#F4F1EA]">{suit.silhouette}</p>
                  </div>
                  <div>
                    <p className="text-[#A19E95] mb-1">Canvas</p>
                    <p className="text-[#F4F1EA]">{suit.construction}</p>
                  </div>
                </div>

                {/* Tailoring Details List */}
                <div className="space-y-2">
                  <p className="text-xs text-[#A19E95]">Signature Appointments</p>
                  <ul className="space-y-1.5 text-sm text-[#F4F1EA]/85">
                    {suit.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5">
                        <span className="text-[#C8A464] mt-1.5 w-1.5 h-1.5 bg-[#C8A464] shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Action Row */}
              <div className="pt-4 border-t border-[#F4F1EA]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-[#A19E95]">Bespoke Commission From</p>
                  <p className="font-serif text-2xl text-[#F4F1EA] tabular-nums">
                    £{suit.startingPriceGbp.toLocaleString('en-GB')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCommissionSuit(suit.name)}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Book Fitting for This Cut</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
