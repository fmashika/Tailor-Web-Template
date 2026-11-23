import { Check, Plus, ShoppingCart } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SHOP_PRODUCTS } from '../data/tailorData';
import { ShopCategory, ShopProduct } from '../types/tailor';
import { ResilientImage } from '../components/ResilientImage';

interface ShopPageProps {
  cartCount: number;
  onSelectProduct: (product: ShopProduct) => void;
  onQuickAdd: (product: ShopProduct, variant: string) => void;
  onOpenCart: () => void;
}

const SHOP_CATEGORIES: ShopCategory[] = [
  'All',
  'Ready-to-Wear Suits',
  'Outerwear',
  'Shirting',
  'Silk & Neckwear',
  'Leather & Travel',
];

type ShopSort = 'featured' | 'price-asc' | 'price-desc';

export function ShopPage({
  cartCount,
  onSelectProduct,
  onQuickAdd,
  onOpenCart,
}: ShopPageProps) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('All');
  const [sortBy, setSortBy] = useState<ShopSort>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? [...SHOP_PRODUCTS]
        : SHOP_PRODUCTS.filter((p) => p.category === activeCategory);

    if (sortBy === 'price-asc') {
      base.sort((a, b) => a.priceGbp - b.priceGbp);
    } else if (sortBy === 'price-desc') {
      base.sort((a, b) => b.priceGbp - a.priceGbp);
    }
    return base;
  }, [activeCategory, sortBy]);

  const handleQuickAdd = (product: ShopProduct) => {
    const defaultVariant = product.variants[0] ?? 'Standard';
    onQuickAdd(product, defaultVariant);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId((prev) => (prev === product.id ? null : prev));
    }, 1200);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#F4F1EA]/10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464]">
            Haberdashery &amp; Ready-to-Wear
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F4F1EA] leading-tight">
            The Atelier Shop
          </h1>
          <p className="text-[15px] text-[#A19E95] leading-relaxed">
            Small-batch ready-to-wear suiting, Sea Island shirting, Como silk neckwear,
            and bridle leather travel pieces. Complimentary courier dispatch over £500.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 self-start lg:self-end shrink-0">
          <div className="flex items-center gap-2.5">
            <label htmlFor="shop-sort" className="text-xs text-[#A19E95] whitespace-nowrap">
              Order By
            </label>
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ShopSort)}
              className="bg-[#111114] border border-[#F4F1EA]/15 text-xs text-[#F4F1EA] px-3.5 py-2.5 focus:outline-none focus:border-[#C8A464] cursor-pointer"
            >
              <option value="featured">Curated Selection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-[#C8A464]/50 text-[#F4F1EA] hover:bg-[#C8A464] hover:text-[#09090B] transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>View Cart ({cartCount})</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Filter shop products by category"
          className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#111114] border border-[#F4F1EA]/10"
        >
          {SHOP_CATEGORIES.map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
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
          {filteredProducts.length}{' '}
          {filteredProducts.length === 1 ? 'piece available' : 'pieces available'}
        </p>
      </div>

      {/* 3-Column Uniform Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const isAdded = addedId === product.id;
          return (
            <article
              key={product.id}
              className="group flex flex-col bg-[#111114] border border-[#F4F1EA]/10 hover:border-[#C8A464]/45 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div
                onClick={() => onSelectProduct(product)}
                className="aspect-[4/3] bg-[#09090B] overflow-hidden relative cursor-pointer"
              >
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  title={product.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
                    product.category === 'Ready-to-Wear Suits'
                      ? 'object-[50%_20%]'
                      : 'object-center'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/65 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#A19E95]">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.origin}</span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <h2
                      onClick={() => onSelectProduct(product)}
                      className="font-serif text-2xl text-[#F4F1EA] group-hover:text-[#C8A464] transition-colors cursor-pointer leading-snug"
                    >
                      {product.name}
                    </h2>
                    <span className="text-sm font-medium text-[#F4F1EA] tabular-nums shrink-0">
                      £{product.priceGbp.toLocaleString('en-GB')}
                    </span>
                  </div>

                  <p className="text-xs text-[#A19E95] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F4F1EA]/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="text-xs text-[#A19E95] hover:text-[#F4F1EA] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Select Size / View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isAdded
                        ? 'bg-[#F4F1EA] text-[#09090B]'
                        : 'bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
