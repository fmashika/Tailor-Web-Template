import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { CLOTH_ARCHIVE, HOUSE_IMAGES } from '../data/tailorData';
import { ClothSwatch } from '../types/tailor';
import { ResilientImage } from '../components/ResilientImage';

interface CraftPageProps {
  onCommissionCloth: (clothLabel: string) => void;
}

const PROCESS_STAGES = [
  {
    number: '01.',
    title: 'Anatomical Measure & Chalk Pattern',
    timeline: 'Week 01',
    description:
      'Over 32 postural and dimensional measurements are recorded alongside shoulder slope, pitch, and chest contour. Your personal pattern is drafted by hand onto manila card and chalked onto cloth.',
  },
  {
    number: '02.',
    title: 'The Basted Skeleton Fitting',
    timeline: 'Week 04',
    description:
      'Constructed temporarily with white cotton basting thread over raw floating horsehair canvas. Your cutter observes natural stance and movement, unpicking and re-pinning seams directly on the body.',
  },
  {
    number: '03.',
    title: 'Forward Fitting & Hand Finish',
    timeline: 'Week 08–09',
    description:
      'Lapel edges are hand-pad stitched for natural roll, horn buttons are shanked in silk, and working cuff buttonholes are sewn at twelve stitches per inch before final steam pressing.',
  },
];

function ClothTexturePreview({ swatch }: { swatch: ClothSwatch }) {
  return (
    <div
      className="w-full h-44 border border-[#F4F1EA]/12 relative overflow-hidden"
      style={{ backgroundColor: swatch.swatchHex }}
    >
      <svg
        className="w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {swatch.weavePattern === 'chalkstripe' && (
            <pattern
              id={`pattern-${swatch.id}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <line x1="12" y1="0" x2="12" y2="24" stroke="#F4F1EA" strokeWidth="1" strokeDasharray="2 2" />
              <path d="M0 0 L24 24 M-6 18 L6 30 M18 -6 L30 6" stroke="#000" strokeOpacity="0.25" strokeWidth="1" />
            </pattern>
          )}
          {swatch.weavePattern === 'herringbone' && (
            <pattern
              id={`pattern-${swatch.id}`}
              width="20"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 6 L5 0 L10 6 L15 0 L20 6 M0 12 L5 6 L10 12 L15 6 L20 12"
                fill="none"
                stroke="#F4F1EA"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
            </pattern>
          )}
          {swatch.weavePattern === 'barathea' && (
            <pattern
              id={`pattern-${swatch.id}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.9" fill="#F4F1EA" fillOpacity="0.25" />
              <circle cx="6" cy="6" r="0.9" fill="#F4F1EA" fillOpacity="0.25" />
            </pattern>
          )}
          {(swatch.weavePattern === 'sharkskin' || swatch.weavePattern === 'flannel') && (
            <pattern
              id={`pattern-${swatch.id}`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 10 L10 0 M-2 2 L2 -2 M8 12 L12 8"
                stroke="#F4F1EA"
                strokeOpacity="0.2"
                strokeWidth="1"
              />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill={`url(#pattern-${swatch.id})`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/80 via-transparent to-transparent" />
      <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-[#F4F1EA]/90">
        <span>{swatch.mill}</span>
        <span className="tabular-nums font-mono">{swatch.weightGsm} g/m²</span>
      </div>
    </div>
  );
}

export function CraftPage({ onCommissionCloth }: CraftPageProps) {
  const [selectedClothId, setSelectedClothId] = useState<string>(CLOTH_ARCHIVE[0].id);
  const selectedCloth =
    CLOTH_ARCHIVE.find((c) => c.id === selectedClothId) ?? CLOTH_ARCHIVE[0];

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16 space-y-20">
      {/* Craft Header + Editorial Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464]">
              Atelier Craft &amp; Cloth
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#F4F1EA] leading-tight">
              Seventy Hours of Invisible Architecture
            </h1>
            <p className="text-[15px] text-[#A19E95] leading-relaxed">
              What distinguishes a bespoke coat from an altered garment lies beneath the
              lining: unglued horsehair canvas, hand-drawn silk collar stitches, and cloth
              steamed slowly into three-dimensional shape.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#F4F1EA]/10 text-xs">
            <div>
              <p className="text-[#A19E95]">Canvas Construction</p>
              <p className="text-[#F4F1EA] mt-1 font-medium">
                100% Floating Horsehair &amp; Linen
              </p>
            </div>
            <div>
              <p className="text-[#A19E95]">Buttonhole Density</p>
              <p className="text-[#F4F1EA] mt-1 font-medium tabular-nums">
                12 Silk Stitches / Inch
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 aspect-[16/9] lg:aspect-auto lg:min-h-[380px] bg-[#111114] border border-[#F4F1EA]/10 overflow-hidden">
          <ResilientImage
            src={HOUSE_IMAGES.atelierHands}
            alt="Master cutter chalking bespoke paper pattern onto dark worsted wool cloth"
            title="Pattern Chalking & Shears"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Three-Stage Process */}
      <div className="border-t border-[#F4F1EA]/10 pt-14">
        <div className="mb-10">
          <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464] mb-2">
            Commission Cadence
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#F4F1EA]">
            Three Fittings Across Nine Weeks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROCESS_STAGES.map((stage) => (
            <div
              key={stage.number}
              className="p-7 bg-[#111114] border border-[#F4F1EA]/10 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif text-2xl text-[#C8A464]">{stage.number}</span>
                  <span className="text-[#A19E95] tabular-nums font-mono">
                    {stage.timeline}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-[#F4F1EA]">{stage.title}</h3>
                <p className="text-sm text-[#A19E95] leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Cloth Archive */}
      <div className="border-t border-[#F4F1EA]/10 pt-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464] mb-2">
              Mill Library
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#F4F1EA]">
              Curated Cloth Archive
            </h2>
          </div>
          <p className="text-xs text-[#A19E95]">
            Select any cloth bolt to inspect mill origin and reserve swatches for your fitting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Swatch Selector List */}
          <div className="lg:col-span-5 divide-y divide-[#F4F1EA]/10 border border-[#F4F1EA]/10 bg-[#111114]">
            {CLOTH_ARCHIVE.map((cloth) => {
              const active = cloth.id === selectedCloth.id;
              return (
                <button
                  key={cloth.id}
                  type="button"
                  onClick={() => setSelectedClothId(cloth.id)}
                  className={`w-full text-left p-5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#18181D] text-[#F4F1EA]'
                      : 'hover:bg-[#151519] text-[#A19E95]'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className="w-8 h-8 border border-[#F4F1EA]/20 shrink-0"
                      style={{ backgroundColor: cloth.swatchHex }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-serif text-xl text-[#F4F1EA] truncate">
                        {cloth.name}
                      </p>
                      <p className="text-xs text-[#A19E95] truncate">
                        {cloth.mill} · {cloth.origin}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#C8A464] shrink-0">
                    {cloth.weightGsm}g
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Cloth Dossier */}
          <div className="lg:col-span-7 bg-[#111114] border border-[#F4F1EA]/10 p-7 md:p-9 space-y-6">
            <ClothTexturePreview swatch={selectedCloth} />

            <div className="space-y-2">
              <p className="text-xs text-[#C8A464]">
                {selectedCloth.mill} · {selectedCloth.origin}
              </p>
              <h3 className="font-serif text-3xl text-[#F4F1EA]">{selectedCloth.name}</h3>
              <p className="text-sm text-[#A19E95] leading-relaxed">
                {selectedCloth.notes}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 py-5 border-y border-[#F4F1EA]/10 text-xs">
              <div>
                <p className="text-[#A19E95] mb-1">Composition</p>
                <p className="text-[#F4F1EA] font-medium">{selectedCloth.composition}</p>
              </div>
              <div>
                <p className="text-[#A19E95] mb-1">Weight</p>
                <p className="text-[#F4F1EA] font-medium tabular-nums">
                  {selectedCloth.weightGsm} g/m²
                </p>
              </div>
              <div>
                <p className="text-[#A19E95] mb-1">Recommended Season</p>
                <p className="text-[#F4F1EA] font-medium">{selectedCloth.season}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-[#A19E95]">
                Physical book swatch prepared ahead of your salon visit.
              </p>
              <button
                type="button"
                onClick={() =>
                  onCommissionCloth(`${selectedCloth.mill} — ${selectedCloth.name}`)
                }
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Reserve Swatch for Fitting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
