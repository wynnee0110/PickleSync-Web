'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { COURTS_DATA } from '@/lib/courts';
import { Court, TimeSlot, BookingReservation } from '@/types/booking';
import { formatCurrentDate } from '@/lib/courtAvailability';
import { CourtScheduleSection } from '@/components/sections/CourtScheduleSection';
import { BookingModal } from '@/components/ui/BookingModal';
import { useBooking } from '@/components/providers/BookingProvider';
import { ArrowLeft, Sparkles, Shield, Clock } from 'lucide-react';

export function BookCourtClient() {
  const searchParams = useSearchParams();
  const courtParam = searchParams.get('court');
  const { addBooking, showToast } = useBooking();

  // Find court from query or default to court-1
  const initialCourt = COURTS_DATA.find((c) => c.id === courtParam) || COURTS_DATA[0];
  const [selectedCourt, setSelectedCourt] = useState<Court>(initialCourt);
  const [prevCourtParam, setPrevCourtParam] = useState(courtParam);

  // Sync if query param changes
  if (courtParam !== prevCourtParam) {
    setPrevCourtParam(courtParam);
    const match = COURTS_DATA.find((c) => c.id === courtParam);
    if (match) {
      setSelectedCourt(match);
    }
  }

  // Booking Modal State
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(() => formatCurrentDate());
  const [bookingSlotTimes, setBookingSlotTimes] = useState<string[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Slot Selection Handler
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
    addBooking(reservation);
    showToast(`Pass minted for ${reservation.courtName} at ${reservation.timeSlot}!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">

      {/* Header Banner */}
      <div className="border-b border-slate-200/80 bg-white px-4 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-900">Book a Court</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#bef264] bg-[#f7fee7] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#3f6212] mb-2">
                <Sparkles className="h-3 w-3" />
                Live Court Availability
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                Book a Court
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
                Check real-time availability on the calendar and reserve your time slot instantly with smart gate access.
              </p>
            </div>

            {/* Quick Feature Badges */}
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
                <Clock className="h-4 w-4 text-[#4d7c0f]" />
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Keyless Gate PIN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Box Court Selector, Calendar & Schedule Section */}
      <div className="pt-4">
        <CourtScheduleSection
          courts={COURTS_DATA}
          selectedCourt={selectedCourt}
          onSelectCourt={setSelectedCourt}
          onSelectSlot={handleSelectSlot}
        />
      </div>

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

    </div>
  );
}
