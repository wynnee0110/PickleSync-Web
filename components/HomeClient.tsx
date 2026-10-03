'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { CourtHighlightsSection } from '@/components/sections/CourtHighlightsSection';
import { MembershipSection } from '@/components/sections/MembershipSection';

export function HomeClient() {
  const router = useRouter();

  return (
    <>
      {/* ── Hero Section with Book Now CTA ──────────────────────────── */}
      <HeroSection onBookNowClick={() => router.push('/book')} />

      {/* ── Court Highlights & Performance Technology ───────────────── */}
      <CourtHighlightsSection />

      {/* ── Club Memberships & Passes ───────────────────────────────── */}
      <MembershipSection />
    </>
  );
}
