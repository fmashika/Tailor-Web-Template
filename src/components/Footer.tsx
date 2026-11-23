import { PageRoute } from '../types/tailor';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-[#F4F1EA]/10 bg-[#070709]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-1.5">
          <p className="font-serif text-xl text-[#F4F1EA]">Marlowe Bespoke</p>
          <p className="text-xs text-[#A19E95]">
            14 Savile Row, London W1S 3JN · Via Brera 28, 20121 Milano
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-6 text-xs text-[#A19E95]">
          <button
            type="button"
            onClick={() => onNavigate('atelier')}
            className="hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            Atelier
          </button>
          <button
            type="button"
            onClick={() => onNavigate('portfolio')}
            className="hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            Portfolio
          </button>
          <button
            type="button"
            onClick={() => onNavigate('shop')}
            className="hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => onNavigate('craft')}
            className="hover:text-[#F4F1EA] transition-colors cursor-pointer"
          >
            Craft &amp; Cloth
          </button>
          <button
            type="button"
            onClick={() => onNavigate('appointments')}
            className="hover:text-[#C8A464] transition-colors cursor-pointer"
          >
            Private Appointments
          </button>
        </nav>

        <p className="text-xs text-[#A19E95]/80">
          © {new Date().getFullYear()} Marlowe Bespoke Tailors Ltd.
        </p>
      </div>
    </footer>
  );
}
