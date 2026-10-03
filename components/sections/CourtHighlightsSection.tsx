'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Zap,
  Sparkles,
  Lock,
  Video,
  Wind,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';

const HIGHLIGHT_FEATURES = [
  {
    icon: Shield,
    title: 'CushionX™ 8mm Pro Turf',
    description: 'Multi-layer polyurethane elastomer reduces knee and ankle impact by 42% while preserving true tournament ball bounce.',
    tag: 'Joint Protection',
    color: 'from-emerald-500/15 to-emerald-500/5 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-600 text-white',
  },
  {
    icon: Zap,
    title: '600 Lux Shadowless Lighting',
    description: 'High-mount diffused LED lighting eliminates glare and deep shadows, ensuring crisp ball visibility during high-speed dink battles.',
    tag: 'Broadcast Grade',
    color: 'from-amber-500/15 to-amber-500/5 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-500 text-white',
  },
  {
    icon: Lock,
    title: 'Instant Smart Keypad PIN',
    description: 'Every reservation automatically mints a unique 4-digit gate access code sent to your phone, unlocking gates 10 minutes prior.',
    tag: 'Keyless Entry',
    color: 'from-blue-500/15 to-blue-500/5 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-600 text-white',
  },
  {
    icon: Video,
    title: 'AI Replays & DUPR Sync',
    description: 'High-speed automated cameras clip your match-winning rallies, stream live to club monitors, and submit verified game scores to DUPR.',
    tag: 'Match Intelligence',
    color: 'from-purple-500/15 to-purple-500/5 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-600 text-white',
  },
  {
    icon: Wind,
    title: 'Climate Controlled (68°F)',
    description: 'Our indoor domes maintain optimal 68°F (20°C) temperature year-round with acoustic sound damping for whisper-quiet rallies.',
    tag: 'All-Weather Comfort',
    color: 'from-teal-500/15 to-teal-500/5 text-teal-700 border-teal-200',
    iconBg: 'bg-teal-600 text-white',
  },
  {
    icon: Award,
    title: 'Pro Dugouts & Ball Machines',
    description: 'Private shaded player benches, refrigerated bottle refill chillers, and automated Spinshot ball machines available on demand.',
    tag: 'Player Amenities',
    color: 'from-lime-500/15 to-lime-500/5 text-lime-700 border-lime-200',
    iconBg: 'bg-[#4d7c0f] text-white',
  },
];

const CAROUSEL_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1600&q=80',
    title: 'Court 1',
    badge: 'Court 1 of 6',
    description: 'Tournament CushionX™ 8mm turf, 600 Lux broadcast illumination, and stadium spectator seating.',
  },
  {
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=1600&q=80',
    title: 'Court 2',
    badge: 'Court 2 of 6',
    description: 'Indoor climate-controlled surface with acoustic sound damping and private player dugouts.',
  },
  {
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1600&q=80',
    title: 'Court 3',
    badge: 'Court 3 of 6',
    description: 'Covered canopy court with all-weather plexipave surface and protective perimeter wind screens.',
  },
  {
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
    title: 'Court 4',
    badge: 'Court 4 of 6',
    description: 'Covered regulation court with integrated misting stations and pro tournament net.',
  },
  {
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    title: 'Court 5',
    badge: 'Court 5 of 6',
    description: 'Outdoor fast-rebound court with natural sunlight, night LED lighting, and spectator benches.',
  },
  {
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1600&q=80',
    title: 'Court 6',
    badge: 'Court 6 of 6',
    description: 'Outdoor regulation court with dual-direction net alignment and shaded player parasols.',
  },
];

export function CourtHighlightsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play timer: advances every 5 seconds when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  return (
    <section id="court-highlights" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ── Section Header ──────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#bef264] bg-[#f7fee7] px-4 py-1 text-xs font-black uppercase tracking-wider text-[#3f6212] shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Court Highlights & Technology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            ENGINEERED FOR PRO PERFORMANCE.
            <br />
            <span className="text-[#4d7c0f]">BUILT FOR TOTAL COMFORT.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every PickleSync court is precision-built with tournament specifications, pro cushioning, and smart keyless technology to elevate every rally.
          </p>
        </div>

        {/* ── 6 Highlight Pillar Cards Grid ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {HIGHLIGHT_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/50 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-sm ${feat.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#4d7c0f] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-[#4d7c0f] transition-colors">
                  <span>Standard on all courts</span>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Facility Photo Carousel ─────────────────────────────────── */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-950 group h-[360px] sm:h-[480px] lg:h-[520px]"
        >
          {/* Images */}
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover object-center"
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            </div>
          ))}

          {/* Top Facility Badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2 rounded-full bg-slate-950/75 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white border border-white/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#bef264] animate-pulse" />
            <span>PickleSync Arena · Facility Photo Gallery</span>
          </div>

          {/* Slide Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/60 backdrop-blur-md text-white border border-white/20 hover:bg-slate-950/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/60 backdrop-blur-md text-white border border-white/20 hover:bg-slate-950/90 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bottom Captions & CTA */}
          <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl text-white">
              <span className="inline-block rounded-full bg-[#bef264] px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-xs mb-2">
                {CAROUSEL_SLIDES[currentSlide].badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {CAROUSEL_SLIDES[currentSlide].title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                {CAROUSEL_SLIDES[currentSlide].description}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/book"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 text-xs sm:text-sm font-bold text-white hover:bg-[#1d4ed8] active:scale-95 transition-all shadow-lg shadow-blue-500/25 cursor-pointer group/btn"
              >
                <span>Book Court Now</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:bottom-3">
            {CAROUSEL_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  i === currentSlide
                    ? 'w-7 h-2 bg-[#bef264]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Stats Strip ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
          {[
            { value: '6 Courts', label: 'Regulation Courts', sub: 'Courts 1 through 6' },
            { value: '600 Lux', label: 'Broadcast Illumination', sub: 'Zero-glare night play' },
            { value: '42%', label: 'Impact Reduction', sub: 'Multi-layer CushionX™ turf' },
            { value: '100%', label: 'Keyless Gate Entry', sub: 'Automated 4-digit PINs' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center sm:text-left"
            >
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-bold text-slate-800 mt-1">{stat.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
