import type { Metadata } from 'next';
import { BookingsClient } from '../../components/pages/BookingsClient';

export const metadata: Metadata = {
  title: 'My Bookings | PickleSync',
  description: 'View and manage all your active court reservations and access passes.',
};

export default function BookingsPage() {
  return <BookingsClient />;
}
