import { ATELIER_LOCATIONS, FITTING_SERVICES, MASTER_CUTTERS } from '../data/tailorData';
import { Appointment } from '../types/tailor';

const STORAGE_KEY = 'marlowe_bespoke_appointments_v1';

export interface BookableDate {
  iso: string;
  weekdayShort: string;
  dayNum: string;
  monthShort: string;
  fullLabel: string;
}

/**
 * Generates the next 14 open atelier days (skipping Sundays) starting from tomorrow.
 */
export function getUpcomingAtelierDates(count = 14): BookableDate[] {
  const dates: BookableDate[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (dates.length < count) {
    if (cursor.getDay() !== 0) {
      const iso = cursor.toISOString().slice(0, 10);
      dates.push({
        iso,
        weekdayShort: cursor.toLocaleDateString('en-GB', { weekday: 'short' }),
        dayNum: cursor.toLocaleDateString('en-GB', { day: '2-digit' }),
        monthShort: cursor.toLocaleDateString('en-GB', { month: 'short' }),
        fullLabel: cursor.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/**
 * Deterministic background reservations so the live slot calendar reflects realistic availability.
 */
export function isAtelierSlotPreReserved(
  cutterId: string,
  dateIso: string,
  timeSlot: string
): boolean {
  const hashInput = `${cutterId}:${dateIso}:${timeSlot}`;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    hash = (hash * 31 + hashInput.charCodeAt(i)) % 997;
  }
  // Reserve roughly ~28% of slots deterministically so availability feels realistic without blocking a full day
  return hash % 7 === 0 || hash % 11 === 0;
}

export function loadAppointments(): Appointment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial seed below
  }

  const upcoming = getUpcomingAtelierDates(6);
  const initialSeed: Appointment[] = [
    {
      id: 'appt-seed-1',
      referenceCode: 'MB-26-4108',
      serviceId: 'basted-fitting',
      locationId: 'london-savile',
      cutterId: 'julian-marlowe',
      dateIso: upcoming[2]?.iso ?? '2026-11-26',
      timeSlot: '14:00',
      clientName: 'Arthur Pendelton',
      clientEmail: 'arthur.pendelton@example.com',
      clientPhone: '+44 20 7946 0821',
      commissionReference: 'The Savile Charcoal 6x2',
      notes: 'Second basted sleeve pitch adjustment before Milan travel.',
      status: 'Confirmed',
      createdAtIso: new Date().toISOString(),
    },
  ];
  saveAppointments(initialSeed);
  return initialSeed;
}

export function saveAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // Ignore storage quota errors in restricted sandboxes
  }
}

export function generateReferenceCode(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `MB-26-${num}`;
}

export function isSlotTaken(
  appointments: Appointment[],
  cutterId: string,
  dateIso: string,
  timeSlot: string,
  excludeAppointmentId?: string
): boolean {
  const userTaken = appointments.some(
    (appt) =>
      appt.id !== excludeAppointmentId &&
      appt.status !== 'Cancelled' &&
      appt.cutterId === cutterId &&
      appt.dateIso === dateIso &&
      appt.timeSlot === timeSlot
  );
  if (userTaken) return true;
  return isAtelierSlotPreReserved(cutterId, dateIso, timeSlot);
}

export function downloadAppointmentIcs(appt: Appointment): void {
  const service = FITTING_SERVICES.find((s) => s.id === appt.serviceId);
  const location = ATELIER_LOCATIONS.find((l) => l.id === appt.locationId);
  const cutter = MASTER_CUTTERS.find((c) => c.id === appt.cutterId);

  const [hours, minutes] = appt.timeSlot.split(':').map(Number);
  const [year, month, day] = appt.dateIso.split('-').map(Number);
  const start = new Date(year, month - 1, day, hours, minutes, 0);
  const durationMins = service?.durationMinutes ?? 60;
  const end = new Date(start.getTime() + durationMins * 60000);

  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z$/, 'Z');

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Marlowe Bespoke//Appointment Atelier//EN',
    'BEGIN:VEVENT',
    `UID:${appt.referenceCode}@marlowebespoke.com`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Marlowe Bespoke — ${service?.name ?? 'Private Fitting'}`,
    `LOCATION:${location ? `${location.city} — ${location.address}` : '14 Savile Row, London'}`,
    `DESCRIPTION:Reference ${appt.referenceCode} with ${cutter?.name ?? 'Master Cutter'}. ${appt.commissionReference ? `Commission: ${appt.commissionReference}.` : ''}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsLines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${appt.referenceCode}-marlowe-fitting.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
