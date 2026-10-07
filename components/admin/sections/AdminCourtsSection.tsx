import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Court } from '@/types/booking';
import { CourtStatusBadge } from '../CourtStatusBadge';

interface AdminCourtsSectionProps {
  courts: Court[];
  statusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  onSelectCourtForStatus: (court: Court) => void;
}

export function AdminCourtsSection({
  courts,
  statusFilter,
  onSelectStatusFilter,
  onSelectCourtForStatus,
}: AdminCourtsSectionProps) {
  return (
    <section aria-label="Courts Overview" className="bg-white rounded-2xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1f1f1f]">Courts Overview</h2>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Click any court status chip to instantly change its live status
          </p>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'available', 'in_play', 'reserved', 'maintenance'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onSelectStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0b57d0] text-white font-semibold'
                  : 'bg-[#f1f3f4] text-[#444746] hover:bg-[#e0e2ec]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] font-medium">
            <tr>
              <th className="px-5 py-3">Court Name & Location</th>
              <th className="px-4 py-3">Surface & Specs</th>
              <th className="px-4 py-3">Status (Click to toggle)</th>
              <th className="px-4 py-3">Hourly Rate</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f3f4]">
            {courts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#747775]">
                  No courts matching current filter or search criteria.
                </td>
              </tr>
            ) : (
              courts.map((court) => (
                <tr key={court.id} className="hover:bg-[#f8fafd] transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/book?court=${court.id}`}
                      className="font-semibold text-[#1f1f1f] hover:text-[#0b57d0] transition-colors"
                    >
                      {court.name}
                    </Link>
                    <p className="text-[11px] text-[#747775] mt-0.5">{court.location}</p>
                  </td>
                  <td className="px-4 py-3.5 text-[#444746]">
                    <span className="capitalize">{court.type}</span> · {court.surface.split(' ')[0]}
                  </td>
                  <td className="px-4 py-3.5">
                    <CourtStatusBadge
                      status={court.status}
                      onClick={() => onSelectCourtForStatus(court)}
                    />
                  </td>
                  <td className="px-4 py-3.5 font-medium text-[#1f1f1f]">
                    ₱{court.pricePerHour}/hr
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/book?court=${court.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#0b57d0] hover:underline"
                    >
                      Book <ChevronRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
