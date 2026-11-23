import { Menu, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { PageRoute } from '../types/tailor';

interface NavbarProps {
  activeRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onBookFitting: () => void;
}

const NAV_ITEMS: { route: PageRoute; label: string }[] = [
  { route: 'atelier', label: 'Atelier' },
  { route: 'portfolio', label: 'Portfolio' },
  { route: 'craft', label: 'Craft' },
  { route: 'appointments', label: 'Appointments' },
];

export function Navbar({ activeRoute, onNavigate, onBookFitting }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090B]/90 backdrop-blur-md border-b border-[#F4F1EA]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLinkClick('atelier')}
          className="font-serif text-2xl tracking-tight text-[#F4F1EA] hover:text-[#C8A464] transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A464]"
        >
          Marlowe Bespoke
        </button>

        {/* Zone 2: 4 Single-line Text Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                className={`relative py-2 transition-colors duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A464] ${
                  isActive
                    ? 'text-[#F4F1EA]'
                    : 'text-[#A19E95] hover:text-[#F4F1EA]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-[#C8A464]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onBookFitting();
            }}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium tracking-wide bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA]"
          >
            Book Fitting
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-[#F4F1EA] hover:text-[#C8A464] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E0E12] border-t border-[#F4F1EA]/10 px-6 py-5 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleLinkClick(item.route)}
                className={`w-full text-left py-3 px-2 text-base font-medium border-b border-[#F4F1EA]/5 transition-colors cursor-pointer ${
                  isActive ? 'text-[#C8A464]' : 'text-[#F4F1EA]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onBookFitting();
              }}
              className="w-full py-3 px-5 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
            >
              Book Fitting
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
