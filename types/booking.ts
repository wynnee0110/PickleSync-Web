export type CourtType = 'indoor' | 'outdoor' | 'covered' | 'championship';

export interface TimeSlot {
  id: string;
  time: string;
  isPeak: boolean;
  price: number;
  status: 'available' | 'fast_filling' | 'booked';
}

export interface Court {
  id: string;
  name: string;
  courtNumber: number;
  venue: string;
  location: string;
  type: CourtType;
  surface: string;
  pricePerHour: number;
  peakPricePerHour: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  features: string[];
  status: 'available' | 'in_play' | 'reserved' | 'maintenance';
  currentMatch?: {
    players: string;
    gameScore?: string;
    endsAt?: string;
  };
  slots: TimeSlot[];
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'paddle' | 'balls' | 'equipment' | 'coaching';
}

export interface BookingReservation {
  bookingId: string;
  courtId: string;
  courtName: string;
  courtNumber: number;
  venue: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  addOns: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  playerNames: string[];
  splitPayment: boolean;
  totalPrice: number;
  createdAt: string;
  accessPassCode: string;
}

export interface OpenMatch {
  id: string;
  title: string;
  courtName: string;
  venue: string;
  date: string;
  time: string;
  duprRange: string;
  format: 'Doubles' | 'Singles' | 'King of Court' | 'Round Robin';
  hostName: string;
  hostAvatar: string;
  spotsTotal: number;
  spotsFilled: number;
  pricePerPlayer: number;
  players: {
    name: string;
    avatar: string;
    dupr: number;
  }[];
}

export interface FilterState {
  search: string;
  courtType: 'all' | CourtType;
  date: string;
  timeOfDay: 'all' | 'morning' | 'afternoon' | 'evening';
  surface: 'all' | string;
}
