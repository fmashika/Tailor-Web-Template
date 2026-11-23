import { Calendar, Check, Clock, MapPin, User, X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import {
  ATELIER_LOCATIONS,
  FITTING_SERVICES,
  MASTER_CUTTERS,
  SUIT_PORTFOLIO,
  TIME_SLOTS,
} from '../data/tailorData';
import { Appointment } from '../types/tailor';
import {
  downloadAppointmentIcs,
  generateReferenceCode,
  getUpcomingAtelierDates,
  isSlotTaken,
} from '../utils/bookingStore';

interface AppointmentsPageProps {
  appointments: Appointment[];
  initialCommissionReference?: string;
  onCreateAppointment: (appointment: Appointment) => void;
  onRescheduleAppointment: (id: string, dateIso: string, timeSlot: string) => void;
  onCancelAppointment: (id: string) => void;
}

type BookingTab = 'schedule' | 'manage';

export function AppointmentsPage({
  appointments,
  initialCommissionReference = '',
  onCreateAppointment,
  onRescheduleAppointment,
  onCancelAppointment,
}: AppointmentsPageProps) {
  const upcomingDates = useMemo(() => getUpcomingAtelierDates(12), []);

  const [activeTab, setActiveTab] = useState<BookingTab>('schedule');
  const [serviceId, setServiceId] = useState<string>(FITTING_SERVICES[0].id);
  const [locationId, setLocationId] = useState<string>(ATELIER_LOCATIONS[0].id);
  const [cutterId, setCutterId] = useState<string>(MASTER_CUTTERS[0].id);
  const [selectedDateIso, setSelectedDateIso] = useState<string>(
    upcomingDates[0]?.iso ?? ''
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [commissionReference, setCommissionReference] = useState<string>(
    initialCommissionReference
  );

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] =
    useState<Appointment | null>(null);

  // Rescheduling inline state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDateIso, setRescheduleDateIso] = useState<string>(
    upcomingDates[0]?.iso ?? ''
  );
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState<string>('');

  const selectedService =
    FITTING_SERVICES.find((s) => s.id === serviceId) ?? FITTING_SERVICES[0];
  const selectedLocation =
    ATELIER_LOCATIONS.find((l) => l.id === locationId) ?? ATELIER_LOCATIONS[0];
  const selectedCutter =
    MASTER_CUTTERS.find((c) => c.id === cutterId) ?? MASTER_CUTTERS[0];
  const selectedDateObj = upcomingDates.find((d) => d.iso === selectedDateIso);

  const activeBookingsCount = appointments.filter(
    (a) => a.status !== 'Cancelled'
  ).length;

  const handleCutterOrDateChange = (nextCutterId: string, nextDateIso: string) => {
    setCutterId(nextCutterId);
    setSelectedDateIso(nextDateIso);
    if (
      selectedTimeSlot &&
      isSlotTaken(appointments, nextCutterId, nextDateIso, selectedTimeSlot)
    ) {
      setSelectedTimeSlot('');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedDateIso || !selectedTimeSlot) {
      setFormError('Please select an available date and time slot for your fitting.');
      return;
    }
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setFormError('Please enter your full name, email address, and telephone number.');
      return;
    }
    if (isSlotTaken(appointments, cutterId, selectedDateIso, selectedTimeSlot)) {
      setFormError(
        'That time slot has just been reserved. Please choose another available time.'
      );
      setSelectedTimeSlot('');
      return;
    }

    const created: Appointment = {
      id: `appt-${Date.now()}`,
      referenceCode: generateReferenceCode(),
      serviceId,
      locationId,
      cutterId,
      dateIso: selectedDateIso,
      timeSlot: selectedTimeSlot,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      commissionReference: commissionReference.trim() || undefined,
      notes: notes.trim() || undefined,
      status: 'Confirmed',
      createdAtIso: new Date().toISOString(),
    };

    onCreateAppointment(created);
    setConfirmedAppointment(created);
  };

  const handleStartNewBooking = () => {
    setConfirmedAppointment(null);
    setSelectedTimeSlot('');
    setNotes('');
    setFormError(null);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-12 md:py-16">
      {/* Header & Workspace Tab Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F4F1EA]/10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#C8A464]">
            Private Salon Reservations
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#F4F1EA] leading-tight">
            Online Fitting Appointment System
          </h1>
          <p className="text-[15px] text-[#A19E95] leading-relaxed">
            Reserve dedicated one-on-one studio time with a master cutter in London,
            Milan, or our encrypted virtual salon.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Appointment workspace tabs"
          className="inline-flex items-center gap-1 p-1 bg-[#111114] border border-[#F4F1EA]/10 self-start md:self-end shrink-0"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'schedule'}
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-[#C8A464] text-[#09090B]'
                : 'text-[#A19E95] hover:text-[#F4F1EA]'
            }`}
          >
            Schedule Fitting
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'manage'}
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
              activeTab === 'manage'
                ? 'bg-[#C8A464] text-[#09090B]'
                : 'text-[#A19E95] hover:text-[#F4F1EA]'
            }`}
          >
            My Appointments ({activeBookingsCount})
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        confirmedAppointment ? (
          /* Confirmed Atelier Pass */
          <div className="mt-10 max-w-3xl mx-auto bg-[#111114] border border-[#C8A464]/45 p-8 md:p-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F4F1EA]/10">
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-[#C8A464] mb-2">
                  <Check className="w-4 h-4" />
                  <span>Confirmed Atelier Reservation</span>
                </div>
                <h2 className="font-serif text-3xl text-[#F4F1EA]">
                  We Look Forward to Welcoming You, {confirmedAppointment.clientName}
                </h2>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <p className="text-xs text-[#A19E95]">Reference</p>
                <p className="font-mono text-lg text-[#C8A464] tabular-nums">
                  {confirmedAppointment.referenceCode}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-[#A19E95]">Service</p>
                <p className="text-[#F4F1EA] font-medium">
                  {
                    FITTING_SERVICES.find(
                      (s) => s.id === confirmedAppointment.serviceId
                    )?.name
                  }
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#A19E95]">Master Cutter</p>
                <p className="text-[#F4F1EA] font-medium">
                  {
                    MASTER_CUTTERS.find((c) => c.id === confirmedAppointment.cutterId)
                      ?.name
                  }
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#A19E95]">Date &amp; Time</p>
                <p className="text-[#F4F1EA] font-medium tabular-nums">
                  {confirmedAppointment.dateIso} · {confirmedAppointment.timeSlot}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#A19E95]">Atelier Location</p>
                <p className="text-[#F4F1EA] font-medium">
                  {
                    ATELIER_LOCATIONS.find(
                      (l) => l.id === confirmedAppointment.locationId
                    )?.address
                  }
                </p>
              </div>
              {confirmedAppointment.commissionReference && (
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-[#A19E95]">Prepared Commission / Cloth</p>
                  <p className="text-[#C8A464]">
                    {confirmedAppointment.commissionReference}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-[#F4F1EA]/10 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => downloadAppointmentIcs(confirmedAppointment)}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-medium bg-[#F4F1EA] text-[#09090B] hover:bg-[#C8A464] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Download Calendar Invite (.ics)</span>
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="text-xs font-medium text-[#F4F1EA] hover:text-[#C8A464] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Manage Reservations
                </button>
                <button
                  type="button"
                  onClick={handleStartNewBooking}
                  className="text-xs font-medium text-[#C8A464] hover:text-[#D7B67A] transition-colors whitespace-nowrap cursor-pointer"
                >
                  Book Another Fitting
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column Interactive Booking Form */
          <form
            onSubmit={handleSubmit}
            className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            {/* Left Configuration Steps */}
            <div className="lg:col-span-8 space-y-10">
              {/* 01. Service */}
              <div className="space-y-4">
                <h2 className="font-serif text-2xl text-[#F4F1EA]">
                  01. Select Consultation Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FITTING_SERVICES.map((service) => {
                    const active = service.id === serviceId;
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setServiceId(service.id)}
                        className={`text-left p-5 border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                          active
                            ? 'bg-[#18181D] border-[#C8A464]'
                            : 'bg-[#111114] border-[#F4F1EA]/10 hover:border-[#F4F1EA]/30'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-serif text-xl text-[#F4F1EA]">
                            {service.name}
                          </span>
                          <span className="text-xs text-[#C8A464] tabular-nums shrink-0">
                            {service.durationMinutes} min
                          </span>
                        </div>
                        <p className="text-xs text-[#A19E95] leading-relaxed">
                          {service.summary}
                        </p>
                        <p className="text-xs text-[#F4F1EA]/80">{service.feeLabel}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 02. Location & Master Cutter */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-[#F4F1EA]/10">
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl text-[#F4F1EA]">
                    02. Atelier Location
                  </h2>
                  <div className="space-y-3">
                    {ATELIER_LOCATIONS.map((loc) => {
                      const active = loc.id === locationId;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setLocationId(loc.id)}
                          className={`w-full text-left p-4 border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#18181D] border-[#C8A464]'
                              : 'bg-[#111114] border-[#F4F1EA]/10 hover:border-[#F4F1EA]/30'
                          }`}
                        >
                          <p className="text-sm font-medium text-[#F4F1EA]">{loc.city}</p>
                          <p className="text-xs text-[#A19E95] mt-0.5">{loc.address}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-serif text-2xl text-[#F4F1EA]">
                    03. Master Cutter
                  </h2>
                  <div className="space-y-3">
                    {MASTER_CUTTERS.map((cutter) => {
                      const active = cutter.id === cutterId;
                      return (
                        <button
                          key={cutter.id}
                          type="button"
                          onClick={() =>
                            handleCutterOrDateChange(cutter.id, selectedDateIso)
                          }
                          className={`w-full text-left p-4 border transition-colors cursor-pointer ${
                            active
                              ? 'bg-[#18181D] border-[#C8A464]'
                              : 'bg-[#111114] border-[#F4F1EA]/10 hover:border-[#F4F1EA]/30'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-medium text-[#F4F1EA]">
                              {cutter.name}
                            </p>
                            <span className="text-xs text-[#C8A464] tabular-nums">
                              {cutter.experienceYears} yrs
                            </span>
                          </div>
                          <p className="text-xs text-[#A19E95] mt-0.5">
                            {cutter.title} · {cutter.specialty}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 04. Date & Live Slot Availability */}
              <div className="space-y-5 pt-8 border-t border-[#F4F1EA]/10">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="font-serif text-2xl text-[#F4F1EA]">
                    04. Date &amp; Available Time
                  </h2>
                  <p className="text-xs text-[#A19E95]">
                    Live calendar for {selectedCutter.name}
                  </p>
                </div>

                {/* Date Ribbon */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {upcomingDates.map((d) => {
                    const active = d.iso === selectedDateIso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => handleCutterOrDateChange(cutterId, d.iso)}
                        className={`p-3 border text-center transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#C8A464] text-[#09090B] border-[#C8A464]'
                            : 'bg-[#111114] text-[#F4F1EA] border-[#F4F1EA]/10 hover:border-[#F4F1EA]/30'
                        }`}
                      >
                        <p
                          className={`text-[11px] ${
                            active ? 'text-[#09090B]/80' : 'text-[#A19E95]'
                          }`}
                        >
                          {d.weekdayShort}
                        </p>
                        <p className="font-serif text-xl tabular-nums leading-tight mt-0.5">
                          {d.dayNum}
                        </p>
                        <p
                          className={`text-[11px] ${
                            active ? 'text-[#09090B]/80' : 'text-[#A19E95]'
                          }`}
                        >
                          {d.monthShort}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {TIME_SLOTS.map((slot) => {
                    const taken = isSlotTaken(
                      appointments,
                      cutterId,
                      selectedDateIso,
                      slot
                    );
                    const active = selectedTimeSlot === slot && !taken;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={taken}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-3 px-4 border text-center transition-colors ${
                          taken
                            ? 'bg-[#0C0C0E] border-[#F4F1EA]/5 text-[#A19E95]/45 cursor-not-allowed'
                            : active
                              ? 'bg-[#18181D] border-[#C8A464] text-[#C8A464] cursor-pointer'
                              : 'bg-[#111114] border-[#F4F1EA]/15 text-[#F4F1EA] hover:border-[#C8A464]/50 cursor-pointer'
                        }`}
                      >
                        <span className="block font-mono text-sm tabular-nums">
                          {slot}
                        </span>
                        <span className="block text-[11px] mt-0.5 text-[#A19E95]">
                          {taken ? 'Reserved' : 'Available'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 05. Client Dossier */}
              <div className="space-y-5 pt-8 border-t border-[#F4F1EA]/10">
                <h2 className="font-serif text-2xl text-[#F4F1EA]">
                  05. Client Details &amp; Silhouette Reference
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="client-name"
                      className="block text-xs text-[#A19E95] mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id="client-name"
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alistair Finch"
                      className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#A19E95]/50 focus:outline-none focus:border-[#C8A464]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="client-email"
                      className="block text-xs text-[#A19E95] mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="client-email"
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="alistair@domain.com"
                      className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#A19E95]/50 focus:outline-none focus:border-[#C8A464]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="client-phone"
                      className="block text-xs text-[#A19E95] mb-2"
                    >
                      Telephone *
                    </label>
                    <input
                      id="client-phone"
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+44 20 7946 0192"
                      className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#A19E95]/50 focus:outline-none focus:border-[#C8A464]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="commission-ref"
                      className="block text-xs text-[#A19E95] mb-2"
                    >
                      Silhouette or Cloth Interest (Optional)
                    </label>
                    <select
                      id="commission-ref"
                      value={commissionReference}
                      onChange={(e) => setCommissionReference(e.target.value)}
                      className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-4 py-3 text-sm text-[#F4F1EA] focus:outline-none focus:border-[#C8A464] cursor-pointer"
                    >
                      <option value="">Open Cloth Consultation</option>
                      {SUIT_PORTFOLIO.map((suit) => (
                        <option key={suit.id} value={suit.name}>
                          {suit.name} ({suit.mill})
                        </option>
                      ))}
                      {commissionReference &&
                        !SUIT_PORTFOLIO.some((s) => s.name === commissionReference) && (
                          <option value={commissionReference}>
                            {commissionReference}
                          </option>
                        )}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="fitting-notes"
                    className="block text-xs text-[#A19E95] mb-2"
                  >
                    Occasion, Timeline or Measurement Notes
                  </label>
                  <textarea
                    id="fitting-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share target travel or ceremony dates, cloth preferences, or existing pattern notes..."
                    className="w-full bg-[#111114] border border-[#F4F1EA]/15 px-4 py-3 text-sm text-[#F4F1EA] placeholder:text-[#A19E95]/50 focus:outline-none focus:border-[#C8A464]"
                  />
                </div>
              </div>
            </div>

            {/* Right Sticky Reservation Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-[#111114] border border-[#F4F1EA]/12 p-7 space-y-6">
              <div>
                <p className="text-xs text-[#C8A464]">Reservation Dossier</p>
                <h3 className="font-serif text-2xl text-[#F4F1EA] mt-1">
                  Fitting Summary
                </h3>
              </div>

              <div className="space-y-4 py-5 border-y border-[#F4F1EA]/10 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C8A464] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#F4F1EA] font-medium">{selectedService.name}</p>
                    <p className="text-xs text-[#A19E95] tabular-nums">
                      {selectedService.durationMinutes} minutes · {selectedService.feeLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C8A464] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#F4F1EA] font-medium">{selectedLocation.city}</p>
                    <p className="text-xs text-[#A19E95]">{selectedLocation.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-[#C8A464] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#F4F1EA] font-medium">{selectedCutter.name}</p>
                    <p className="text-xs text-[#A19E95]">{selectedCutter.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-[#C8A464] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[#F4F1EA] font-medium tabular-nums">
                      {selectedDateObj?.fullLabel ?? selectedDateIso}
                    </p>
                    <p className="text-xs text-[#C8A464] tabular-nums">
                      {selectedTimeSlot
                        ? `Appointment at ${selectedTimeSlot}`
                        : 'Select an available time slot'}
                    </p>
                  </div>
                </div>

                {commissionReference && (
                  <div className="pt-3 border-t border-[#F4F1EA]/10 text-xs">
                    <p className="text-[#A19E95]">Prepared Reference</p>
                    <p className="text-[#F4F1EA] mt-0.5">{commissionReference}</p>
                  </div>
                )}
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3.5 bg-[#3A1619] border border-[#E11D48]/50 text-xs text-[#F4F1EA]"
                >
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 text-sm font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
              >
                Confirm Appointment
              </button>

              <p className="text-xs text-[#A19E95] leading-relaxed">
                No deposit is charged to reserve a consultation. You may reschedule or
                cancel directly in My Appointments.
              </p>
            </aside>
          </form>
        )
      ) : (
        /* Manage Appointments Tab */
        <div className="mt-10 space-y-6">
          {appointments.length === 0 ? (
            <div className="p-12 bg-[#111114] border border-[#F4F1EA]/10 text-center space-y-4">
              <p className="font-serif text-2xl text-[#F4F1EA]">
                No Private Fittings Scheduled
              </p>
              <p className="text-sm text-[#A19E95]">
                Reserve a consultation with our London or Milan cutters to begin your
                bespoke pattern.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className="px-6 py-3 text-xs font-medium bg-[#C8A464] text-[#09090B] hover:bg-[#D7B67A] transition-colors cursor-pointer"
              >
                Schedule New Fitting
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => {
                const service = FITTING_SERVICES.find((s) => s.id === appt.serviceId);
                const location = ATELIER_LOCATIONS.find(
                  (l) => l.id === appt.locationId
                );
                const cutter = MASTER_CUTTERS.find((c) => c.id === appt.cutterId);
                const isCancelled = appt.status === 'Cancelled';
                const isRescheduling = reschedulingId === appt.id;

                return (
                  <div
                    key={appt.id}
                    className={`p-6 md:p-7 border transition-colors ${
                      isCancelled
                        ? 'bg-[#0C0C0E] border-[#F4F1EA]/5 opacity-70'
                        : 'bg-[#111114] border-[#F4F1EA]/12'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono text-[#C8A464] tabular-nums">
                            {appt.referenceCode}
                          </span>
                          <span aria-hidden="true" className="text-[#A19E95]">
                            ·
                          </span>
                          <span
                            className={
                              isCancelled ? 'text-[#A19E95]' : 'text-[#F4F1EA]'
                            }
                          >
                            Status: {appt.status}
                          </span>
                          <span aria-hidden="true" className="text-[#A19E95]">
                            ·
                          </span>
                          <span className="text-[#A19E95] tabular-nums">
                            {appt.dateIso} at {appt.timeSlot}
                          </span>
                        </div>

                        <h3 className="font-serif text-2xl text-[#F4F1EA]">
                          {service?.name ?? 'Private Fitting'} — {appt.clientName}
                        </h3>

                        <p className="text-xs text-[#A19E95]">
                          {location?.city} ({location?.address}) · Cutter:{' '}
                          {cutter?.name}
                          {appt.commissionReference
                            ? ` · Reference: ${appt.commissionReference}`
                            : ''}
                        </p>
                      </div>

                      {!isCancelled && (
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => downloadAppointmentIcs(appt)}
                            className="px-4 py-2 text-xs border border-[#F4F1EA]/15 text-[#F4F1EA] hover:border-[#C8A464] hover:text-[#C8A464] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Export .ics
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isRescheduling) {
                                setReschedulingId(null);
                              } else {
                                setReschedulingId(appt.id);
                                setRescheduleDateIso(appt.dateIso);
                                setRescheduleTimeSlot('');
                              }
                            }}
                            className="px-4 py-2 text-xs border border-[#F4F1EA]/15 text-[#F4F1EA] hover:border-[#C8A464] hover:text-[#C8A464] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {isRescheduling ? 'Close' : 'Reschedule'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onCancelAppointment(appt.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs border border-[#F4F1EA]/15 text-[#A19E95] hover:border-[#E11D48]/60 hover:text-[#F4F1EA] transition-colors whitespace-nowrap cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inline Reschedule Panel */}
                    {isRescheduling && !isCancelled && (
                      <div className="mt-6 pt-6 border-t border-[#F4F1EA]/10 space-y-4">
                        <p className="text-xs text-[#C8A464]">
                          Select a new date &amp; time slot with {cutter?.name}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {upcomingDates.slice(0, 6).map((d) => (
                            <button
                              key={d.iso}
                              type="button"
                              onClick={() => {
                                setRescheduleDateIso(d.iso);
                                setRescheduleTimeSlot('');
                              }}
                              className={`px-3 py-2 text-xs border transition-colors cursor-pointer tabular-nums ${
                                rescheduleDateIso === d.iso
                                  ? 'bg-[#C8A464] text-[#09090B] border-[#C8A464]'
                                  : 'bg-[#09090B] text-[#F4F1EA] border-[#F4F1EA]/15'
                              }`}
                            >
                              {d.weekdayShort} {d.dayNum} {d.monthShort}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          {TIME_SLOTS.map((slot) => {
                            const taken = isSlotTaken(
                              appointments,
                              appt.cutterId,
                              rescheduleDateIso,
                              slot,
                              appt.id
                            );
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled={taken}
                                onClick={() => setRescheduleTimeSlot(slot)}
                                className={`px-3.5 py-2 text-xs font-mono border tabular-nums ${
                                  taken
                                    ? 'opacity-40 cursor-not-allowed border-[#F4F1EA]/10 text-[#A19E95]'
                                    : rescheduleTimeSlot === slot
                                      ? 'border-[#C8A464] text-[#C8A464] bg-[#18181D] cursor-pointer'
                                      : 'border-[#F4F1EA]/15 text-[#F4F1EA] hover:border-[#C8A464]/50 cursor-pointer'
                                }`}
                              >
                                {slot} {taken ? '(Reserved)' : ''}
                              </button>
                            );
                          })}

                          <button
                            type="button"
                            disabled={!rescheduleTimeSlot}
                            onClick={() => {
                              if (!rescheduleTimeSlot) return;
                              onRescheduleAppointment(
                                appt.id,
                                rescheduleDateIso,
                                rescheduleTimeSlot
                              );
                              setReschedulingId(null);
                            }}
                            className="ml-auto px-5 py-2 text-xs font-medium bg-[#C8A464] text-[#09090B] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                          >
                            Save New Time
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
