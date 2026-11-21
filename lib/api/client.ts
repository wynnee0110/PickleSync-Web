import { Court, BookingReservation } from '@/types/booking';
import { COURTS_DATA } from '@/lib/courts';

const API_BASE = '/api/v1';

export async function fetchCourtsFromAPI(): Promise<Court[]> {
  try {
    const res = await fetch(`${API_BASE}/courts`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data;
  } catch {
    // Graceful fallback to static courts data if API backend is offline
    return COURTS_DATA.slice(0, 2);
  }
}

export async function fetchCourtAvailabilityFromAPI(
  courtNumber: number,
  dateStr: string
): Promise<{
  openSlotsCount: number;
  isFullyBooked: boolean;
  isBeyondAdvanceLimit: boolean;
  occupiedSlotTimes: string[];
  availableSlotTimes: string[];
} | null> {
  try {
    const url = `${API_BASE}/courts/availability?courtNumber=${courtNumber}&date=${encodeURIComponent(dateStr)}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function createBookingAPI(data: {
  courtId: string;
  courtNumber: number;
  courtName: string;
  venue?: string;
  date: string;
  timeSlots: string[];
  durationMinutes?: number;
  playerNames?: string[];
  totalPrice: number;
  paymentProvider?: string;
}): Promise<BookingReservation | null> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        durationMinutes: data.durationMinutes || data.timeSlots.length * 60,
        playerNames: data.playerNames || ['You (Host)'],
        paymentProvider: data.paymentProvider || 'card',
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Booking failed with status ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('FastAPI booking creation fallback:', err);
    return null;
  }
}

export async function fetchBookingsFromAPI(): Promise<BookingReservation[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.map((b: BookingReservation) => ({
      ...b,
      addOns: b.addOns || [],
    }));
  } catch {
    return [];
  }
}

export async function cancelBookingAPI(bookingId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${encodeURIComponent(bookingId)}/cancel`, {
      method: 'POST',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateCourtStatusAPI(courtId: string, status: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/admin/courts/${encodeURIComponent(courtId)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
