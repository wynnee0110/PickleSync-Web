'use client';

import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error monitoring service in production
    console.error('[PickleSync Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <span className="text-4xl">🏓</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mb-8 max-w-md text-slate-500 text-sm">
        The court is temporarily out of order. Our team has been notified.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
