import React from 'react';
import { CombinedBookingItem, BookingFilterTab } from '../types';
import { BookingStatusBadge } from '../CourtStatusBadge';

interface AdminBookingsSectionProps {
  bookings: CombinedBookingItem[];
  filterTab: BookingFilterTab;
  onChangeFilterTab: (tab: BookingFilterTab) => void;
  onCancelBooking: (id: string) => void;
}

export function AdminBookingsSection({
  bookings,
  filterTab,
  onChangeFilterTab,
  onCancelBooking,
}: AdminBookingsSectionProps) {
  return (
    <section aria-label="Recent Bookings & Activity" className="bg-white rounded-2xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1f1f1f]">Recent Bookings & Activity</h2>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Real-time club reservations and player bookings
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'live', 'confirmed', 'pending'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onChangeFilterTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                filterTab === tab
                  ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                  : 'text-[#5f6368] hover:bg-[#f1f3f4]'
              }`}
            >
              {tab === 'live' ? 'Live Session' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[#f1f3f4]">
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#747775]">
            No bookings found for the selected criteria.
          </div>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="p-4 sm:px-5 flex items-center justify-between hover:bg-[#f8fafd] transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Avatar */}
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${b.color}`}
                >
                  {b.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-[#1f1f1f] truncate">{b.player}</p>
                    {b.isLive && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-semibold">
                        <span className="h-1 w-1 rounded-full bg-[#1e8e3e] animate-pulse" />
                        Active Session
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5f6368] mt-0.5 truncate">
                    {b.court} · {b.time}
                  </p>
                </div>
              </div>

              {/* Right side amount & action */}
              <div className="flex items-center gap-3 ml-3 text-right">
                <div>
                  <p className="text-xs font-semibold text-[#1f1f1f]">₱{b.amount}</p>
                  <BookingStatusBadge status={b.status} />
                </div>

                {b.isLive && (
                  <button
                    type="button"
                    onClick={() => onCancelBooking(b.id)}
                    className="px-2.5 py-1 text-xs text-[#c5221f] hover:bg-[#fce8e6] rounded-full font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
