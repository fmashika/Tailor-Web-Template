import { ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SUIT_PORTFOLIO } from '../data/tailorData';
import { BespokeSuit, SuitCategory } from '../types/tailor';
import { ResilientImage } from '../components/ResilientImage';

interface PortfolioPageProps {
  onSelectSuit: (suit: BespokeSuit) => void;
  onCommissionSuit: (suitName: string) => void;
}

const CATEGORIES: SuitCategory[] = [
  'All',
  'Double-Breasted',
  'Single-Breasted',
  'Black Tie',
  'Three-Piece',
];

type SortOption = 'featured' | 'price-asc' | 'hours-desc';

export function PortfolioPage({
  onSelectSuit,
  onCommissionSuit,
}: PortfolioPageProps) {
  const [activeCategory, setActiveCategory] = useState<SuitCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredSuits = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? [...SUIT_PORTFOLIO]
        : SUIT_PORTFOLIO.filter((suit) => suit.category === activeCategory);

    if (sortBy === 'price-asc') {
      base.sort((a, b) => a.startingPriceGbp - b.startingPriceGbp);
    } else if (sortBy === 'hours-desc') {
      base.sort((a, b) => b.tailoringHours - a.tailoringHours);
    }
    return base;
  }, [activeCategory, sortBy]);

  const leadWideSuit =
    activeCategory === 'All' && sortBy === 'featured'
      ? filteredSuits.find((s) => s.aspect === '16:9')
      : undefined;

  const gridSuits = leadWideSuit
    ? filteredSuits.filter((s) => s.id !== leadWideSuit.id)
    : filteredSuits;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#F4F1EA]/10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464]">
            Custom Suit Portfolio
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F4F1EA] leading-tight">
            Signature Silhouettes &amp; House Cuts
          </h1>
          <p className="text-[15px] text-[#A19E95] leading-relaxed">
            Inspect our archive of bespoke commissions. Select any garment to study its
            cloth weight, canvas architecture, and tailoring hours, or carry its silhouette
            directly into a private fitting.
          </p>
        </div>

        {/* Sort Control */}
        <div className="flex items-center gap-3 self-start lg:self-end shrink-0">
          <label htmlFor="portfolio-sort" className="text-xs text-[#A19E95] whitespace-nowrap">
            Order By
          </label>
          <select
            id="portfolio-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-[#111114] border border-[#F4F1EA]/15 text-xs text-[#F4F1EA] px-3.5 py-2.5 focus:outline-none focus:border-[#C8A464] cursor-pointer"
          >
            <option value="featured">Curated House Order</option>
            <option value="hours-desc">Highest Bench Hours</option>
            <option value="price-asc">Investment: Ascending</option>
          </select>
        </div>
      </div>

      {/* Interactive Silhouette Filter Tabs */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter custom suits by silhouette"
          className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#111114] border border-[#F4F1EA]/10"
        >
          {CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#C8A464] text-[#09090B]'
                    : 'text-[#A19E95] hover:text-[#F4F1EA]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-[#A19E95] tabular-nums">
          Showing {filteredSuits.length} bespoke{' '}
          {filteredSuits.length === 1 ? 'commission' : 'commissions'}
        </p>
      </div>

      {/* Lead 16:9 Flagship Feature (when viewing All in curated order) */}
      {leadWideSuit && (
        <article className="mb-10 bg-[#111114] border border-[#F4F1EA]/10 grid grid-cols-1 lg:grid-cols-12 overflow-hidden group">
          <div
            onClick={() => onSelectSuit(leadWideSuit)}
            className="lg:col-span-7 aspect-[16/9] lg:aspect-auto lg:min-h-[380px] overflow-hidden relative cursor-pointer"
          >
            <ResilientImage
              src={leadWideSuit.image}
              alt={`${leadWideSuit.name} — ${leadWideSuit.cloth}`}
              title={leadWideSuit.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>
          <div className="lg:col-span-5 p-7 md:p-9 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#C8A464]">
                <span>Lead Commission</span>
                <span aria-hidden="true">·</span>
                <span>{leadWideSuit.mill}</span>
              </div>
              <h2 className="font-serif text-3xl text-[#F4F1EA]">
                {leadWideSuit.name}
              </h2>
              <p className="text-sm text-[#A19E95] leading-relaxed">
                {leadWideSuit.story}
              </p>
              <div className="pt-3 grid grid-cols-3 gap-4 border-t border-[#F4F1EA]/10 text-xs">
                <div>
                  <p className="text-[#A19E95]">Weight</p>
                  <p className="text-[#F4F1EA] mt-0.5 tabular-nums">
                    {leadWideSuit.weightGsm} g/m²
                  </p>
                </div>
                <div>
                  <p className="text-[#A19E95]">Tailoring</p>
                  <p className="text-[#F4F1EA] mt-0.5 tabular-nums">
                    {leadWideSuit.tailoringHours} hrs
                  </p>
                </div>
                <div>
                  <p className="text-[#A19E95]">From</p>
                  <p className="text-[#F4F1EA] mt-0.5 tabular-nums">
                    £{leadWideSuit.startingPriceGbp.toLocaleString('en-GB')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onSelectSuit(leadWideSuit)}
                className="px-5 py-2.5 text-xs font-medium bg-[#F4F1EA] text-[#09090B] hover:bg-[#C8A464] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Inspect Details
              </button>
              <button
                type="button"
                onClick={() => onCommissionSuit(leadWideSuit.name)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C8A464] hover:text-[#D7B67A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Commission This Cut</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </article>
      )}

      {/* Uniform Lookbook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
        {gridSuits.map((suit) => (
          <article
            key={suit.id}
            className="group flex flex-col bg-[#111114] border border-[#F4F1EA]/10 hover:border-[#C8A464]/45 transition-all duration-200 hover:-translate-y-0.5"
          >
            <div
              onClick={() => onSelectSuit(suit)}
              className="aspect-[3/4] bg-[#09090B] overflow-hidden relative cursor-pointer"
            >
              <ResilientImage
                src={suit.image}
                alt={`${suit.name} — ${suit.cloth}`}
                title={suit.name}
                className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                  suit.aspect === '16:9' ? 'object-[72%_15%]' : 'object-top'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/70 via-transparent to-transparent pointer-events-none" />
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#A19E95]">
                  <span>{suit.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{suit.tailoringHours} hrs</span>
                </div>
                <h3
                  onClick={() => onSelectSuit(suit)}
                  className="font-serif text-xl text-[#F4F1EA] group-hover:text-[#C8A464] transition-colors cursor-pointer leading-snug"
                >
                  {suit.name}
                </h3>
                <p className="text-xs text-[#A19E95]">
                  {suit.mill} · {suit.weightGsm} g/m²
                </p>
              </div>

              <div className="pt-3 border-t border-[#F4F1EA]/10 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-[#F4F1EA] tabular-nums">
                  £{suit.startingPriceGbp.toLocaleString('en-GB')}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectSuit(suit)}
                  className="inline-flex items-center gap-1 text-xs text-[#C8A464] hover:text-[#D7B67A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Monograph</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
