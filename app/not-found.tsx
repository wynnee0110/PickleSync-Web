import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | PickleSync',
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
        <span className="text-4xl">🏓</span>
      </div>
      <h1 className="mb-2 text-6xl font-black text-slate-900 tracking-tight">404</h1>
      <p className="mb-2 text-xl font-semibold text-slate-700">Court not found</p>
      <p className="mb-8 max-w-md text-slate-500 text-sm">
        Looks like this page drifted out of bounds. Head back to find your court.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
      >
        Back to courts
      </Link>
    </div>
  );
}
