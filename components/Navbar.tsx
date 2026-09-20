'use client';

import React, { useState } from 'react';
import { PickleMascot } from './PickleMascot';
import { Menu, X, CalendarCheck } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Pickle Mascot */}
        <div 
          onClick={() => onScrollToSection('hero')} 
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <PickleMascot size={36} className="transition-transform group-hover:scale-105" />
          <span className="text-2xl font-black tracking-tight text-slate-950">
            PickleSync
          </span>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <button
            onClick={() => onScrollToSection('court-schedule')}
            className="text-sm font-bold text-[#365314] hover:text-[#4d7c0f] transition-colors cursor-pointer"
          >
            Book Court
          </button>
          <button
            onClick={() => onScrollToSection('open-play')}
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Leagues & Play
          </button>
          <button
            onClick={() => onScrollToSection('memberships')}
            className="text-sm font-medium text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Memberships
          </button>
        </nav>

        {/* Right CTA Area */}
        <div className="flex items-center gap-4">
          {/* Active Passes Indicator */}
          {bookingCount > 0 && (
            <button
              onClick={onOpenMyBookings}
              className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="View your active reservations"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>{bookingCount} Pass{bookingCount > 1 ? 'es' : ''}</span>
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
            className="rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1d4ed8] active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            JOIN CLUB
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-5 py-4 md:hidden flex flex-col gap-3 shadow-lg">
          <button
            onClick={() => {
              onScrollToSection('court-schedule');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-bold text-[#365314]"
          >
            Book Court
          </button>
          <button
            onClick={() => {
              onScrollToSection('open-play');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-medium text-slate-700"
          >
            Leagues & Play
          </button>
          <button
            onClick={() => {
              onScrollToSection('memberships');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-medium text-slate-700"
          >
            Memberships
          </button>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenMyBookings();
                setMobileMenuOpen(false);
              }}
              className="text-sm font-semibold text-slate-800"
            >
              My Passes ({bookingCount})
            </button>
            <button
              onClick={() => {
                onScrollToSection('memberships');
                setMobileMenuOpen(false);
              }}
              className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white uppercase"
            >
              JOIN CLUB
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
