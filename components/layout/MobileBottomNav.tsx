'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarDays,
  Ticket,
  Crown,
} from 'lucide-react';

interface MobileBottomNavProps {
  bookingCount: number;
  onOpenMyBookings: () => void;
  onScrollToSection: (sectionId: string) => void;
  isDrawerOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  bookingCount,
  onOpenMyBookings,
  onScrollToSection,
  isDrawerOpen = false,
}) => {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isBook = pathname === '/book';
  const isBookings = pathname === '/bookings' || isDrawerOpen;
  const isMembership = pathname === '/membership';

  const handleHomeClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClubClick = (e: React.MouseEvent) => {
    if (isHome) {
      e.preventDefault();
      onScrollToSection('memberships');
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      isActive: isHome && !isDrawerOpen,
      onClick: handleHomeClick,
      ariaLabel: 'Go to home page',
    },
    {
      id: 'book',
      label: 'Book',
      icon: CalendarDays,
      href: '/book',
      isActive: isBook && !isDrawerOpen,
      ariaLabel: 'Book a pickleball court',
    },
    {
      id: 'passes',
      label: 'Passes',
      icon: Ticket,
      isActive: isBookings,
      onClick: onOpenMyBookings,
      badge: bookingCount,
      ariaLabel: `View passes${bookingCount > 0 ? `, ${bookingCount} active` : ''}`,
    },
    {
      id: 'club',
      label: 'Club',
      icon: Crown,
      href: '/membership',
      isActive: isMembership && !isDrawerOpen,
      onClick: handleClubClick,
      ariaLabel: 'View club memberships',
    },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none md:hidden"
      style={{
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
      }}
    >
      <nav
        role="navigation"
        aria-label="Mobile Navigation"
        className="pointer-events-auto w-full max-w-sm sm:max-w-md rounded-full border border-white/60 bg-white/80 p-1.5 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.18),0_4px_12px_-2px_rgba(15,23,42,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl ring-1 ring-black/[0.04] transition-all duration-300"
      >
        <ul className="grid grid-cols-4 items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                {/* Icon wrapper with optional notification badge */}
                <div className="relative flex items-center justify-center">
                  <Icon
                    aria-hidden="true"
                    className={`h-5 w-5 transition-transform duration-200 ${
                      item.isActive
                        ? 'stroke-[2.25] scale-105 text-[#2563eb]'
                        : 'stroke-[1.75] text-slate-500 group-hover:text-slate-800'
                    }`}
                  />
                  {/* Passes dynamic count badge */}
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span
                      aria-label={`${item.badge} active passes`}
                      className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-black leading-none text-white shadow-xs ring-2 ring-white"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>

                {/* Tab Label */}
                <span
                  className={`text-[10px] tracking-tight transition-colors duration-200 ${
                    item.isActive
                      ? 'font-bold text-[#2563eb]'
                      : 'font-medium text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  {item.label}
                </span>

                {/* Active Indicator Micro-dot */}
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 rounded-full transition-all duration-200 ${
                    item.isActive
                      ? 'bg-[#2563eb] opacity-100 scale-100'
                      : 'bg-transparent opacity-0 scale-50'
                  }`}
                />
              </>
            );

            const commonClasses = `w-full group relative flex flex-col items-center justify-center gap-0.5 rounded-full py-1.5 px-1 h-12 cursor-pointer select-none transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              item.isActive
                ? 'bg-blue-50/90 shadow-xs'
                : 'hover:bg-slate-100/60'
            }`;

            return (
              <li key={item.id} className="flex items-center justify-center w-full">
                {item.href ? (
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    aria-label={item.ariaLabel}
                    aria-current={item.isActive ? 'page' : undefined}
                    className={commonClasses}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    aria-label={item.ariaLabel}
                    aria-current={item.isActive ? 'page' : undefined}
                    className={commonClasses}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
