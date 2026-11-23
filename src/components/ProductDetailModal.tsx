import { Check, Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { ShopProduct } from '../types/tailor';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: ShopProduct | null;
  onClose: () => void;
  onAddToCart: (product: ShopProduct, variant: string, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] ?? '');
      setQuantity(1);
      setJustAdded(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  const handleAdd = () => {
    if (!product) return;
    const variant = selectedVariant || product.variants[0] || 'Standard';
    onAddToCart(product, variant, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="pdp-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-[#111114] border border-[#F4F1EA]/12 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl my-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product view"
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-[#09090B]/80 border border-[#F4F1EA]/15 text-[#F4F1EA] hover:text-[#C8A464] hover:border-[#C8A464]/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Product Visual */}
            <div className="lg:col-span-6 bg-[#09090B] relative min-h-[320px] lg:min-h-[540px]">
              <ResilientImage
                src={product.image}
                alt={product.name}
                title={product.name}
                className={`w-full h-full object-cover ${
                  product.category === 'Ready-to-Wear Suits'
                    ? 'object-[50%_20%]'
                    : 'object-center'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-xs text-[#F4F1EA]/85">
                <span>{product.category}</span>
                <span className="font-mono tabular-nums">{product.sku}</span>
              </div>
            </div>

            {/* Right Contiguous Purchase Module */}
            <div className="lg:col-span-6 p-7 md:p-10 flex flex-col justify-between gap-6">
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-[#C8A464] mb-1.5">
                    {product.origin} · {product.leadTime}
                  </p>
                  <h2
                    id="pdp-title"
                    className="font-serif text-3xl md:text-4xl text-[#F4F1EA] leading-tight"
                  >
                    {product.name}
                  </h2>
                  <p className="font-serif text-2xl text-[#F4F1EA] tabular-nums mt-2">
                    £{product.priceGbp.toLocaleString('en-GB')}
                  </p>
                </div>

                <p className="text-sm text-[#A19E95] leading-relaxed">
                  {product.description}
                </p>

                <div className="py-3 border-y border-[#F4F1EA]/10 text-xs space-y-1">
                  <p className="text-[#A19E95]">Material</p>
                  <p className="text-[#F4F1EA] font-medium">{product.material}</p>
                </div>

                {/* Variant Selector */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A19E95]">{product.variantLabel}</span>
                    <span className="text-[#F4F1EA] font-medium">{selectedVariant}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const active = variant === selectedVariant;
                      return (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3.5 py-2 text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            active
                              ? 'bg-[#C8A464] text-[#09090B] border-[#C8A464]'
                              : 'bg-[#09090B] text-[#F4F1EA] border-[#F4F1EA]/15 hover:border-[#F4F1EA]/40'
                          }`}
                        >
                          {variant}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Craft Details */}
                <ul className="space-y-1.5 text-xs text-[#F4F1EA]/85">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-[#C8A464] shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Add to Bag Row */}
              <div className="pt-4 border-t border-[#F4F1EA]/10 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center border border-[#F4F1EA]/15 bg-[#09090B]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center text-[#A19E95] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-mono tabular-nums text-[#F4F1EA]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-10 h-11 flex items-center justify-center text-[#A19E95] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors whitespace-nowrap cursor-pointer"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        Add to Cart — £
                        {(product.priceGbp * quantity).toLocaleString('en-GB')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
