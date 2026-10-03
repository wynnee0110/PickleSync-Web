'use client';

import React from 'react';
import Link from 'next/link';
import { useBooking } from '@/components/providers/BookingProvider';
import { CalendarCheck, Trash2, Ticket, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

export function BookingsClient() {
  const { bookings, cancelBooking, showToast } = useBooking();

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    showToast('Reservation cancelled and refund processed.');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-medium text-slate-900">My Bookings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
              <CalendarCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Bookings</h1>
              <p className="text-sm text-slate-500">{bookings.length} active reservation{bookings.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings list */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
              <Ticket className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-lg font-semibold text-slate-700 mb-1">No active bookings</p>
            <p className="text-sm text-slate-400 mb-6">Book a court to see your reservations here</p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
            >
              Book a court <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{booking.bookingId}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        Confirmed
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">{booking.courtName}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" /> {booking.venue}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-black text-slate-900">${booking.totalPrice.toFixed(2)}</p>
                    {booking.splitPayment && (
                      <p className="text-xs text-slate-400">Split payment</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{booking.date} · {booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>{booking.playerNames.length} player{booking.playerNames.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Ticket className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono">{booking.accessPassCode}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancel(booking.bookingId)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Cancel booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
