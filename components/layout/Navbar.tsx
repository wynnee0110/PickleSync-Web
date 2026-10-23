'use client';

import React from 'react';
import { PickleMascot } from '@/components/ui/PickleMascot';
import { CalendarCheck, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  bookingCount: number;
  onOpenMyBookings: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  bookingCount,
  onOpenMyBookings,
  onScrollToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Brand Logo with Pickle Mascot */}
        <div 
          onClick={() => onScrollToSection('hero')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <PickleMascot size={34} className="transition-transform group-hover:scale-105" />
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
            PickleSync
          </span>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link
            href="/book"
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            Book Court
          </Link>
          <button
            onClick={() => onScrollToSection('memberships')}
            className="text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Memberships
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-950 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            Admin
          </Link>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Passes Indicator */}
          {bookingCount > 0 && (
            <button
              onClick={onOpenMyBookings}
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="View your active reservations"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>{bookingCount} <span className="hidden sm:inline">Pass{bookingCount > 1 ? 'es' : ''}</span></span>
            </button>
          )}

          {/* Sign In */}
          <button
            onClick={onOpenMyBookings}
            className="hidden sm:inline-block text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Sign In
          </button>

          {/* JOIN CLUB Button */}
          <button
            onClick={() => onScrollToSection('memberships')}
            className="rounded-xl bg-[#2563eb] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1d4ed8] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            JOIN CLUB
          </button>
        </div>
      </div>
    </header>
  );
};
