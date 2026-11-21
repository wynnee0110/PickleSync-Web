'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Court, TimeSlot } from '@/types/booking';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sun,
  Sunset,
  CheckCircle2,
  Calendar,
  Loader2,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import {
  isDateFullyBooked,
  isCourtOccupied,
  isDateInPast,
  isDateBeyondAdvanceLimit,
  isDateToday,
  isTimeSlotPassedToday,
  MAX_ADVANCE_DAYS,
  getCourtOpenSlotsCount,
  isCourtFullyBookedOnDate,
  getFirstOpenSlotForCourt,
} from '@/lib/courtAvailability';

interface CourtScheduleSectionProps {
  courts: Court[];
  selectedCourt: Court;
  onSelectCourt: (court: Court) => void;
  onSelectSlot: (court: Court, slot: TimeSlot, date?: string, slotTimes?: string[]) => void;
}

type BookingStep = 'date' | 'loading' | 'court_and_time';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const CourtScheduleSection: React.FC<CourtScheduleSectionProps> = ({
  courts,
  selectedCourt,
  onSelectCourt,
  onSelectSlot,
}) => {
  const monthNames = MONTH_NAMES;

  // Dynamic real-time date & clock base (auto-updates every 30s)
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDayNum = now.getDate();

  const futureMonths = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => {
      const date = new Date(currentYear, currentMonth + i, 1);
      return {
        offset: i,
        month: date.getMonth(),
        year: date.getFullYear(),
        name: MONTH_NAMES[date.getMonth()],
      };
    });
  }, [currentYear, currentMonth]);

  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [monthOffset, setMonthOffset] = useState(0);
  const currentMonthData = futureMonths[monthOffset] || futureMonths[0];
  const selectedMonth = currentMonthData.month;
  const selectedYear = currentMonthData.year;

  const [selectedDay, setSelectedDay] = useState(todayDayNum);

  // Morning slots in 1-hour intervals
  const morningSlots = [
    { time: '08:00 AM', isPeak: false, duration: '1h' },
    { time: '09:00 AM', isPeak: false, duration: '1h' },
    { time: '10:00 AM', isPeak: false, duration: '1h' },
    { time: '11:00 AM', isPeak: false, duration: '1h' },
    { time: '12:00 PM', isPeak: false, duration: '1h' },
  ];

  // Afternoon / Evening slots in 1-hour intervals
  const afternoonSlots = [
    { time: '01:00 PM', isPeak: false, duration: '1h' },
    { time: '02:00 PM', isPeak: false, duration: '1h' },
    { time: '03:00 PM', isPeak: false, duration: '1h' },
    { time: '04:00 PM', isPeak: true, duration: '1h' },
    { time: '05:00 PM', isPeak: true, duration: '1h' },
    { time: '06:00 PM', isPeak: true, duration: '1h' },
    { time: '07:00 PM', isPeak: true, duration: '1h' },
    { time: '08:00 PM', isPeak: true, duration: '1h' },
  ];

  const allScheduleSlots = [...morningSlots, ...afternoonSlots];
  const allSlotTimes = allScheduleSlots.map((s) => s.time);
  const displayCourts = courts.slice(0, 2);

  // Is currently selected date today?
  const isCurrentSelectionToday = isDateToday(selectedYear, selectedMonth, selectedDay, now);

  // Selected Time Slots State
  const [selectedTimes, setSelectedTimes] = useState<string[]>(() => {
    const firstOpen = getFirstOpenSlotForCourt(selectedCourt.courtNumber, todayDayNum, allSlotTimes, true, now);
    return firstOpen ? [firstOpen] : [];
  });

  // Days in month logic
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Can navigate to next month if 5-day advance window spills into next month
  const canGoNextMonth = todayDayNum + MAX_ADVANCE_DAYS > daysInCurrentMonth;

  const handleChangeMonthOffset = (nextOffset: number) => {
    setMonthOffset(nextOffset);
    setSelectedDay(nextOffset === 0 ? todayDayNum : 1);
  };

  const handlePrevMonth = () => {
    if (monthOffset > 0) {
      handleChangeMonthOffset(monthOffset - 1);
    }
  };

  const handleNextMonth = () => {
    if (canGoNextMonth && monthOffset < 1) {
      handleChangeMonthOffset(monthOffset + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    const isTargetToday = isDateToday(selectedYear, selectedMonth, dayNum, now);
    if (
      isDateInPast(selectedYear, selectedMonth, dayNum, now) ||
      isDateBeyondAdvanceLimit(selectedYear, selectedMonth, dayNum, now) ||
      isDateFullyBooked(dayNum)
    ) {
      return;
    }
    setSelectedDay(dayNum);

    let activeCourt = selectedCourt;
    if (isCourtFullyBookedOnDate(selectedCourt.courtNumber, dayNum, allSlotTimes, isTargetToday, now)) {
      const firstOpenCourt = displayCourts.find(
        (c) => !isCourtFullyBookedOnDate(c.courtNumber, dayNum, allSlotTimes, isTargetToday, now)
      );
      if (firstOpenCourt) {
        activeCourt = firstOpenCourt;
        onSelectCourt(firstOpenCourt);
      }
    }

    setSelectedTimes((prev) => {
      const stillOpen = prev.filter(
        (t) =>
          !isCourtOccupied(activeCourt.courtNumber, dayNum, t, false) &&
          !isTimeSlotPassedToday(t, isTargetToday, now)
      );
      if (stillOpen.length > 0) return stillOpen;
      const firstOpen = getFirstOpenSlotForCourt(activeCourt.courtNumber, dayNum, allSlotTimes, isTargetToday, now);
      return firstOpen ? [firstOpen] : [];
    });
  };

  // Click Next on Date step -> show loading briefly then show court & time
  const handleProceedToCourtAndTime = () => {
    if (
      isDateFullyBooked(selectedDay) ||
      isDateBeyondAdvanceLimit(selectedYear, selectedMonth, selectedDay, now)
    ) {
      return;
    }
    setCurrentStep('loading');
  };

  useEffect(() => {
    if (currentStep === 'loading') {
      const timer = setTimeout(() => {
        // Ensure active court has open slots or fallback to other court
        let activeCourt = selectedCourt;
        if (isCourtFullyBookedOnDate(selectedCourt.courtNumber, selectedDay, allSlotTimes, isCurrentSelectionToday, now)) {
          const alternativeCourt = displayCourts.find(
            (c) => !isCourtFullyBookedOnDate(c.courtNumber, selectedDay, allSlotTimes, isCurrentSelectionToday, now)
          );
          if (alternativeCourt) {
            activeCourt = alternativeCourt;
            onSelectCourt(alternativeCourt);
          }
        }

        // Initialize open slots for step 2
        setSelectedTimes((prev) => {
          const stillOpen = prev.filter(
            (t) =>
              !isCourtOccupied(activeCourt.courtNumber, selectedDay, t, false) &&
              !isTimeSlotPassedToday(t, isCurrentSelectionToday, now)
          );
          if (stillOpen.length > 0) return stillOpen;
          const firstOpen = getFirstOpenSlotForCourt(activeCourt.courtNumber, selectedDay, allSlotTimes, isCurrentSelectionToday, now);
          return firstOpen ? [firstOpen] : [];
        });

        setCurrentStep('court_and_time');
      }, 650);

      return () => clearTimeout(timer);
    }
  }, [currentStep, selectedDay, selectedCourt, displayCourts, allSlotTimes, onSelectCourt, isCurrentSelectionToday, now]);

  const handleSelectCourt = (court: Court) => {
    if (isCourtFullyBookedOnDate(court.courtNumber, selectedDay, allSlotTimes, isCurrentSelectionToday, now)) return;
    onSelectCourt(court);

    setSelectedTimes((prev) => {
      const stillOpen = prev.filter(
        (t) =>
          !isCourtOccupied(court.courtNumber, selectedDay, t, false) &&
          !isTimeSlotPassedToday(t, isCurrentSelectionToday, now)
      );
      if (stillOpen.length > 0) return stillOpen;
      const firstOpen = getFirstOpenSlotForCourt(court.courtNumber, selectedDay, allSlotTimes, isCurrentSelectionToday, now);
      return firstOpen ? [firstOpen] : [];
    });
  };

  const handleToggleTime = (timeString: string) => {
    if (isTimeSlotPassedToday(timeString, isCurrentSelectionToday, now)) return;
    if (isCourtOccupied(selectedCourt.courtNumber, selectedDay, timeString, false)) return;

    setSelectedTimes((prev) => {
      if (prev.includes(timeString)) {
        return prev.filter((t) => t !== timeString);
      } else {
        return [...prev, timeString].sort(
          (a, b) => allSlotTimes.indexOf(a) - allSlotTimes.indexOf(b)
        );
      }
    });
  };

  const selectedFormattedDate = `${monthNames[selectedMonth]} ${selectedDay}, ${selectedYear}`;
  const isSelectedDateFull = isDateFullyBooked(selectedDay);
  const isSelectedDateBeyondAdvance = isDateBeyondAdvanceLimit(selectedYear, selectedMonth, selectedDay, now);
  const selectedCourtOpenSlotsCount = getCourtOpenSlotsCount(
    selectedCourt.courtNumber,
    selectedDay,
    allSlotTimes,
    isCurrentSelectionToday,
    now
  );

  const getSlotForCourt = (court: Court, timeString: string): TimeSlot => {
    const isPassed = isTimeSlotPassedToday(timeString, isCurrentSelectionToday, now);
    const isOccupied = isPassed || isCourtOccupied(court.courtNumber, selectedDay, timeString, false);
    const isPeak = timeString.includes('04:') || timeString.includes('05:') || timeString.includes('06:') || timeString.includes('07:') || timeString.includes('08:');

    return {
      id: `${court.id}-${timeString}`,
      time: timeString,
      isPeak,
      price: isPeak ? court.peakPricePerHour : court.pricePerHour,
      status: isOccupied ? 'booked' : 'available',
    };
  };

  const hasSelectedSlots = selectedTimes.length > 0;
  const totalPrice = selectedTimes.reduce((sum, timeStr) => {
    const isPeak = timeStr.includes('04:') || timeStr.includes('05:') || timeStr.includes('06:') || timeStr.includes('07:') || timeStr.includes('08:');
    return sum + (isPeak ? selectedCourt.peakPricePerHour : selectedCourt.pricePerHour);
  }, 0);

  const handleProceedToPayment = () => {
    if (selectedTimes.length === 0) return;
    const primarySlot = getSlotForCourt(selectedCourt, selectedTimes[0]);
    onSelectSlot(selectedCourt, primarySlot, selectedFormattedDate, selectedTimes);
  };

  return (
    <section id="court-schedule" className="py-6 sm:py-12 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pb-28 lg:pb-16">
      
      {/* ── Visual Step Progress Bar ───────────────────────────────── */}
      <div className="max-w-xl mx-auto mb-6 sm:mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 z-0" />
          
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCurrentStep('date')}
            className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentStep === 'date'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-black ${
              currentStep === 'date' ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-700'
            }`}>
              1
            </span>
            <span>Select Date</span>
          </button>

          {/* Step 2 Pill */}
          <div
            className={`relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              currentStep === 'court_and_time'
                ? 'bg-blue-600 text-white shadow-md'
                : currentStep === 'loading'
                  ? 'bg-blue-50 border border-blue-300 text-blue-700 animate-pulse'
                  : 'bg-white border border-slate-200 text-slate-400'
            }`}
          >
            <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-black ${
              currentStep === 'court_and_time' ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </span>
            <span>Court & Time</span>
          </div>

          {/* Step 3 Pill */}
          <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-400">
            <span className="h-5 w-5 rounded-full flex items-center justify-center text-[11px] font-black bg-slate-100 text-slate-400">
              3
            </span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      {/* ── STEP 1: SELECT DATE FIRST ─────────────────────────────── */}
      {currentStep === 'date' && (
        <div className="max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-1 rounded-full border border-[#bef264] bg-[#f7fee7] px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#3f6212] mb-2 shadow-2xs">
              <Sparkles className="h-3 w-3" />
              Step 1 of 2
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Select Your Booking Date
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose your preferred date on the calendar, then proceed to view open courts & times
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold text-blue-700 mt-2 shadow-2xs">
              <Clock className="h-3 w-3 text-blue-600" />
              <span>Advance booking limit: Up to {MAX_ADVANCE_DAYS} days in advance</span>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={monthOffset === 0}
                className={`p-2 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                  monthOffset === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                }`}
                aria-label="Previous Month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="relative">
                <select
                  value={monthOffset}
                  onChange={(e) => handleChangeMonthOffset(parseInt(e.target.value, 10))}
                  aria-label="Select month"
                  className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-8 text-sm font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
                >
                  {futureMonths.slice(0, canGoNextMonth ? 2 : 1).map((fm) => (
                    <option key={fm.offset} value={fm.offset}>
                      {fm.name} {fm.year}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 text-xs">
                  ▼
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!canGoNextMonth || monthOffset >= 1}
                title={canGoNextMonth ? "Next Month" : "Advance bookings are limited to 5 days"}
                className={`p-2 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                  canGoNextMonth && monthOffset < 1
                    ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Next Month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 mb-2">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center text-xs sm:text-sm font-semibold">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square w-full max-w-[46px] mx-auto" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isPast = isDateInPast(selectedYear, selectedMonth, dayNum, now);
                const isBeyondAdvance = isDateBeyondAdvanceLimit(selectedYear, selectedMonth, dayNum, now);
                const isFull = isDateFullyBooked(dayNum);
                const isSelected = selectedDay === dayNum;
                const isDisabled = isPast || isBeyondAdvance || isFull;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) handleSelectDay(dayNum);
                    }}
                    title={
                      isPast
                        ? `Date has passed (Day ${dayNum})`
                        : isBeyondAdvance
                          ? `Day ${dayNum} is beyond the 5-day advance booking limit`
                          : isFull
                            ? `Day ${dayNum} is fully booked`
                            : `Select day ${dayNum}`
                    }
                    className={`aspect-square w-full max-w-[48px] max-h-[48px] min-h-[40px] rounded-xl flex flex-col items-center justify-center transition-all mx-auto touch-manipulation ${
                      isPast
                        ? 'text-slate-300 opacity-40 cursor-not-allowed line-through select-none'
                        : isBeyondAdvance
                          ? 'text-slate-300 bg-slate-50/50 cursor-not-allowed select-none opacity-45'
                          : isFull
                            ? 'bg-slate-100/90 text-slate-300 line-through cursor-not-allowed border border-dashed border-slate-200 select-none'
                            : isSelected
                              ? 'bg-blue-600 text-white font-black shadow-md cursor-pointer scale-105'
                              : 'text-slate-700 hover:bg-slate-100 cursor-pointer font-bold'
                    }`}
                  >
                    <span className="leading-none">{dayNum}</span>
                    {isBeyondAdvance && !isPast && (
                      <span className="text-[7px] font-bold text-slate-400 -mt-0.5 no-underline">LOCK</span>
                    )}
                    {isFull && !isPast && !isBeyondAdvance && (
                      <span className="text-[7px] font-black text-rose-500 -mt-0.5 no-underline">FULL</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Summary & Availability Banner */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Selected Date</span>
                  <span className="font-extrabold text-slate-900">{selectedFormattedDate}</span>
                </div>
              </div>

              {isSelectedDateFull ? (
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                  Fully Booked
                </span>
              ) : isSelectedDateBeyondAdvance ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 border border-slate-200">
                  Beyond 5-Day Window
                </span>
              ) : (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                  Open For Play
                </span>
              )}
            </div>

            {/* Next Button */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={isSelectedDateFull || isSelectedDateBeyondAdvance}
                onClick={handleProceedToCourtAndTime}
                className={`w-full flex items-center justify-center gap-2 py-3 sm:py-3.5 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                  isSelectedDateFull || isSelectedDateBeyondAdvance
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-98 shadow-blue-500/25'
                }`}
              >
                <span>
                  {isSelectedDateFull
                    ? 'Please Select Another Date'
                    : isSelectedDateBeyondAdvance
                      ? 'Selected Date Beyond 5-Day Window'
                      : 'Next: Choose Court & Time'}
                </span>
                {!isSelectedDateFull && !isSelectedDateBeyondAdvance && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING STATE ("load a bit after clicking next") ───────── */}
      {currentStep === 'loading' && (
        <div className="max-w-md mx-auto py-16 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col items-center justify-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-xs">
              <Loader2 className="h-7 w-7 animate-spin stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Checking Live Court Availability...
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Loading schedules for Court #1 and Court #2 on <b>{selectedFormattedDate}</b>
              </p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4 transition-all" />
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: SHOW COURT AND TIME THEN PROCEED PAYMENT BUTTON ─── */}
      {currentStep === 'court_and_time' && (
        <div className="animate-in fade-in duration-200 space-y-6">
          {/* Header bar with Change Date button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 sm:px-6 shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep('date')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Change Date</span>
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Playing On</span>
                <span className="text-sm font-black text-slate-900">{selectedFormattedDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Active: <b className="text-blue-600">Court #{selectedCourt.courtNumber}</b> · {selectedCourtOpenSlotsCount} open slots
              </span>
            </div>
          </div>

          {/* 2-Column Grid: Left = Court Selector (Court #1 & #2) | Right = Time Slots */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT (5 cols): 2 Courts Selector */}
            <div className="lg:col-span-5 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    1. Select Court
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Choose Court #1 or Court #2
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  2 Courts Total
                </span>
              </div>

              <div className="space-y-3">
                {displayCourts.map((court) => {
                  const isSelected = selectedCourt.id === court.id;
                  const openSlotsCount = getCourtOpenSlotsCount(court.courtNumber, selectedDay, allSlotTimes, isCurrentSelectionToday, now);
                  const isCourtFullToday = openSlotsCount === 0;

                  return (
                    <button
                      type="button"
                      key={court.id}
                      disabled={isCourtFullToday}
                      onClick={() => handleSelectCourt(court)}
                      className={`w-full group relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all text-left touch-manipulation cursor-pointer ${
                        isCourtFullToday
                          ? 'border-slate-200 bg-slate-100/90 opacity-40 cursor-not-allowed select-none'
                          : isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 w-full">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-black ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 text-white'
                          }`}
                        >
                          Court #{court.courtNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCourtFullToday
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isCourtFullToday ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          {isCourtFullToday ? 'Full Today' : `${openSlotsCount} open`}
                        </span>
                      </div>

                      {/* Visual Court Graphic */}
                      <div
                        className={`relative w-full aspect-[16/8] rounded-xl overflow-hidden border p-1 flex items-center justify-center my-1 select-none ${
                          isCourtFullToday
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
                            fill={isCourtFullToday ? '#94a3b8' : isSelected ? '#3b82f6' : '#4a7ec2'}
                            stroke="#ffffff"
                            strokeWidth="1.2"
                          />
                          <rect
                            x="34"
                            y="2"
                            width="32"
                            height="60"
                            fill={isCourtFullToday ? '#64748b' : isSelected ? '#1d4ed8' : '#2e5d95'}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                          <line x1="2" y1="32" x2="34" y2="32" stroke="#ffffff" strokeWidth="1" />
                          <line x1="66" y1="32" x2="98" y2="32" stroke="#ffffff" strokeWidth="1" />
                          <line x1="50" y1="1" x2="50" y2="63" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="2 1" />
                        </svg>

                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-900/25">
                            <CheckCircle2 className="h-5 w-5 text-white stroke-[2.5]" />
                          </div>
                        )}
                      </div>

                      <div className="mt-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {court.name}
                          </span>
                          <span className="text-xs font-black text-slate-900 shrink-0 ml-2">
                            ₱{court.pricePerHour}/hr
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 capitalize truncate mt-0.5">
                          {court.type} · {court.surface}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT (7 cols): Time Slots Selector */}
            <div className="lg:col-span-7 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    2. Select Time Slots
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Court #{selectedCourt.courtNumber} · {selectedFormattedDate}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Click slot to toggle</span>
                </div>
              </div>

              {/* 2 Columns: Morning and Afternoon */}
              <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {/* Morning */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/70">
                    <Sun className="h-3.5 w-3.5 text-amber-600" />
                    <span>Morning</span>
                  </div>
                  {morningSlots.map((item) => {
                    const isSelected = selectedTimes.includes(item.time);
                    const isPassed = isTimeSlotPassedToday(item.time, isCurrentSelectionToday, now);
                    const isOccupied = !isPassed && isCourtOccupied(selectedCourt.courtNumber, selectedDay, item.time, false);
                    const isSlotDisabled = isPassed || isOccupied;

                    return (
                      <button
                        key={item.time}
                        type="button"
                        disabled={isSlotDisabled}
                        onClick={() => handleToggleTime(item.time)}
                        className={`w-full flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isPassed || isOccupied
                            ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-45 cursor-not-allowed line-through select-none'
                            : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs">{item.time}</span>
                          {isPassed ? (
                            <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase bg-slate-200 text-slate-500 no-underline">
                              PAST
                            </span>
                          ) : isOccupied ? (
                            <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase bg-slate-200 text-slate-500 no-underline">
                              FULL
                            </span>
                          ) : isSelected ? (
                            <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase bg-blue-800 text-white">
                              SELECTED
                            </span>
                          ) : null}
                        </div>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {isPassed ? 'Time passed' : isOccupied ? 'Occupied' : '1 hour session'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Afternoon */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200/70">
                    <Sunset className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Afternoon & Evening</span>
                  </div>
                  {afternoonSlots.map((item) => {
                    const isSelected = selectedTimes.includes(item.time);
                    const isPassed = isTimeSlotPassedToday(item.time, isCurrentSelectionToday, now);
                    const isOccupied = !isPassed && isCourtOccupied(selectedCourt.courtNumber, selectedDay, item.time, false);
                    const isSlotDisabled = isPassed || isOccupied;

                    return (
                      <button
                        key={item.time}
                        type="button"
                        disabled={isSlotDisabled}
                        onClick={() => handleToggleTime(item.time)}
                        className={`w-full flex flex-col items-start p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isPassed || isOccupied
                            ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-45 cursor-not-allowed line-through select-none'
                            : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                              : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs">{item.time}</span>
                          {isPassed ? (
                            <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase bg-slate-200 text-slate-500 no-underline">
                              PAST
                            </span>
                          ) : isOccupied ? (
                            <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase bg-slate-200 text-slate-500 no-underline">
                              FULL
                            </span>
                          ) : item.isPeak ? (
                            <span
                              className={`text-[8px] px-1 py-0.2 rounded font-black uppercase ${
                                isSelected ? 'bg-blue-800 text-blue-100' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              Peak
                            </span>
                          ) : null}
                        </div>
                        <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          {isPassed ? 'Time passed' : isOccupied ? 'Occupied' : '1 hour session'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── PROCEED PAYMENT BUTTON & SUMMARY BAR ──────────────── */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                      Court #{selectedCourt.courtNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="font-extrabold text-blue-600 text-xs sm:text-sm truncate">
                      {selectedTimes.length === 0
                        ? 'No times selected'
                        : selectedTimes.length === 1
                          ? selectedTimes[0]
                          : `${selectedTimes.length} time slots`}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 block truncate mt-0.5">
                    {selectedTimes.length === 0
                      ? 'Click slots above to pick hours'
                      : `₱${totalPrice} Total • ${selectedTimes.length} hr${selectedTimes.length > 1 ? 's' : ''}`}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!hasSelectedSlots}
                  onClick={handleProceedToPayment}
                  className={`rounded-xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer touch-manipulation ${
                    !hasSelectedSlots
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-98 shadow-blue-500/25'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {!hasSelectedSlots ? 'Select Time to Proceed' : `Proceed to Payment (₱${totalPrice})`}
                  </span>
                  {hasSelectedSlots && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Mobile Sticky Bar for Step 2 */}
          {hasSelectedSlots && (
            <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
              <div className="max-w-md mx-auto flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-xs text-slate-900">
                      Court #{selectedCourt.courtNumber}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-extrabold text-blue-600 truncate">
                      {selectedTimes.length} slot{selectedTimes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    ₱{totalPrice} total • {selectedFormattedDate}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all shrink-0 cursor-pointer touch-manipulation"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </section>
  );
};
