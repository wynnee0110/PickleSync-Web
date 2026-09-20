'use client';

import React from 'react';
import { Star, MapPin, CheckCircle, Clock, Zap, Users, ArrowUpRight } from 'lucide-react';
import { Court, TimeSlot } from '../types/booking';

interface CourtCardProps {
  court: Court;
  onSelectSlot: (court: Court, slot?: TimeSlot) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onSelectSlot }) => {
  // Status styling
  const statusConfig = {
    available: {
      label: 'Available Now',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
    },
    in_play: {
      label: 'In Match Play',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    reserved: {
      label: 'Reserved Next',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    maintenance: {
      label: 'Resurfacing',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
    },
  }[court.status];

  // Type badge styling
  const typeLabels = {
    championship: '🏆 Championship Stadium',
    indoor: '❄️ Indoor AC Climate',
    covered: '⛅ Covered Rooftop Deck',
    outdoor: '🌿 Garden Club Hardcourt',
  }[court.type];

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl shadow-xs">
      {/* Top Image Banner */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={court.imageUrl}
          alt={court.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 items-center justify-center rounded-xl bg-slate-950/80 px-3 text-xs font-black text-white border border-white/20 backdrop-blur-md">
              COURT #{court.courtNumber}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold backdrop-blur-md ${statusConfig.bg}`}>
              <span className={`h-2 w-2 rounded-full ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-950/80 px-2.5 py-1 text-xs font-bold text-amber-300 border border-white/20 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>{court.rating}</span>
            <span className="text-slate-300 text-[10px]">({court.reviewCount})</span>
          </div>
        </div>

        {/* Bottom image overlay tags */}
        <div className="absolute bottom-3 left-4 right-4">
          <span className="inline-block rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 border border-slate-200/60 backdrop-blur-md shadow-xs">
            {typeLabels}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Location */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {court.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{court.venue} • {court.location}</span>
              </div>
            </div>
          </div>

          {/* Current match ticker if active */}
          {court.currentMatch && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50/70 px-3 py-2 border border-amber-200/70 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-medium truncate">
                <Users className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{court.currentMatch.players}</span>
              </div>
              {court.currentMatch.gameScore && (
                <span className="ml-2 shrink-0 rounded bg-amber-200/60 px-1.5 py-0.5 font-mono text-[11px] font-bold text-amber-900">
                  {court.currentMatch.gameScore}
                </span>
              )}
            </div>
          )}

          {/* Surface & Tech specs */}
          <div className="mt-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Surface Technology
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              {court.surface}
            </div>
          </div>

          {/* Features list */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {court.features.map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 border border-slate-200/60"
              >
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Slots & Booking Action */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-slate-500">
              Available Slots Today:
            </div>
            <div className="text-xs font-medium text-slate-500">
              From <span className="text-base font-black text-slate-900">₱{court.pricePerHour}</span>/hr
            </div>
          </div>

          {/* Horizontal slots selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {court.slots.slice(0, 4).map((slot) => {
              const isBooked = slot.status === 'booked';
              return (
                <button
                  key={slot.id}
                  disabled={isBooked}
                  onClick={() => onSelectSlot(court, slot)}
                  className={`group/slot relative flex shrink-0 flex-col items-center rounded-xl px-3 py-2 text-xs transition-all cursor-pointer ${
                    isBooked
                      ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed line-through border border-slate-200'
                      : slot.status === 'fast_filling'
                      ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    <Clock className="h-3 w-3 text-slate-400 group-hover/slot:text-blue-600" />
                    <span>{slot.time}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    ₱{slot.price}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => onSelectSlot(court)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-blue-600 transition-all duration-200 shadow-md cursor-pointer"
          >
            <span>Reserve Court #{court.courtNumber}</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
