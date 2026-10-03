'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { COURTS_DATA } from '@/lib/courts';
import { BookingReservation } from '@/types/booking';

interface BookingContextValue {
  bookings: BookingReservation[];
  addBooking: (reservation: BookingReservation) => void;
  cancelBooking: (bookingId: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  myBookingsDrawerOpen: boolean;
  setMyBookingsDrawerOpen: (open: boolean) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<BookingReservation[]>([
    {
      bookingId: 'BK-782194',
      courtId: COURTS_DATA[0].id,
      courtName: COURTS_DATA[0].name,
      courtNumber: COURTS_DATA[0].courtNumber,
      venue: COURTS_DATA[0].venue,
      date: 'Today',
      timeSlot: '07:00 PM',
      durationMinutes: 90,
      addOns: [
        { id: 'paddle-selkirk', name: 'Selkirk Vanguard Control Pro', price: 8, quantity: 2 },
        { id: 'balls-franklin', name: 'Franklin X-40 Performance Balls', price: 5, quantity: 1 },
      ],
      playerNames: ['You (Host)', 'Jordan Vance', 'Sam K.'],
      splitPayment: true,
      totalPrice: 200.0,
      createdAt: '11:20 AM',
      accessPassCode: 'SYNC-CRT1-9428',
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [myBookingsDrawerOpen, setMyBookingsDrawerOpen] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  }, []);

  const addBooking = useCallback((reservation: BookingReservation) => {
    setBookings((prev) => [reservation, ...prev]);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        toastMessage,
        showToast,
        myBookingsDrawerOpen,
        setMyBookingsDrawerOpen,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}
