'use client';

import React from 'react';
import { BookingReservation } from '@/types/booking';
import { X, Trash2, Ticket } from 'lucide-react';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingReservation[];
  onCancelBooking: (bookingId: string) => void;
  onBookCourtClick: () => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onBookCourtClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-slate-200 bg-white text-slate-900 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <Ticket className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">My Active Passes</h3>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                {bookings.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {bookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl mb-4">
                  🎟️
                </div>
                <h4 className="text-base font-bold text-slate-900">No active reservations yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Pick a court from the schedule and lock in your game time. Your digital gate pass will appear here.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onBookCourtClick();
                  }}
                  className="mt-6 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-sm"
                >
                  Explore Available Courts
                </button>
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm space-y-3"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-black text-white">
                        #{b.courtNumber}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{b.courtName}</span>
                    </div>
                    <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                      {b.accessPassCode}
                    </span>
                  </div>

                  {/* Booking Time & Duration */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-500">Date & Slot:</span>
                      <div className="font-semibold text-slate-900 mt-0.5">{b.date} • {b.timeSlot}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Duration:</span>
                      <div className="font-semibold text-slate-900 mt-0.5">{b.durationMinutes} Min</div>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Gate Turnstile Pin:</span>
                      <span className="font-mono font-bold text-[#4d7c0f]">*4829#</span>
                    </div>
                  </div>

                  {/* Add-ons list if any */}
                  {b.addOns.length > 0 && (
                    <div className="text-[11px] text-slate-600">
                      <span className="text-slate-500 font-medium">Reserved Equipment: </span>
                      {b.addOns.map((a) => `${a.name} (x${a.quantity})`).join(', ')}
                    </div>
                  )}

                  {/* Players */}
                  <div className="text-[11px] text-slate-500">
                    Players: <span className="text-slate-800 font-medium">{b.playerNames.join(', ')}</span>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500">Total: </span>
                      <span className="font-bold text-slate-900">₱{b.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCancelBooking(b.bookingId)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 transition-colors p-1"
                        title="Cancel Booking"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
