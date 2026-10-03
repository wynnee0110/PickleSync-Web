import type { Metadata } from 'next';
import { MembershipSection } from '@/components/sections/MembershipSection';

export const metadata: Metadata = {
  title: 'Membership | PickleSync',
  description: 'Explore PickleSync club membership plans and court passes. Unlock unlimited bookings and premium perks.',
};

// Server Component — MembershipSection is display-only, no interactivity needed
export default function MembershipPage() {
  return (
    <div className="pt-8">
      <MembershipSection />
    </div>
  );
}
