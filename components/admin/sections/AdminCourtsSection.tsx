'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  Plus,
  Sun,
  Sunset,
  User,
  Key,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Court, BookingReservation } from '@/types/booking';
import { isCourtOccupied } from '@/lib/courtAvailability';
import { CourtStatusBadge } from '../CourtStatusBadge';

interface AdminCourtsSectionProps {
  courts: Court[];
  statusFilter: string;
  onSelectStatusFilter: (status: string) => void;
  onSelectCourtForStatus: (court: Court) => void;
  liveBookings?: BookingReservation[];
  onQuickBookCourt?: (court: Court) => void;
}

interface CourtBookedSlotItem {
  id: string;
  courtNumber: number;
  dateLabel: string;
  dayNumber: number;
  dayTag: string;
  time: string;
  endTime: string;
  isPeak: boolean;
  playerName: string;
  playersCount: number;
  accessPin: string;
  amount: number;
  isLiveBooking: boolean;
}

const SCHEDULE_DATES = [
  { day: 9, dateLabel: 'Sep 9, 2025', shortLabel: 'Sep 9', tag: 'Today' },
  { day: 10, dateLabel: 'Sep 10, 2025', shortLabel: 'Sep 10', tag: 'Tomorrow' },
  { day: 11, dateLabel: 'Sep 11, 2025', shortLabel: 'Sep 11', tag: 'Thu' },
  { day: 12, dateLabel: 'Sep 12, 2025', shortLabel: 'Sep 12', tag: 'Fri' },
  { day: 13, dateLabel: 'Sep 13, 2025', shortLabel: 'Sep 13', tag: 'Sat' },
  { day: 14, dateLabel: 'Sep 14, 2025', shortLabel: 'Sep 14', tag: 'Sun' },
];

const MORNING_SLOTS = [
  { time: '08:00 AM', endTime: '09:00 AM', isPeak: false },
  { time: '09:00 AM', endTime: '10:00 AM', isPeak: false },
  { time: '10:00 AM', endTime: '11:00 AM', isPeak: false },
  { time: '11:00 AM', endTime: '12:00 PM', isPeak: false },
  { time: '12:00 PM', endTime: '01:00 PM', isPeak: false },
];

const AFTERNOON_SLOTS = [
  { time: '01:00 PM', endTime: '02:00 PM', isPeak: false },
  { time: '02:00 PM', endTime: '03:00 PM', isPeak: false },
  { time: '03:00 PM', endTime: '04:00 PM', isPeak: false },
  { time: '04:00 PM', endTime: '05:00 PM', isPeak: true },
  { time: '05:00 PM', endTime: '06:00 PM', isPeak: true },
  { time: '06:00 PM', endTime: '07:00 PM', isPeak: true },
  { time: '07:00 PM', endTime: '08:00 PM', isPeak: true },
  { time: '08:00 PM', endTime: '09:00 PM', isPeak: true },
];

const ALL_TIME_SLOTS = [...MORNING_SLOTS, ...AFTERNOON_SLOTS];

const MOCK_BOOKERS = [
  'Marcus Lopez',
  'Sarah Kim',
  'Jake Torres',
  'Priya Menon',
  'Elena Rostova',
  'David Chen',
  'Jordan Vance',
  'Liam Patel',
  'Chloe Tan',
  'wei Zhang',
  'Sam Wallace',
  'Rachel Sy',
];

function getDeterministicBooker(courtNumber: number, day: number, slotIdx: number) {
  const idx = (courtNumber * 7 + day * 3 + slotIdx * 5) % MOCK_BOOKERS.length;
  const name = MOCK_BOOKERS[idx];
  const pinNum = 1000 + ((courtNumber * 313 + day * 97 + slotIdx * 53) % 9000);
  const bkNum = 800000 + ((courtNumber * 1237 + day * 431 + slotIdx * 109) % 199999);
  const playersCount = ((courtNumber + day + slotIdx) % 2 === 0) ? 4 : 2;
  return {
    id: `BK-${bkNum}`,
    playerName: name,
    playersCount,
    accessPin: `SYNC-CRT${courtNumber}-${pinNum}`,
  };
}

export function AdminCourtsSection({
  courts,
  statusFilter,
  onSelectStatusFilter,
  onSelectCourtForStatus,
  liveBookings = [],
  onQuickBookCourt,
}: AdminCourtsSectionProps) {
  // Limit selector to Courts #1 and #2 for this single court owner
  const ownerCourts = useMemo(() => courts.slice(0, 2), [courts]);

  const [selectedCourtId, setSelectedCourtId] = useState<string>(
    () => ownerCourts[0]?.id || 'court-1'
  );
  const [selectedDateFilter, setSelectedDateFilter] = useState<number | 'all'>('all');
  const [activeGridDay, setActiveGridDay] = useState<number>(9);

  // Keep selectedCourt synced with latest court state (e.g. status updates or filter changes)
  const selectedCourt = useMemo(() => {
    return (
      ownerCourts.find((c) => c.id === selectedCourtId) ||
      ownerCourts[0] ||
      courts[0]
    );
  }, [ownerCourts, courts, selectedCourtId]);

  // Compute all booked slots (date + time) for a given court across SCHEDULE_DATES + liveBookings
  const getBookedSlotsForCourt = (court: Court): CourtBookedSlotItem[] => {
    const results: CourtBookedSlotItem[] = [];
    const seenKeys = new Set<string>();

    // 1. Include any live reservations created in BookingProvider for this court
    liveBookings
      .filter((b) => b.courtId === court.id || b.courtNumber === court.courtNumber)
      .forEach((b) => {
        const matchedDate =
          b.date === 'Today'
            ? SCHEDULE_DATES[0]
            : b.date === 'Tomorrow'
              ? SCHEDULE_DATES[1]
              : SCHEDULE_DATES.find((d) => d.dateLabel === b.date) || SCHEDULE_DATES[0];

        const matchedSlot = ALL_TIME_SLOTS.find((s) => s.time === b.timeSlot);
        const key = `${matchedDate.day}-${b.timeSlot}`;
        seenKeys.add(key);

        results.push({
          id: b.bookingId,
          courtNumber: court.courtNumber,
          dateLabel: matchedDate.dateLabel,
          dayNumber: matchedDate.day,
          dayTag: matchedDate.tag,
          time: b.timeSlot,
          endTime: matchedSlot?.endTime || '1 hr session',
          isPeak: matchedSlot?.isPeak ?? true,
          playerName: b.playerNames.join(', '),
          playersCount: b.playerNames.length,
          accessPin: b.accessPassCode,
          amount: b.totalPrice,
          isLiveBooking: true,
        });
      });

    // 2. Include scheduled occupied slots across dates from courtAvailability
    SCHEDULE_DATES.forEach((dateObj) => {
      ALL_TIME_SLOTS.forEach((slot, slotIdx) => {
        const key = `${dateObj.day}-${slot.time}`;
        if (seenKeys.has(key)) return;

        if (isCourtOccupied(court.courtNumber, dateObj.day, slot.time)) {
          const mockInfo = getDeterministicBooker(court.courtNumber, dateObj.day, slotIdx);
          results.push({
            id: mockInfo.id,
            courtNumber: court.courtNumber,
            dateLabel: dateObj.dateLabel,
            dayNumber: dateObj.day,
            dayTag: dateObj.tag,
            time: slot.time,
            endTime: slot.endTime,
            isPeak: slot.isPeak,
            playerName: mockInfo.playerName,
            playersCount: mockInfo.playersCount,
            accessPin: mockInfo.accessPin,
            amount: slot.isPeak ? court.peakPricePerHour : court.pricePerHour,
            isLiveBooking: false,
          });
        }
      });
    });

    return results;
  };

  // Precompute booked slot counts per court for the selector badges
  const bookedSlotsByCourtId = useMemo(() => {
    const map: Record<string, CourtBookedSlotItem[]> = {};
    ownerCourts.forEach((c) => {
      map[c.id] = getBookedSlotsForCourt(c);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerCourts, liveBookings]);

  const selectedCourtBookings = useMemo(() => {
    if (!selectedCourt) return [];
    return bookedSlotsByCourtId[selectedCourt.id] || getBookedSlotsForCourt(selectedCourt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourt, bookedSlotsByCourtId]);

  const filteredBookingsForSelectedCourt = useMemo(() => {
    if (selectedDateFilter === 'all') return selectedCourtBookings;
    return selectedCourtBookings.filter((b) => b.dayNumber === selectedDateFilter);
  }, [selectedCourtBookings, selectedDateFilter]);

  const activeGridDateObj =
    SCHEDULE_DATES.find((d) => d.day === activeGridDay) || SCHEDULE_DATES[0];

  const handleSelectCourt = (court: Court) => {
    setSelectedCourtId(court.id);
  };

  const handleSelectDateTab = (dayOrAll: number | 'all') => {
    setSelectedDateFilter(dayOrAll);
    if (dayOrAll !== 'all') {
      setActiveGridDay(dayOrAll);
    }
  };

  return (
    <section
      aria-label="Court Owner Selector & Booked Schedule"
      className="bg-white rounded-2xl border border-[#dadce0] shadow-[0_1px_2px_rgba(60,64,67,0.06)] overflow-hidden"
    >
      {/* ── Top Header: Single Court Owner Info & Status Filter ───────── */}
      <div className="p-4 sm:p-5 border-b border-[#dadce0] flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f7fee7] border border-[#bef264] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#3f6212]">
              <Sparkles className="h-3 w-3" />
              PickleSync Arena · Owner View
            </span>
            <h2 className="text-sm sm:text-base font-bold text-[#1f1f1f]">
              Court Selector (Court #1 & #2) & Booked Schedule
            </h2>
          </div>
          <p className="text-xs text-[#5f6368] mt-1">
            Select Court #1 or Court #2 below to inspect all booked dates, time slots, and player reservations
          </p>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'available', 'in_play', 'reserved', 'maintenance'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onSelectStatusFilter(st)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0b57d0] text-white font-semibold'
                  : 'bg-[#f1f3f4] text-[#444746] hover:bg-[#e0e2ec]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {ownerCourts.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#747775]">
          No courts matching the selected status filter.
        </div>
      ) : (
        <div className="p-4 sm:p-6 space-y-6">
          {/* ── Quick Horizontal Court #1 - #8 Pill Bar ───────────────── */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#f1f3f4]">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {ownerCourts.map((court) => {
                const isSelected = selectedCourt?.id === court.id;
                const count = (bookedSlotsByCourtId[court.id] || []).length;
                return (
                  <button
                    key={court.id}
                    type="button"
                    onClick={() => handleSelectCourt(court)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#2563eb] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>Court #{court.courtNumber}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-black ${
                        isSelected
                          ? 'bg-blue-800 text-white'
                          : 'bg-white text-slate-600'
                      }`}
                    >
                      {count} booked
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> In Play
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Reserved
              </span>
            </div>
          </div>

          {/* ── Visual Court #1 & #2 Selector Grid (Like Booking Page) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ownerCourts.map((court) => {
              const isSelected = selectedCourt?.id === court.id;
              const courtBookings = bookedSlotsByCourtId[court.id] || [];
              const todayBookedCount = courtBookings.filter((b) => b.dayNumber === 9).length;
              const isMaintenance = court.status === 'maintenance';

              return (
                <div
                  key={court.id}
                  onClick={() => handleSelectCourt(court)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectCourt(court);
                    }
                  }}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all text-left cursor-pointer select-none ${
                    isSelected
                      ? 'border-[#2563eb] bg-blue-50/70 ring-2 ring-[#2563eb] shadow-sm'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {/* Top: Court # Badge & Status Dot */}
                  <div className="flex items-center justify-between mb-2 w-full">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                        isSelected
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      Court #{court.courtNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#0b57d0] bg-white border border-blue-200 px-2 py-0.5 rounded-full">
                        {courtBookings.length} booked ({todayBookedCount} today)
                      </span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          court.status === 'available'
                            ? 'bg-emerald-500'
                            : court.status === 'in_play'
                              ? 'bg-amber-500'
                              : court.status === 'reserved'
                                ? 'bg-blue-600'
                                : 'bg-rose-500'
                        }`}
                        title={`Status: ${court.status.replace('_', ' ')}`}
                      />
                    </div>
                  </div>

                  {/* Visual Top-Down Court Graphic (Matching Booking Selector) */}
                  <div
                    className={`relative w-full aspect-[16/7] rounded-xl overflow-hidden border p-1 flex items-center justify-center my-1.5 ${
                      isMaintenance
                        ? 'bg-slate-300 border-slate-300 grayscale'
                        : isSelected
                          ? 'bg-[#3b82f6] border-blue-400'
                          : 'bg-[#4a7ec2] border-slate-300/80'
                    }`}
                  >
                    <svg viewBox="0 0 100 64" className="w-full h-full">
                      <rect
                        x="2"
                        y="2"
                        width="96"
                        height="60"
                        rx="1.5"
                        fill={isMaintenance ? '#94a3b8' : isSelected ? '#3b82f6' : '#4a7ec2'}
                        stroke="#ffffff"
                        strokeWidth="1.2"
                      />
                      <rect
                        x="34"
                        y="2"
                        width="32"
                        height="60"
                        fill={isMaintenance ? '#64748b' : isSelected ? '#1d4ed8' : '#2e5d95'}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <line x1="2" y1="32" x2="34" y2="32" stroke="#ffffff" strokeWidth="1" />
                      <line x1="66" y1="32" x2="98" y2="32" stroke="#ffffff" strokeWidth="1" />
                      <line
                        x1="50"
                        y1="1"
                        x2="50"
                        y2="63"
                        stroke="#ffffff"
                        strokeWidth="1.8"
                        strokeDasharray="2 1"
                      />
                    </svg>

                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-900/25">
                        <CheckCircle2 className="h-6 w-6 text-white stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Court Details & Rate */}
                  <div className="mt-1.5 w-full flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-tight">
                        {court.name}
                      </p>
                      <p className="text-[11px] text-slate-500 capitalize truncate mt-0.5">
                        {court.location} · {court.type} ({court.surface})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-black text-slate-900 block">
                        ₱{court.pricePerHour}/hr
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Click to view schedule
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Selected Court Booked Dates & Times Inspector ─────────── */}
          {selectedCourt && (
            <div className="rounded-2xl border border-[#dadce0] bg-[#f8fafd] p-4 sm:p-5 space-y-5">
              {/* Selected Court Owner Summary Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#dadce0]">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-[#2563eb] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 leading-none">
                      Court
                    </span>
                    <span className="text-lg font-black leading-tight">
                      #{selectedCourt.courtNumber}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        Court #{selectedCourt.courtNumber} · {selectedCourt.name}
                      </h3>
                      <CourtStatusBadge
                        status={selectedCourt.status}
                        onClick={() => onSelectCourtForStatus(selectedCourt)}
                      />
                    </div>
                    <p className="text-xs text-[#5f6368] mt-0.5 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#0b57d0]" />
                        {selectedCourt.venue} ({selectedCourt.location})
                      </span>
                      <span>·</span>
                      <span className="capitalize">{selectedCourt.type}</span>
                      <span>·</span>
                      <span>{selectedCourt.surface}</span>
                      <span>·</span>
                      <span className="font-semibold text-slate-900">
                        ₱{selectedCourt.pricePerHour}/hr
                      </span>
                    </p>
                  </div>
                </div>

                {/* Selected Court Metrics & Quick Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="rounded-xl bg-white border border-[#dadce0] px-3.5 py-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#5f6368] block">
                      Total Booked Slots
                    </span>
                    <span className="font-black text-sm text-[#0b57d0]">
                      {selectedCourtBookings.length} reservations
                    </span>
                  </div>

                  <div className="rounded-xl bg-white border border-[#dadce0] px-3.5 py-2 text-xs">
                    <span className="text-[10px] uppercase font-bold text-[#5f6368] block">
                      Court Revenue
                    </span>
                    <span className="font-black text-sm text-emerald-700">
                      ₱
                      {selectedCourtBookings
                        .reduce((sum, item) => sum + item.amount, 0)
                        .toLocaleString()}
                    </span>
                  </div>

                  {onQuickBookCourt && (
                    <button
                      type="button"
                      onClick={() => onQuickBookCourt(selectedCourt)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b57d0] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#0842a0] transition-colors cursor-pointer shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Book Court #{selectedCourt.courtNumber}</span>
                    </button>
                  )}

                  <Link
                    href={`/book?court=${selectedCourt.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#dadce0] px-3 py-2.5 text-xs font-semibold text-[#444746] hover:bg-[#f1f3f4] transition-colors"
                  >
                    <span>Public View</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Date Filter Tabs for Selected Court */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleSelectDateTab('all')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      selectedDateFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-[#dadce0] text-[#444746] hover:bg-[#f1f3f4]'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    <span>All Booked Dates</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                        selectedDateFilter === 'all'
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {selectedCourtBookings.length}
                    </span>
                  </button>

                  {SCHEDULE_DATES.map((d) => {
                    const dayCount = selectedCourtBookings.filter(
                      (b) => b.dayNumber === d.day
                    ).length;
                    const isActive = selectedDateFilter === d.day;

                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => handleSelectDateTab(d.day)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#0b57d0] text-white'
                            : 'bg-white border border-[#dadce0] text-[#444746] hover:bg-[#f1f3f4]'
                        }`}
                      >
                        <span>
                          {d.shortLabel} ({d.tag})
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                            isActive
                              ? 'bg-blue-800 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {dayCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <span className="text-[11px] text-[#5f6368]">
                  Showing{' '}
                  <b className="text-[#1f1f1f]">
                    {filteredBookingsForSelectedCourt.length}
                  </b>{' '}
                  booked time slot{filteredBookingsForSelectedCourt.length === 1 ? '' : 's'} for{' '}
                  <b className="text-[#1f1f1f]">Court #{selectedCourt.courtNumber}</b>
                </span>
              </div>

              {/* Main 2-Column Layout: Left = All Booked Dates & Times Table | Right = Daily Slot Map */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* LEFT COLUMN (7 cols): All Booked Dates & Times List for Selected Court */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-[#dadce0] overflow-hidden shadow-2xs">
                  <div className="px-4 py-3 border-b border-[#f1f3f4] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-[#0b57d0]" />
                      <h4 className="text-xs sm:text-sm font-bold text-[#1f1f1f]">
                        Booked Times & Dates — Court #{selectedCourt.courtNumber}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-[#5f6368]">
                      {selectedDateFilter === 'all'
                        ? 'Sep 9 – Sep 14, 2025'
                        : activeGridDateObj.dateLabel}
                    </span>
                  </div>

                  {filteredBookingsForSelectedCourt.length === 0 ? (
                    <div className="p-8 text-center text-xs text-[#747775]">
                      No booked time slots for Court #{selectedCourt.courtNumber} on this date.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f1f3f4] max-h-[420px] overflow-y-auto">
                      {filteredBookingsForSelectedCourt.map((item) => (
                        <div
                          key={`${item.id}-${item.dayNumber}-${item.time}`}
                          className="p-3.5 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#f8fafd] transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            {/* Date & Time Pill */}
                            <div className="rounded-xl bg-[#e8f0fe] text-[#0b57d0] px-2.5 py-1.5 text-center shrink-0 min-w-[92px]">
                              <span className="block text-[10px] font-bold uppercase tracking-wider">
                                {item.dateLabel}
                              </span>
                              <span className="block text-xs font-black mt-0.5">
                                {item.time}
                              </span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-[#1f1f1f] flex items-center gap-1">
                                  <User className="h-3 w-3 text-[#5f6368]" />
                                  {item.playerName}
                                </span>
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-semibold">
                                  {item.playersCount} players
                                </span>
                                {item.isLiveBooking && (
                                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                    New Pass
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-[#5f6368] mt-1 flex-wrap">
                                <span className="font-medium text-slate-700">
                                  {item.time} – {item.endTime}
                                </span>
                                <span>·</span>
                                <span className="font-mono text-[10px] text-slate-500">
                                  {item.id}
                                </span>
                                <span>·</span>
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#0b57d0]">
                                  <Key className="h-2.5 w-2.5" />
                                  {item.accessPin}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                            <span className="text-xs font-black text-[#1f1f1f]">
                              ₱{item.amount}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e]" />
                              Booked ({item.dayTag})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN (5 cols): Daily Hour-by-Hour Slot Map (Like Booking Time Card) */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-[#dadce0] p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f3f4]">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#1f1f1f] flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#2563eb]" />
                        <span>Court #{selectedCourt.courtNumber} Daily Time Grid</span>
                      </h4>
                      <p className="text-[11px] text-[#5f6368] mt-0.5">
                        Booked vs Open hours for{' '}
                        <b className="text-[#1f1f1f]">{activeGridDateObj.dateLabel}</b>
                      </p>
                    </div>

                    {/* Mini Day Switcher for the Grid */}
                    <select
                      value={activeGridDay}
                      onChange={(e) => {
                        const d = parseInt(e.target.value, 10);
                        setActiveGridDay(d);
                      }}
                      aria-label="Select date for daily time grid"
                      className="rounded-xl border border-[#dadce0] bg-[#f8fafd] px-2.5 py-1.5 text-xs font-bold text-[#1f1f1f] cursor-pointer outline-none focus:border-[#0b57d0]"
                    >
                      {SCHEDULE_DATES.map((d) => (
                        <option key={d.day} value={d.day}>
                          {d.dateLabel} ({d.tag})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2 Columns: Morning & Afternoon Slots */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Morning Column */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/70">
                        <Sun className="h-3 w-3 text-amber-600" />
                        <span>Morning</span>
                      </div>
                      {MORNING_SLOTS.map((slot) => {
                        const bookedEntry = selectedCourtBookings.find(
                          (b) => b.dayNumber === activeGridDay && b.time === slot.time
                        );
                        const isBooked = Boolean(bookedEntry);

                        return (
                          <div
                            key={slot.time}
                            className={`w-full flex flex-col items-start px-2.5 py-1.5 rounded-xl border text-left transition-colors ${
                              isBooked
                                ? 'border-blue-200 bg-blue-50/90 text-blue-950'
                                : 'border-slate-200/80 bg-slate-50/50 text-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-[11px] leading-none">
                                {slot.time}
                              </span>
                              <span
                                className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase ${
                                  isBooked
                                    ? 'bg-[#2563eb] text-white'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {isBooked ? 'BOOKED' : 'OPEN'}
                              </span>
                            </div>
                            <span className="text-[9px] mt-1 truncate w-full font-medium">
                              {isBooked ? bookedEntry?.playerName : 'Available slot'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Afternoon Column */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200/70">
                        <Sunset className="h-3 w-3 text-indigo-600" />
                        <span>Afternoon</span>
                      </div>
                      {AFTERNOON_SLOTS.map((slot) => {
                        const bookedEntry = selectedCourtBookings.find(
                          (b) => b.dayNumber === activeGridDay && b.time === slot.time
                        );
                        const isBooked = Boolean(bookedEntry);

                        return (
                          <div
                            key={slot.time}
                            className={`w-full flex flex-col items-start px-2.5 py-1.5 rounded-xl border text-left transition-colors ${
                              isBooked
                                ? 'border-blue-200 bg-blue-50/90 text-blue-950'
                                : 'border-slate-200/80 bg-slate-50/50 text-slate-500'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-[11px] leading-none">
                                {slot.time}
                              </span>
                              <span
                                className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase ${
                                  isBooked
                                    ? 'bg-[#2563eb] text-white'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}
                              >
                                {isBooked ? 'BOOKED' : 'OPEN'}
                              </span>
                            </div>
                            <span className="text-[9px] mt-1 truncate w-full font-medium">
                              {isBooked ? bookedEntry?.playerName : 'Available slot'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
