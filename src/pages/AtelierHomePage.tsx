import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { HOUSE_IMAGES, SUIT_PORTFOLIO } from '../data/tailorData';
import { BespokeSuit, PageRoute } from '../types/tailor';
import { ResilientImage } from '../components/ResilientImage';

interface AtelierHomePageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectSuit: (suit: BespokeSuit) => void;
  onBookFitting: () => void;
}

const HOUSE_METRICS = [
  { value: '32', label: 'Anatomical Measures', detail: 'Drafted per individual pattern' },
  { value: '74 hrs', label: 'Hand Bench Work', detail: 'Canvas, lapels & buttonholes' },
  { value: '450+', label: 'Heritage Cloths', detail: 'British & Biella mill archives' },
  { value: '9 wks', label: 'Lead Time', detail: 'From first chalk to final press' },
];

export function AtelierHomePage({
  onNavigate,
  onSelectSuit,
  onBookFitting,
}: AtelierHomePageProps) {
  const featuredThree = SUIT_PORTFOLIO.slice(1, 4);

  return (
    <div>
      {/* Hero Split Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Typography & Primary CTA */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:py-4">
            <div className="space-y-6">
              <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464]">
                Savile Row · Milan · By Appointment
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.06] tracking-tight text-[#F4F1EA]">
                Architecture Cut in Wool &amp; Silk
              </h1>

              <p className="text-[15px] md:text-base text-[#A19E95] leading-relaxed max-w-md">
                Every Marlowe commission begins from an empty sheet of pattern paper.
                Hand-basted over floating horsehair canvas and sculpted across three
                private fittings in London or Milan.
              </p>
            </div>

            <div className="pt-8 lg:pt-12 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={onBookFitting}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA]"
              >
                <span>Book a Private Fitting</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('portfolio')}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F4F1EA] hover:text-[#C8A464] transition-colors py-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Explore Custom Suits</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Flagship Visual Anchor */}
          <div className="lg:col-span-7 relative min-h-[360px] lg:min-h-[540px] bg-[#111114] border border-[#F4F1EA]/10 overflow-hidden group">
            <ResilientImage
              src={HOUSE_IMAGES.heroSuit}
              alt="Gentleman standing in a bespoke charcoal double-breasted wool suit inside the Savile Row atelier"
              title="The Savile Charcoal 6x2"
              className="w-full h-full lg:h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/85 via-[#09090B]/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs text-[#C8A464]">Flagship Commission</p>
                <p className="font-serif text-2xl text-[#F4F1EA] mt-0.5">
                  The Savile Charcoal 6x2 Double-Breasted
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectSuit(SUIT_PORTFOLIO[0])}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F4F1EA] border border-[#F4F1EA]/25 bg-[#09090B]/70 backdrop-blur-sm px-4 py-2 hover:border-[#C8A464] hover:text-[#C8A464] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Inspect Specification</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column House Metrics Strip Below Hero */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border-y border-[#F4F1EA]/10 divide-y lg:divide-y-0 lg:divide-x divide-[#F4F1EA]/10">
          {HOUSE_METRICS.map((metric) => (
            <div key={metric.label} className="py-6 px-4 lg:px-6 first:pl-0">
              <p className="font-serif text-3xl md:text-4xl text-[#F4F1EA] tabular-nums">
                {metric.value}
              </p>
              <p className="text-sm font-medium text-[#F4F1EA] mt-1.5">{metric.label}</p>
              <p className="text-xs text-[#A19E95] mt-0.5">{metric.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Bespoke Commissions (3-Column Portrait Grid) */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464] mb-2">
              Selected Works
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#F4F1EA]">
              Recent House Commissions
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-2 text-sm text-[#F4F1EA] hover:text-[#C8A464] transition-colors self-start md:self-auto whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>View All Custom Suits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredThree.map((suit) => (
            <article
              key={suit.id}
              onClick={() => onSelectSuit(suit)}
              className="group cursor-pointer flex flex-col"
            >
              <div className="aspect-[3/4] bg-[#111114] border border-[#F4F1EA]/10 overflow-hidden relative">
                <ResilientImage
                  src={suit.image}
                  alt={`${suit.name} in ${suit.cloth}`}
                  title={suit.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none" />
              </div>

              <div className="pt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#A19E95]">
                  <span>{suit.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{suit.mill}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{suit.weightGsm} g/m²</span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-2xl text-[#F4F1EA] group-hover:text-[#C8A464] transition-colors">
                    {suit.name}
                  </h3>
                  <span className="text-sm text-[#F4F1EA]/90 tabular-nums shrink-0">
                    £{suit.startingPriceGbp.toLocaleString('en-GB')}
                  </span>
                </div>
                <p className="text-xs text-[#A19E95] line-clamp-1">{suit.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Craftsmanship Narrative & Client Proof */}
      <section className="border-t border-[#F4F1EA]/10 bg-[#0D0D10]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[420px] bg-[#141418] border border-[#F4F1EA]/10 overflow-hidden">
            <ResilientImage
              src={HOUSE_IMAGES.atelierHands}
              alt="Master tailor hands chalking and cutting dark worsted wool cloth on a mahogany bench"
              title="Savile Row Cutting Bench"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between gap-8 py-1">
            <div className="space-y-5">
              <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464]">
                The Discipline
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#F4F1EA] leading-tight">
                Cut Once for One Posture Alone
              </h2>
              <p className="text-[15px] text-[#A19E95] leading-relaxed">
                Ready-to-wear patterns compromise for averages. Our cutters draft
                asymmetrical shoulder slopes, chest fullness, and stance posture directly
                onto archival manila card—creating a living blueprint refined with every
                subsequent commission.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={() => onNavigate('craft')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#C8A464] hover:text-[#D7B67A] transition-colors cursor-pointer"
                >
                  <span>Examine Process &amp; Cloth Archive</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Attributable Client Proof Adjacent to Craft Claim */}
            <blockquote className="pt-6 border-t border-[#F4F1EA]/10 space-y-3">
              <p className="font-serif italic text-xl text-[#F4F1EA]/90 leading-snug">
                “After two basted fittings in Mayfair, my high-twist double-breasted suit
                stepped off eighteen transatlantic flights without once requiring a hotel
                press.”
              </p>
              <footer className="text-xs text-[#A19E95]">
                <span className="text-[#F4F1EA] font-medium">Alexander Thorne</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Managing Partner, Meridian Capital · Four Commissions Since 2023</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
}
