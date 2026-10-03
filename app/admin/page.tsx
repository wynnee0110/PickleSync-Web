import type { Metadata } from 'next';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | PickleSync',
  description: 'PickleSync club management — courts, bookings, revenue overview.',
};

// Server Component shell — all interactivity in AdminDashboardClient
export default function AdminPage() {
  return <AdminDashboardClient />;
}
