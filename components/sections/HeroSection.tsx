'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onBookNowClick: () => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  selectedTimeWindow?: string;
  onTimeWindowChange?: (time: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBookNowClick,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-14 lg:pt-14 lg:pb-20 hero-court-bg border-b border-slate-200/80">
      {/* Perspective Court Lines in background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-[1px] h-[150%] bg-gradient-to-b from-transparent via-slate-300 to-transparent rotate-45" />
        <div className="absolute -top-40 right-1/3 w-[1px] h-[160%] bg-gradient-to-b from-transparent via-slate-300 to-transparent -rotate-45" />
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-200/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Social Proof & Book Now CTA */}
          <div className="lg:col-span-5 space-y-6">
            {/* Immediate Court Access Badge */}
            <div className="inline-flex items-center rounded-full border border-[#bef264] bg-[#f7fee7] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#3f6212] shadow-xs">
              IMMEDIATE COURT ACCESS
            </div>

            {/* 3-Line Big Typography */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#0f172a] leading-[1.05]">
              BOOK COURTS.<br />
              <span className="text-[#4d7c0f]">SMASH DINKS.</span><br />
              PLAY TODAY.
            </h1>

            {/* Description Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
              Discover and instantly book our championship pickleball court.
              Secure your private court time, challenge peers, and play on professional
              cushioned turf with instant keyless gate access.
            </p>

            {/* Social Proof Avatars */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Player 1"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Player 2"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Player 3"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                <strong className="font-bold text-slate-900">1,250+ matches</strong> played on PickleSync court this season
              </p>
            </div>

            {/* Instant Book Now Action Button */}
            <div className="pt-2">
              <button
                onClick={onBookNowClick}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#2563eb] px-8 py-4 text-base font-bold text-white hover:bg-[#1d4ed8] active:scale-95 transition-all shadow-lg shadow-blue-500/25 cursor-pointer group"
              >
                <span>Book Now</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Court Showcase (Bigger & Prominent) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl xl:max-w-3xl group">
              {/* Subtle ambient glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#2563eb]/20 via-[#bef264]/15 to-[#0284c7]/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Court Card Container */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/90 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.3)] ring-1 ring-slate-900/10">
                <div className="relative w-full aspect-[1600/832] overflow-hidden bg-slate-900">
                  <Image
                    src="/images/12.jpg"
                    alt="Championship Pickleball Court in action"
                    width={1600}
                    height={832}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 55vw"
                    className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle edge vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-black/10 pointer-events-none" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
 