export type PageRoute = 'atelier' | 'portfolio' | 'craft' | 'appointments';

export type SuitCategory =
  | 'All'
  | 'Double-Breasted'
  | 'Single-Breasted'
  | 'Black Tie'
  | 'Three-Piece';

export interface BespokeSuit {
  id: string;
  name: string;
  subtitle: string;
  category: Exclude<SuitCategory, 'All'>;
  image: string;
  aspect: '16:9' | '3:4';
  mill: string;
  cloth: string;
  weightGsm: number;
  tailoringHours: number;
  startingPriceGbp: number;
  silhouette: string;
  construction: string;
  details: string[];
  story: string;
  commissionYear: string;
}

export interface ClothSwatch {
  id: string;
  name: string;
  mill: string;
  origin: string;
  composition: string;
  weightGsm: number;
  season: string;
  swatchHex: string;
  weavePattern: 'herringbone' | 'chalkstripe' | 'barathea' | 'sharkskin' | 'flannel';
  notes: string;
}

export interface MasterCutter {
  id: string;
  name: string;
  title: string;
  atelier: string;
  experienceYears: number;
  specialty: string;
}

export interface FittingService {
  id: string;
  name: string;
  durationMinutes: number;
  feeLabel: string;
  summary: string;
}

export interface AtelierLocation {
  id: string;
  city: string;
  address: string;
  hours: string;
}

export interface Appointment {
  id: string;
  referenceCode: string;
  serviceId: string;
  locationId: string;
  cutterId: string;
  dateIso: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  commissionReference?: string;
  notes?: string;
  status: 'Confirmed' | 'Rescheduled' | 'Cancelled';
  createdAtIso: string;
}
