'use client';

import React from 'react';
import { useBooking } from '@/components/providers/BookingProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { MyBookingsDrawer } from '@/components/ui/MyBookingsDrawer';
import { Check } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const {
    bookings,
    cancelBooking,
    toastMessage,
    showToast,
    myBookingsDrawerOpen,
    setMyBookingsDrawerOpen,
  } = useBooking();

  const router = useRouter();

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home then scroll
      router.push(`/#${id}`);
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f]">
        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 shadow-xl text-slate-800"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1e8e3e] text-white">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#bef264] selection:text-black">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-white px-5 py-3.5 shadow-2xl text-slate-900"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Persistent Navbar */}
      <Navbar
        bookingCount={bookings.length}
        onOpenMyBookings={() => setMyBookingsDrawerOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Page content */}
      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      {/* Persistent Footer */}
      <Footer />

      {/* Floating Glassmorphic Mobile Bottom Navigation */}
      <MobileBottomNav
        bookingCount={bookings.length}
        onOpenMyBookings={() => setMyBookingsDrawerOpen(true)}
        onScrollToSection={handleScrollToSection}
        isDrawerOpen={myBookingsDrawerOpen}
      />

      {/* Global Bookings Drawer */}
      <MyBookingsDrawer
        isOpen={myBookingsDrawerOpen}
        onClose={() => setMyBookingsDrawerOpen(false)}
        bookings={bookings}
        onCancelBooking={(id) => {
          cancelBooking(id);
          showToast('Reservation cancelled and refund processed.');
        }}
        onBookCourtClick={() => {
          setMyBookingsDrawerOpen(false);
          router.push('/book');
        }}
      />
    </div>
  );
}
