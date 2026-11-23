import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { SuitMonographModal } from './components/SuitMonographModal';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { AtelierHomePage } from './pages/AtelierHomePage';
import { CraftPage } from './pages/CraftPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { Appointment, BespokeSuit, PageRoute } from './types/tailor';
import { loadAppointments, saveAppointments } from './utils/bookingStore';

const ROUTE_TRANSITION = {
  duration: 0.36,
  ease: [0.16, 1, 0.3, 1] as const,
};

function getInitialRoute(): PageRoute {
  const hash = window.location.hash.replace('#', '');
  if (
    hash === 'atelier' ||
    hash === 'portfolio' ||
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
  const [bookingCommissionRef, setBookingCommissionRef] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadAppointments()
  );

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

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-[#09090B] text-[#F4F1EA]">
        <Navbar
          activeRoute={route}
          onNavigate={navigateTo}
          onBookFitting={() => {
            setBookingCommissionRef('');
            navigateTo('appointments');
          }}
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
      </div>
    </MotionConfig>
  );
}
