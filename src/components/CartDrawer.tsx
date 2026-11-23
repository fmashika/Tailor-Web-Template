import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { FormEvent, useEffect, useState } from 'react';
import { SHOP_PRODUCTS } from '../data/tailorData';
import { CartItem, ShopOrder } from '../types/tailor';
import { generateOrderNumber } from '../utils/cartStore';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  orders: ShopOrder[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, variant: string, nextQty: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onPlaceOrder: (order: ShopOrder) => void;
  onBrowseShop: () => void;
}

type DrawerStep = 'bag' | 'checkout' | 'confirmed' | 'orders';

const FREE_SHIPPING_THRESHOLD = 500;
const STANDARD_SHIPPING_GBP = 25;

export function CartDrawer({
  isOpen,
  items,
  orders,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onBrowseShop,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'Card Dispatch' | 'Cash on Delivery'
  >('Card Dispatch');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<ShopOrder | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && step === 'confirmed' && items.length > 0) {
      setStep('bag');
    }
  }, [isOpen, items.length, step]);

  const resolvedItems = items
    .map((item) => {
      const product = SHOP_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter((entry): entry is CartItem & { product: (typeof SHOP_PRODUCTS)[number] } =>
      Boolean(entry)
    );

  const totalUnits = resolvedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalGbp = resolvedItems.reduce(
    (sum, item) => sum + item.product.priceGbp * item.quantity,
    0
  );
  const shippingGbp =
    subtotalGbp === 0 || subtotalGbp >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_GBP;
  const totalGbp = subtotalGbp + shippingGbp;

  const handleCheckoutSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !shippingAddress.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      setCheckoutError('Please complete all recipient and delivery address fields.');
      return;
    }

    const order: ShopOrder = {
      orderNumber: generateOrderNumber(),
      items: resolvedItems.map((entry) => ({
        productId: entry.product.id,
        name: entry.product.name,
        variant: entry.variant,
        quantity: entry.quantity,
        unitPriceGbp: entry.product.priceGbp,
      })),
      subtotalGbp,
      shippingGbp,
      totalGbp,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      shippingAddress: shippingAddress.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      createdAtIso: new Date().toISOString(),
    };

    onPlaceOrder(order);
    setLatestOrder(order);
    setStep('confirmed');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart"
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg h-full bg-[#0E0E12] border-l border-[#F4F1EA]/12 flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="px-6 pt-5 pb-4 border-b border-[#F4F1EA]/10 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {step === 'checkout' && (
                    <button
                      type="button"
                      onClick={() => setStep('bag')}
                      aria-label="Back to shopping cart"
                      className="p-1.5 text-[#A19E95] hover:text-[#F4F1EA] transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <h2 className="font-serif text-2xl text-[#F4F1EA]">
                    {step === 'bag' && `Cart (${totalUnits})`}
                    {step === 'checkout' && 'Delivery & Verification'}
                    {step === 'confirmed' && 'Order Confirmed'}
                    {step === 'orders' && 'Order History'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close cart drawer"
                  className="w-9 h-9 flex items-center justify-center border border-[#F4F1EA]/15 text-[#F4F1EA] hover:border-[#C8A464] hover:text-[#C8A464] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Section Switcher */}
              {step !== 'checkout' && (
                <div
                  role="tablist"
                  aria-label="Cart sections"
                  className="grid grid-cols-2 gap-1 p-1 bg-[#09090B] border border-[#F4F1EA]/10"
                >
                  <button
                    role="tab"
                    aria-selected={step === 'bag' || step === 'confirmed'}
                    type="button"
                    onClick={() => setStep('bag')}
                    className={`py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap tabular-nums cursor-pointer ${
                      step === 'bag' || step === 'confirmed'
                        ? 'bg-[#C8A464] text-[#09090B]'
                        : 'text-[#A19E95] hover:text-[#F4F1EA]'
                    }`}
                  >
                    Cart ({totalUnits})
                  </button>
                  <button
                    role="tab"
                    aria-selected={step === 'orders'}
                    type="button"
                    onClick={() => setStep('orders')}
                    className={`py-2 px-3 text-xs font-medium transition-colors whitespace-nowrap tabular-nums cursor-pointer ${
                      step === 'orders'
                        ? 'bg-[#C8A464] text-[#09090B]'
                        : 'text-[#A19E95] hover:text-[#F4F1EA]'
                    }`}
                  >
                    Order History ({orders.length})
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {step === 'bag' && (
                <>
                  {resolvedItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                      <ShoppingCart
                        className="w-9 h-9 text-[#C8A464]/70"
                        strokeWidth={1.25}
                      />
                      <div className="space-y-1.5">
                        <p className="font-serif text-2xl text-[#F4F1EA]">
                          Your Cart Is Empty
                        </p>
                        <p className="text-xs text-[#A19E95] max-w-xs">
                          Explore our ready-to-wear tailoring, Sea Island shirting, Como
                          silk neckwear, and bridle leather travel goods.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onBrowseShop();
                        }}
                        className="px-6 py-3 text-xs font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
                      >
                        Browse Atelier Shop
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {resolvedItems.map((entry) => (
                        <div
                          key={`${entry.product.id}-${entry.variant}`}
                          className="pb-5 border-b border-[#F4F1EA]/10 flex gap-4"
                        >
                          <div className="w-24 h-20 bg-[#141418] border border-[#F4F1EA]/10 shrink-0 overflow-hidden">
                            <ResilientImage
                              src={entry.product.image}
                              alt={entry.product.name}
                              title={entry.product.name}
                              className={`w-full h-full object-cover ${
                                entry.product.category === 'Ready-to-Wear Suits'
                                  ? 'object-[50%_20%]'
                                  : 'object-center'
                              }`}
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-serif text-lg text-[#F4F1EA] truncate">
                                  {entry.product.name}
                                </p>
                                <p className="text-xs text-[#A19E95]">
                                  {entry.product.variantLabel}: {entry.variant}
                                </p>
                              </div>
                              <button
                                type="button"
                                aria-label={`Remove ${entry.product.name}`}
                                onClick={() =>
                                  onRemoveItem(entry.product.id, entry.variant)
                                }
                                className="text-[#A19E95] hover:text-[#F4F1EA] transition-colors p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="inline-flex items-center border border-[#F4F1EA]/15 bg-[#09090B]">
                                <button
                                  type="button"
                                  aria-label="Decrease quantity"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      entry.product.id,
                                      entry.variant,
                                      entry.quantity - 1
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center text-[#A19E95] hover:text-[#F4F1EA] cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-mono tabular-nums text-[#F4F1EA]">
                                  {entry.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Increase quantity"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      entry.product.id,
                                      entry.variant,
                                      entry.quantity + 1
                                    )
                                  }
                                  className="w-8 h-8 flex items-center justify-center text-[#A19E95] hover:text-[#F4F1EA] cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-sm font-medium text-[#F4F1EA] tabular-nums">
                                £
                                {(entry.product.priceGbp * entry.quantity).toLocaleString(
                                  'en-GB'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 'checkout' && (
                <form
                  id="atelier-checkout-form"
                  onSubmit={handleCheckoutSubmit}
                  className="space-y-5"
                >
                  <div className="p-4 bg-[#141418] border border-[#F4F1EA]/10 text-xs space-y-1">
                    <p className="text-[#C8A464] font-medium">
                      Complimentary Courier Over £{FREE_SHIPPING_THRESHOLD}
                    </p>
                    <p className="text-[#A19E95]">
                      Dispatched in cedar-lined garment packaging with signature verification.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="checkout-name"
                        className="block text-xs text-[#A19E95] mb-1.5"
                      >
                        Recipient Full Name *
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Alistair Finch"
                        className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A464]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-email"
                        className="block text-xs text-[#A19E95] mb-1.5"
                      >
                        Email for Dispatch Receipt *
                      </label>
                      <input
                        id="checkout-email"
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="alistair@domain.com"
                        className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A464]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-address"
                        className="block text-xs text-[#A19E95] mb-1.5"
                      >
                        Street Address *
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="22 Mount Street, Mayfair"
                        className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A464]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="checkout-city"
                          className="block text-xs text-[#A19E95] mb-1.5"
                        >
                          City *
                        </label>
                        <input
                          id="checkout-city"
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="London"
                          className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A464]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="checkout-postal"
                          className="block text-xs text-[#A19E95] mb-1.5"
                        >
                          Postal Code *
                        </label>
                        <input
                          id="checkout-postal"
                          type="text"
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="W1K 2TH"
                          className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-3.5 py-2.5 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A464]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-xs text-[#A19E95]">Settlement Method</p>
                      <div className="grid grid-cols-2 gap-3">
                        {(['Card Dispatch', 'Cash on Delivery'] as const).map(
                          (method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`p-3 text-left text-xs border transition-colors cursor-pointer ${
                                paymentMethod === method
                                  ? 'bg-[#18181D] border-[#C8A464] text-[#F4F1EA]'
                                  : 'bg-[#111114] border-[#F4F1EA]/10 text-[#A19E95]'
                              }`}
                            >
                              {method}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {checkoutError && (
                    <div
                      role="alert"
                      className="p-3 bg-[#3A1619] border border-[#E11D48]/50 text-xs text-[#F4F1EA]"
                    >
                      {checkoutError}
                    </div>
                  )}
                </form>
              )}

              {step === 'confirmed' && latestOrder && (
                <div className="space-y-6 py-4">
                  <div className="p-5 bg-[#141418] border border-[#C8A464]/45 space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs text-[#C8A464]">
                      <Check className="w-4 h-4" />
                      <span>Order #{latestOrder.orderNumber} Confirmed</span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#F4F1EA]">
                      Preparing Atelier Dispatch
                    </h3>
                    <p className="text-xs text-[#A19E95] leading-relaxed">
                      Confirmation sent to {latestOrder.customerEmail}. Delivery to{' '}
                      {latestOrder.shippingAddress}, {latestOrder.city}{' '}
                      {latestOrder.postalCode}.
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="text-[#A19E95]">Order Items</p>
                    {latestOrder.items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variant}`}
                        className="flex items-baseline justify-between gap-4 py-2 border-b border-[#F4F1EA]/10"
                      >
                        <div>
                          <p className="text-[#F4F1EA] font-medium">
                            {item.quantity} × {item.name}
                          </p>
                          <p className="text-[#A19E95]">{item.variant}</p>
                        </div>
                        <span className="text-[#F4F1EA] tabular-nums">
                          £
                          {(item.unitPriceGbp * item.quantity).toLocaleString('en-GB')}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2 space-y-1.5">
                      <div className="flex justify-between text-[#A19E95]">
                        <span>Payment Method</span>
                        <span className="text-[#F4F1EA]">
                          {latestOrder.paymentMethod}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium text-[#F4F1EA] pt-2 border-t border-[#F4F1EA]/10">
                        <span>Total Paid / Due</span>
                        <span className="tabular-nums text-[#C8A464]">
                          £{latestOrder.totalGbp.toLocaleString('en-GB')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'orders' && (
                <section aria-label="Order History" className="space-y-5">
                  {orders.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <ShoppingCart
                        className="w-9 h-9 text-[#C8A464]/60 mx-auto"
                        strokeWidth={1.25}
                      />
                      <div className="space-y-1.5">
                        <p className="font-serif text-2xl text-[#F4F1EA]">
                          No Completed Orders Yet
                        </p>
                        <p className="text-xs text-[#A19E95] max-w-xs mx-auto leading-relaxed">
                          Completed purchases from the Atelier Shop will appear here with
                          transaction dates and itemized garments.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onBrowseShop();
                        }}
                        className="px-6 py-3 text-xs font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
                      >
                        Explore Atelier Shop
                      </button>
                    </div>
                  ) : (
                    orders.map((order) => {
                      const orderDate = new Date(order.createdAtIso);
                      const formattedDate = Number.isNaN(orderDate.getTime())
                        ? order.createdAtIso
                        : orderDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          });
                      const formattedTime = Number.isNaN(orderDate.getTime())
                        ? ''
                        : orderDate.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                      return (
                        <article
                          key={order.orderNumber}
                          className="p-5 bg-[#141418] border border-[#F4F1EA]/12 space-y-4"
                        >
                          {/* Transaction Header */}
                          <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#F4F1EA]/10">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-mono text-[#C8A464] tabular-nums">
                                  {order.orderNumber}
                                </span>
                                <span aria-hidden="true" className="text-[#A19E95]">
                                  ·
                                </span>
                                <span className="text-[#F4F1EA]">Completed</span>
                              </div>
                              <p className="text-xs text-[#A19E95] tabular-nums">
                                {formattedDate}
                                {formattedTime ? ` at ${formattedTime}` : ''}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-[11px] text-[#A19E95]">Total</p>
                              <p className="font-serif text-xl text-[#F4F1EA] tabular-nums">
                                £{order.totalGbp.toLocaleString('en-GB')}
                              </p>
                            </div>
                          </div>

                          {/* Purchased Items */}
                          <ul className="space-y-2.5 text-xs">
                            {order.items.map((item) => (
                              <li
                                key={`${order.orderNumber}-${item.productId}-${item.variant}`}
                                className="flex items-baseline justify-between gap-4"
                              >
                                <div className="min-w-0">
                                  <p className="text-[#F4F1EA] font-medium truncate">
                                    {item.quantity} × {item.name}
                                  </p>
                                  <p className="text-[#A19E95]">{item.variant}</p>
                                </div>
                                <span className="text-[#F4F1EA]/90 tabular-nums shrink-0">
                                  £
                                  {(item.unitPriceGbp * item.quantity).toLocaleString(
                                    'en-GB'
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {/* Recipient & Payment Metadata */}
                          <div className="pt-3 border-t border-[#F4F1EA]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A19E95]">
                            <span>
                              {order.customerName} · {order.city} {order.postalCode}
                            </span>
                            <span>
                              {order.paymentMethod} ·{' '}
                              {order.shippingGbp === 0
                                ? 'Complimentary Courier'
                                : `Courier £${order.shippingGbp}`}
                            </span>
                          </div>
                        </article>
                      );
                    })
                  )}
                </section>
              )}
            </div>

            {/* Drawer Footer */}
            {step === 'bag' && resolvedItems.length > 0 && (
              <div className="p-6 border-t border-[#F4F1EA]/10 bg-[#0B0B0E] space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#A19E95]">
                    <span>Subtotal</span>
                    <span className="tabular-nums text-[#F4F1EA]">
                      £{subtotalGbp.toLocaleString('en-GB')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#A19E95]">
                    <span>Atelier Courier</span>
                    <span className="tabular-nums text-[#F4F1EA]">
                      {shippingGbp === 0 ? 'Complimentary' : `£${shippingGbp}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-medium text-[#F4F1EA] pt-2 border-t border-[#F4F1EA]/10">
                    <span>Total</span>
                    <span className="font-serif text-xl tabular-nums text-[#C8A464]">
                      £{totalGbp.toLocaleString('en-GB')}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="w-full py-3.5 px-6 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}

            {step === 'checkout' && (
              <div className="p-6 border-t border-[#F4F1EA]/10 bg-[#0B0B0E] space-y-3">
                <div className="flex justify-between text-sm text-[#F4F1EA]">
                  <span>Order Total</span>
                  <span className="font-serif text-xl tabular-nums text-[#C8A464]">
                    £{totalGbp.toLocaleString('en-GB')}
                  </span>
                </div>
                <button
                  type="submit"
                  form="atelier-checkout-form"
                  className="w-full py-3.5 px-6 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
                >
                  Complete Order
                </button>
              </div>
            )}

            {step === 'confirmed' && (
              <div className="p-6 border-t border-[#F4F1EA]/10 bg-[#0B0B0E] grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStep('orders')}
                  className="py-3 px-4 text-xs font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
                >
                  View Order History
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('bag');
                    onClose();
                  }}
                  className="py-3 px-4 text-xs font-medium bg-[#F4F1EA] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
