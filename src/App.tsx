import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SuitMonographModal } from './components/SuitMonographModal';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AtelierHomePage } from './pages/AtelierHomePage';
import { CraftPage } from './pages/CraftPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ShopPage } from './pages/ShopPage';
import {
  Appointment,
  BespokeSuit,
  CartItem,
  PageRoute,
  ShopOrder,
  ShopProduct,
} from './types/tailor';
import { loadAppointments, saveAppointments } from './utils/bookingStore';
import { loadCart, loadOrders, saveCart, saveOrders } from './utils/cartStore';

const ROUTE_TRANSITION = {
  duration: 0.36,
  ease: [0.16, 1, 0.3, 1] as const,
};

function getInitialRoute(): PageRoute {
  const hash = window.location.hash.replace('#', '');
  if (
    hash === 'atelier' ||
    hash === 'portfolio' ||
    hash === 'shop' ||
    hash === 'craft' ||
    hash === 'appointments'
  ) {
    return hash;
  }
  return 'atelier';
}

export default function App() {
  const [route, setRoute] = useState<PageRoute>(getInitialRoute);
  const [selectedSuit, setSelectedSuit] = useState<BespokeSuit | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [bookingCommissionRef, setBookingCommissionRef] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadAppointments()
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart());
  const [orders, setOrders] = useState<ShopOrder[]>(() => loadOrders());

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getInitialRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    window.location.hash = nextRoute;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookWithReference = (referenceLabel: string) => {
    setSelectedSuit(null);
    setBookingCommissionRef(referenceLabel);
    navigateTo('appointments');
  };

  const handleCreateAppointment = (created: Appointment) => {
    setAppointments((prev) => {
      const next = [created, ...prev];
      saveAppointments(next);
      return next;
    });
  };

  const handleRescheduleAppointment = (
    id: string,
    dateIso: string,
    timeSlot: string
  ) => {
    setAppointments((prev) => {
      const next = prev.map((appt) =>
        appt.id === id
          ? { ...appt, dateIso, timeSlot, status: 'Rescheduled' as const }
          : appt
      );
      saveAppointments(next);
      return next;
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) => {
      const next = prev.map((appt) =>
        appt.id === id ? { ...appt, status: 'Cancelled' as const } : appt
      );
      saveAppointments(next);
      return next;
    });
  };

  const handleAddToCart = (
    product: ShopProduct,
    variant: string,
    quantity = 1
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variant === variant
      );
      let next: CartItem[];
      if (existingIndex >= 0) {
        next = prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        next = [...prev, { productId: product.id, variant, quantity }];
      }
      saveCart(next);
      return next;
    });
  };

  const handleUpdateCartQuantity = (
    productId: string,
    variant: string,
    nextQty: number
  ) => {
    setCartItems((prev) => {
      const next =
        nextQty <= 0
          ? prev.filter(
              (item) => !(item.productId === productId && item.variant === variant)
            )
          : prev.map((item) =>
              item.productId === productId && item.variant === variant
                ? { ...item, quantity: nextQty }
                : item
            );
      saveCart(next);
      return next;
    });
  };

  const handleRemoveCartItem = (productId: string, variant: string) => {
    setCartItems((prev) => {
      const next = prev.filter(
        (item) => !(item.productId === productId && item.variant === variant)
      );
      saveCart(next);
      return next;
    });
  };

  const handlePlaceOrder = (order: ShopOrder) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      saveOrders(next);
      return next;
    });
    setCartItems([]);
    saveCart([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#09090B] text-[#F4F1EA]">
        <Navbar
          activeRoute={route}
          cartCount={cartCount}
          onNavigate={navigateTo}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={ROUTE_TRANSITION}
            >
              {route === 'atelier' && (
                <AtelierHomePage
                  onNavigate={navigateTo}
                  onSelectSuit={setSelectedSuit}
                  onBookFitting={() => {
                    setBookingCommissionRef('');
                    navigateTo('appointments');
                  }}
                />
              )}

              {route === 'portfolio' && (
                <PortfolioPage
                  onSelectSuit={setSelectedSuit}
                  onCommissionSuit={handleBookWithReference}
                />
              )}

              {route === 'shop' && (
                <ShopPage
                  cartCount={cartCount}
                  onSelectProduct={setSelectedProduct}
                  onQuickAdd={(product, variant) =>
                    handleAddToCart(product, variant, 1)
                  }
                  onOpenCart={() => setIsCartOpen(true)}
                />
              )}

              {route === 'craft' && (
                <CraftPage onCommissionCloth={handleBookWithReference} />
              )}

              {route === 'appointments' && (
                <AppointmentsPage
                  appointments={appointments}
                  initialCommissionReference={bookingCommissionRef}
                  onCreateAppointment={handleCreateAppointment}
                  onRescheduleAppointment={handleRescheduleAppointment}
                  onCancelAppointment={handleCancelAppointment}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onNavigate={navigateTo} />

        <SuitMonographModal
          suit={selectedSuit}
          onClose={() => setSelectedSuit(null)}
          onCommissionSuit={handleBookWithReference}
        />

        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />

        <CartDrawer
          isOpen={isCartOpen}
          items={cartItems}
          orders={orders}
          onClose={() => setIsCartOpen(false)}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onPlaceOrder={handlePlaceOrder}
          onBrowseShop={() => navigateTo('shop')}
        />
      </div>
    </MotionConfig>
  );
}
