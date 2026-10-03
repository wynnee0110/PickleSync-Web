import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | PickleSync',
  description: 'PickleSync club management dashboard — courts, bookings, revenue, and members.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Clean, minimal Google-style console shell
    <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] antialiased">{children}</div>
  );
}
