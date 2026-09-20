'use client';

import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { HeroCourtGraphic } from './HeroCourtGraphic';

interface HeroSectionProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTimeWindow: string;
  onTimeWindowChange: (time: string) => void;
  onBookNowClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedDate,
  onDateChange,
  selectedTimeWindow,
  onTimeWindowChange,
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
          {/* Left Column: Headline & Social Proof */}
          <div className="lg:col-span-7 space-y-6">
            {/* Immediate Court Access Badge */}
            <div className="inline-flex items-center rounded-full border border-[#bef264] bg-[#f7fee7] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#3f6212] shadow-xs">
              IMMEDIATE COURT ACCESS
            </div>

            {/* 3-Line Big Typography */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0f172a] leading-[1.05]">
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
          </div>

          {/* Right Column: Aerial Top-Down Blue Court Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroCourtGraphic />
          </div>
        </div>

        {/* Integrated Quick Court Slot Finder */}
        <div className="mt-12 mx-auto max-w-4xl rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Date Selector */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200/70 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Calendar className="h-5 w-5 text-[#4d7c0f] shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Select Date
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  aria-label="Select Date"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="today">Today (Live Slots)</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="weekend">This Weekend</option>
                  <option value="next-week">Next 7 Days</option>
                </select>
              </div>
            </div>

            {/* Time Window */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 border border-slate-200/70 focus-within:border-blue-500 focus-within:bg-white transition-all">
              <Clock className="h-5 w-5 text-amber-500 shrink-0" />
              <div className="w-full text-left">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Preferred Time
                </label>
                <select
                  value={selectedTimeWindow}
                  onChange={(e) => onTimeWindowChange(e.target.value)}
                  aria-label="Preferred Time"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="all">Anytime (07:00 - 23:00)</option>
                  <option value="morning">Morning (07:00 - 12:00)</option>
                  <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                  <option value="evening">Evening (17:00 - 23:00)</option>
                </select>
              </div>
            </div>

            {/* Instant Action Button */}
            <button
              onClick={onBookNowClick}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-6 py-3.5 font-bold text-white hover:bg-[#1d4ed8] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>View Available Slots</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
