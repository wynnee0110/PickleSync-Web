import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookCourtClient } from '@/components/pages/BookCourtClient';

export const metadata: Metadata = {
  title: 'Book a Court | PickleSync',
  description: 'Select your court and book live pickleball time slots instantly with PickleSync.',
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-24 text-center text-slate-500">
          Loading court schedule...
        </div>
      }
    >
      <BookCourtClient />
    </Suspense>
  );
}
