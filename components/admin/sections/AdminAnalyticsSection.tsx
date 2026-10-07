import React from 'react';
import { TrendingUp } from 'lucide-react';
import { WeeklyRevenueItem } from '../types';

interface AdminAnalyticsSectionProps {
  weeklyRevenue: WeeklyRevenueItem[];
  totalCourts: number;
  availableCourts: number;
  inPlayCourts: number;
  reservedCourts: number;
  maintenanceCourts: number;
  onQuickReserve: () => void;
}

export function AdminAnalyticsSection({
  weeklyRevenue,
  totalCourts,
  availableCourts,
  inPlayCourts,
  reservedCourts,
  maintenanceCourts,
  onQuickReserve,
}: AdminAnalyticsSectionProps) {
  const maxRevenueBar = Math.max(...weeklyRevenue.map((d) => d.value));

  return (
    <section aria-label="Analytics & Resource Overview" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Revenue Analytics (Google Analytics Style Bar Chart) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dadce0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#1f1f1f]">Weekly Revenue Overview</h2>
            <p className="text-xs text-[#5f6368] mt-0.5">Court bookings and facility passes for last 7 days</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#137333] bg-[#e6f4ea] px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" />
            +22% vs previous period
          </div>
        </div>

        {/* Minimal Clean Bars */}
        <div className="pt-4 pb-2 border-b border-[#f1f3f4]">
          <div className="flex items-end gap-3 sm:gap-6 h-44">
            {weeklyRevenue.map((d) => {
              const heightPercent = Math.round((d.value / maxRevenueBar) * 100);
              const isSunday = d.day === 'Sun';
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    {/* Hover Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#202124] text-white text-[11px] font-medium py-1 px-2 rounded-md shadow-md pointer-events-none whitespace-nowrap z-10">
                      ₱{d.value.toLocaleString()}
                    </div>
                    <div
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-300 ${
                        isSunday
                          ? 'bg-[#0b57d0] hover:bg-[#0842a0]'
                          : 'bg-[#d3e3fd] hover:bg-[#a8c7fa]'
                      }`}
                      style={{ height: `${heightPercent}%`, minHeight: '6px' }}
                    />
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isSunday ? 'text-[#0b57d0] font-semibold' : 'text-[#747775]'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Baseline legend */}
        <div className="flex items-center justify-between text-[11px] text-[#747775] pt-3">
          <span>Baseline: ₱0</span>
          <span>Peak day: Sat (₱9,400)</span>
          <span>Total 7-day revenue: ₱39,550</span>
        </div>
      </div>

      {/* Court Utilization Breakdown (Google Cloud Resource Monitor Style) */}
      <div className="bg-white rounded-2xl border border-[#dadce0] p-5 sm:p-6 shadow-[0_1px_2px_rgba(60,64,67,0.06)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1f1f1f]">Court Utilization</h2>
            <span className="text-xs text-[#5f6368] font-medium">{totalCourts} Total Courts</span>
          </div>

          {/* Minimal Segmented Progress Bar */}
          <div className="space-y-3">
            <div className="h-3 w-full bg-[#f1f3f4] rounded-full overflow-hidden flex">
              <div
                title={`Available: ${availableCourts}`}
                style={{ width: `${(availableCourts / totalCourts) * 100}%` }}
                className="h-full bg-[#1e8e3e]"
              />
              <div
                title={`In Play: ${inPlayCourts}`}
                style={{ width: `${(inPlayCourts / totalCourts) * 100}%` }}
                className="h-full bg-[#ea8600]"
              />
              <div
                title={`Reserved: ${reservedCourts}`}
                style={{ width: `${(reservedCourts / totalCourts) * 100}%` }}
                className="h-full bg-[#1a73e8]"
              />
              <div
                title={`Maintenance: ${maintenanceCourts}`}
                style={{ width: `${(maintenanceCourts / totalCourts) * 100}%` }}
                className="h-full bg-[#d93025]"
              />
            </div>

            {/* Clean Legend list */}
            <div className="space-y-2 pt-2">
              {[
                { label: 'Available', count: availableCourts, color: 'bg-[#1e8e3e]', text: 'Ready for booking' },
                { label: 'In Play', count: inPlayCourts, color: 'bg-[#ea8600]', text: 'Match in progress' },
                { label: 'Reserved', count: reservedCourts, color: 'bg-[#1a73e8]', text: 'Scheduled later today' },
                { label: 'Maintenance', count: maintenanceCourts, color: 'bg-[#d93025]', text: 'Inspection or cleaning' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-[#f8fafd]">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <div>
                      <span className="text-xs font-medium text-[#1f1f1f]">{item.label}</span>
                      <span className="text-[10px] text-[#747775] ml-2 hidden sm:inline">{item.text}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#1f1f1f]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#f1f3f4]">
          <button
            type="button"
            onClick={onQuickReserve}
            className="w-full text-center py-2 rounded-full border border-[#dadce0] text-xs font-medium text-[#0b57d0] hover:bg-[#e8f0fe] transition-colors cursor-pointer"
          >
            Quick Reserve Court Slot
          </button>
        </div>
      </div>
    </section>
  );
}
