import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface AdminMetricsSectionProps {
  totalRevenueToday: number;
  totalBookingsCount: number;
  liveBookingsCount: number;
  occupancyPercent: number;
  availableCourts: number;
  totalCourts: number;
  activeMembersCount?: number;
  onlineMembersCount?: number;
}

export function AdminMetricsSection({
  totalRevenueToday,
  totalBookingsCount,
  liveBookingsCount,
  occupancyPercent,
  availableCourts,
  totalCourts,
  activeMembersCount = 284,
  onlineMembersCount = 4,
}: AdminMetricsSectionProps) {
  return (
    <section aria-label="Key Performance Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Revenue */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-[#444746]">Total Revenue Today</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
            <ArrowUpRight className="h-3 w-3" />
            +18.4%
          </span>
        </div>
        <div className="my-2">
          <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
            ₱{totalRevenueToday.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-[#747775]">
          <span>vs ₱8,900 yesterday</span>
          <span className="h-2 w-2 rounded-full bg-[#1e8e3e]" />
        </div>
      </div>

      {/* Card 2: Bookings */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-[#444746]">Active Bookings</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#0b57d0] bg-[#e8f0fe] px-2 py-0.5 rounded-full">
            <ArrowUpRight className="h-3 w-3" />
            +{liveBookingsCount + 3} today
          </span>
        </div>
        <div className="my-2">
          <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
            {totalBookingsCount}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-[#747775]">
          <span>{liveBookingsCount} live from this session</span>
          <span className="h-2 w-2 rounded-full bg-[#0b57d0]" />
        </div>
      </div>

      {/* Card 3: Occupancy */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-[#444746]">Court Occupancy</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#b06000] bg-[#fef7e0] px-2 py-0.5 rounded-full">
            <ArrowUpRight className="h-3 w-3" />
            +5% peak
          </span>
        </div>
        <div className="my-2">
          <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
            {occupancyPercent}%
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-[#747775]">
          <span>{availableCourts} of {totalCourts} courts free</span>
          <span className="h-2 w-2 rounded-full bg-[#ea8600]" />
        </div>
      </div>

      {/* Card 4: Members */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)] hover:shadow-[0_1px_3px_1px_rgba(60,64,67,0.12)] transition-shadow flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <span className="text-xs font-medium text-[#444746]">Active Members</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full">
            <ArrowUpRight className="h-3 w-3" />
            +12 this week
          </span>
        </div>
        <div className="my-2">
          <p className="text-2xl sm:text-3xl font-normal text-[#1f1f1f] tracking-tight">
            {activeMembersCount}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs text-[#747775]">
          <span>{onlineMembersCount} members online now</span>
          <span className="h-2 w-2 rounded-full bg-[#7c3aed]" />
        </div>
      </div>
    </section>
  );
}
