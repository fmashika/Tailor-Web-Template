export type PageRoute = 'atelier' | 'portfolio' | 'shop' | 'craft' | 'appointments';

export type ShopCategory =
  | 'All'
  | 'Ready-to-Wear Suits'
  | 'Outerwear'
  | 'Shirting'
  | 'Silk & Neckwear'
  | 'Leather & Travel';

export interface ShopProduct {
  id: string;
  sku: string;
  name: string;
  category: Exclude<ShopCategory, 'All'>;
  priceGbp: number;
  image: string;
  material: string;
  origin: string;
  leadTime: string;
  description: string;
  variants: string[];
  variantLabel: string;
  details: string[];
}

export interface CartItem {
  productId: string;
  variant: string;
  quantity: number;
}

export interface ShopOrder {
  orderNumber: string;
  items: {
    productId: string;
    name: string;
    variant: string;
    quantity: number;
    unitPriceGbp: number;
  }[];
  subtotalGbp: number;
  shippingGbp: number;
  totalGbp: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: 'Card Dispatch' | 'Cash on Delivery';
  createdAtIso: string;
}

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

export type ClothMaterialFilter =
  | 'All'
  | 'Pure Wool'
  | 'Wool & Cashmere'
  | 'Wool & Mohair'
  | 'Wool & Silk'
  | 'Linen & Silk';

export type ClothSeasonFilter =
  | 'All'
  | 'Year-Round'
  | 'Autumn / Winter'
  | 'Spring / Summer'
  | 'Formal & Evening';

export type ClothWeightFilter =
  | 'All'
  | 'Light'
  | 'Mid'
  | 'Heavy';

export interface ClothSwatch {
  id: string;
  name: string;
  mill: string;
  origin: string;
  composition: string;
  materialCategory: Exclude<ClothMaterialFilter, 'All'>;
  weightGsm: number;
  season: string;
  seasonCategory: Exclude<ClothSeasonFilter, 'All'>;
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
