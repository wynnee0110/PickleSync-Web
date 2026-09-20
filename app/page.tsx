'use client';

import React, { useState } from 'react';
import { COURTS_DATA, OPEN_MATCHES_DATA } from '../data/courts';
import { Court, TimeSlot, BookingReservation } from '../types/booking';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { CourtScheduleSection } from '../components/CourtScheduleSection';
import { BookingModal } from '../components/BookingModal';
import { OpenPlaySection } from '../components/OpenPlaySection';
import { MembershipSection } from '../components/MembershipSection';
import { MyBookingsDrawer } from '../components/MyBookingsDrawer';
import { Footer } from '../components/Footer';
import { Check } from 'lucide-react';

export default function Home() {
  // Hero Filter State
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('all');

  // Currently Selected Court (from the 8 courts)
  const [selectedCourt, setSelectedCourt] = useState<Court>(COURTS_DATA[0]);

  // Booking Modal State
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('Sep 9, 2025');
  const [bookingSlotTimes, setBookingSlotTimes] = useState<string[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [myBookingsDrawerOpen, setMyBookingsDrawerOpen] = useState(false);

  // Active User Reservations (Preloaded with 1 sample pass for immediate value)
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

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Slot Selection Handler (Opens Booking Modal for Selected Court and Slot)
  const handleSelectSlot = (court: Court, slot?: TimeSlot, date?: string, slotTimes?: string[]) => {
    setSelectedCourt(court);
    setSelectedSlot(slot || null);
    if (date) setBookingDate(date);
    if (slotTimes && slotTimes.length > 0) {
      setBookingSlotTimes(slotTimes);
    } else if (slot?.time) {
      setBookingSlotTimes([slot.time]);
    } else {
      setBookingSlotTimes([]);
    }
    setBookingModalOpen(true);
  };

  // Booking Confirmation Handler
  const handleConfirmBooking = (reservation: BookingReservation) => {
    setBookings((prev) => [reservation, ...prev]);
    showToast(`Pass minted for ${reservation.courtName} at ${reservation.timeSlot}!`);
  };

  // Cancel Booking Handler
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== bookingId));
    showToast('Reservation cancelled and refund processed.');
  };

  // Smooth scroll helper
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#bef264] selection:text-black">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-white px-5 py-3.5 shadow-2xl text-slate-900">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        bookingCount={bookings.length}
        onOpenMyBookings={() => setMyBookingsDrawerOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedTimeWindow={selectedTimeWindow}
          onTimeWindowChange={setSelectedTimeWindow}
          onBookNowClick={() => handleScrollToSection('court-schedule')}
        />

        {/* 2-Box Layout: Court Selector (8 Courts) & Schedule Calendar */}
        <CourtScheduleSection
          courts={COURTS_DATA}
          selectedCourt={selectedCourt}
          onSelectCourt={setSelectedCourt}
          onSelectSlot={handleSelectSlot}
        />

        {/* DUPR Open Play & Leagues */}
        <OpenPlaySection matches={OPEN_MATCHES_DATA} />

        {/* Club Memberships & Passes */}
        <MembershipSection />
      </main>

      {/* Booking Checkout Modal */}
      <BookingModal
        key={`${selectedCourt.id}-${selectedSlot?.id || 'default'}-${bookingDate}-${bookingSlotTimes.join('-')}`}
        court={selectedCourt}
        initialSlot={selectedSlot}
        date={bookingDate}
        slotTimes={bookingSlotTimes}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onConfirmBooking={handleConfirmBooking}
      />

      {/* Active Passes Drawer */}
      <MyBookingsDrawer
        isOpen={myBookingsDrawerOpen}
        onClose={() => setMyBookingsDrawerOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onBookCourtClick={() => handleScrollToSection('court-schedule')}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
