import React from 'react';
import Link from 'next/link';
import { X, Plus, ExternalLink } from 'lucide-react';
import { NAV_ITEMS, NavId } from './types';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: NavId;
  onSelectNav: (id: NavId) => void;
  courtStatusFilter: string;
  onSelectCourtFilter: (filter: string) => void;
  totalCourts: number;
  availableCourts: number;
  inPlayCourts: number;
  reservedCourts: number;
  maintenanceCourts: number;
  totalBookingsCount: number;
  occupancyPercent: number;
  onOpenNewBookingModal: () => void;
}

export function AdminSidebar({
  isOpen,
  onClose,
  activeNav,
  onSelectNav,
  courtStatusFilter,
  onSelectCourtFilter,
  totalCourts,
  availableCourts,
  inPlayCourts,
  reservedCourts,
  maintenanceCourts,
  totalBookingsCount,
  occupancyPercent,
  onOpenNewBookingModal,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#202124]/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Left Sidebar (Google Workspace / Material Design 3 Style) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-white border-r border-[#dadce0] transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center px-5 border-b border-[#f1f3f4] gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b57d0] text-white shadow-sm">
            <span className="text-base font-semibold tracking-tight">P</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-medium text-[#1f1f1f] tracking-tight">PickleSync</span>
              <span className="text-[11px] font-medium bg-[#e8f0fe] text-[#0b57d0] px-1.5 py-0.2 rounded-md">Admin</span>
            </div>
            <span className="text-[11px] text-[#747775]">Club Operations</span>
          </div>
          <button
            type="button"
            className="ml-auto p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Button: Google FAB style */}
        <div className="p-4">
          <button
            type="button"
            onClick={onOpenNewBookingModal}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-[#c2e7ff] text-[#001d35] hover:bg-[#b5defc] transition-all shadow-[0_1px_3px_0_rgba(60,64,67,0.3)] hover:shadow-[0_2px_6px_2px_rgba(60,64,67,0.15)] font-medium text-sm cursor-pointer"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span>New Reservation</span>
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeNav === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectNav(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                    : 'text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f]'
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-[#001d35]' : 'text-[#444746]'}`} />
                <span className="truncate">{label}</span>
                {id === 'Bookings' && totalBookingsCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs rounded-full font-medium ${
                      isActive ? 'bg-[#001d35] text-white' : 'bg-[#e8f0fe] text-[#0b57d0]'
                    }`}
                  >
                    {totalBookingsCount}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Filter Section */}
          <div className="pt-4 mt-3 border-t border-[#f1f3f4]">
            <p className="px-4 text-[11px] font-semibold uppercase tracking-wider text-[#747775] mb-1.5">
              Court Filters
            </p>
            <div className="space-y-0.5">
              {[
                { id: 'all', label: 'All Courts', count: totalCourts },
                { id: 'available', label: 'Available', count: availableCourts, dot: 'bg-[#1e8e3e]' },
                { id: 'in_play', label: 'In Play', count: inPlayCourts, dot: 'bg-[#ea8600]' },
                { id: 'maintenance', label: 'Maintenance', count: maintenanceCourts, dot: 'bg-[#d93025]' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onSelectCourtFilter(f.id)}
                  className={`w-full flex items-center justify-between px-4 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    courtStatusFilter === f.id
                      ? 'bg-[#e8f0fe] text-[#0b57d0] font-semibold'
                      : 'text-[#5f6368] hover:bg-[#f8fafd] hover:text-[#1f1f1f]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {f.dot && <span className={`h-2 w-2 rounded-full ${f.dot}`} />}
                    <span>{f.label}</span>
                  </div>
                  <span className="text-[11px] text-[#747775]">{f.count}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer: Resource Meter & Links */}
        <div className="p-3 border-t border-[#f1f3f4] space-y-2">
          {/* Active occupancy meter */}
          <div className="bg-[#f8fafd] rounded-xl p-3 border border-[#eef0f4]">
            <div className="flex items-center justify-between text-xs text-[#444746] mb-1.5">
              <span className="font-medium">Court Capacity</span>
              <span className="font-semibold text-[#1f1f1f]">
                {inPlayCourts + reservedCourts}/{totalCourts} Active
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#e0e2ec] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0b57d0] rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-full text-xs font-medium text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Return to Public Site</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
