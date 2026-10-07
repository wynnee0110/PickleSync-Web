'use client';

import React, { useState } from 'react';
import { Court, TimeSlot } from '@/types/booking';
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight, Sun, Sunset, CheckCircle2, MapPin, Calendar } from 'lucide-react';
import {
  isDateFullyBooked,
  isCourtOccupied,
  isDateInPast,
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

export const CourtScheduleSection: React.FC<CourtScheduleSectionProps> = ({
  courts,
  selectedCourt,
  onSelectCourt,
  onSelectSlot,
}) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Base month starting from September 2025
  const BASE_MONTH = 8; // September
  const BASE_YEAR = 2025;

  const futureMonths = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(BASE_YEAR, BASE_MONTH + i, 1);
    return {
      offset: i,
      month: date.getMonth(),
      year: date.getFullYear(),
      name: monthNames[date.getMonth()],
    };
  });

  const [monthOffset, setMonthOffset] = useState(0);
  const currentMonthData = futureMonths[monthOffset] || futureMonths[0];
  const selectedMonth = currentMonthData.month;
  const selectedYear = currentMonthData.year;

  const [selectedDay, setSelectedDay] = useState(9);

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
  const displayCourts = courts.slice(0, 9);

  // Selected Time Slots State
  const [selectedTimes, setSelectedTimes] = useState<string[]>(() => {
    const firstOpen = getFirstOpenSlotForCourt(selectedCourt.courtNumber, 9, allSlotTimes);
    return firstOpen ? [firstOpen] : ['08:00 AM'];
  });

  // Days in month logic
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (monthOffset > 0) {
      setMonthOffset((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (monthOffset < futureMonths.length - 1) {
      setMonthOffset((prev) => prev + 1);
    }
  };

  const handleSelectDay = (dayNum: number) => {
    if (isDateInPast(dayNum, monthOffset) || isDateFullyBooked(dayNum)) return;
    setSelectedDay(dayNum);

    let activeCourt = selectedCourt;
    if (isCourtFullyBookedOnDate(selectedCourt.courtNumber, dayNum, allSlotTimes)) {
      const firstOpenCourt = displayCourts.find(
        (c) => !isCourtFullyBookedOnDate(c.courtNumber, dayNum, allSlotTimes)
      );
      if (firstOpenCourt) {
        activeCourt = firstOpenCourt;
        onSelectCourt(firstOpenCourt);
      }
    }

    setSelectedTimes((prev) => {
      const stillOpen = prev.filter((t) => !isCourtOccupied(activeCourt.courtNumber, dayNum, t));
      if (stillOpen.length > 0) return stillOpen;
      const firstOpen = getFirstOpenSlotForCourt(activeCourt.courtNumber, dayNum, allSlotTimes);
      return firstOpen ? [firstOpen] : [];
    });
  };

  const handleSelectCourt = (court: Court) => {
    if (isCourtFullyBookedOnDate(court.courtNumber, selectedDay, allSlotTimes)) return;
    onSelectCourt(court);

    setSelectedTimes((prev) => {
      const stillOpen = prev.filter((t) => !isCourtOccupied(court.courtNumber, selectedDay, t));
      if (stillOpen.length > 0) return stillOpen;
      const firstOpen = getFirstOpenSlotForCourt(court.courtNumber, selectedDay, allSlotTimes);
      return firstOpen ? [firstOpen] : [];
    });
  };

  const handleToggleTime = (timeString: string) => {
    if (isCourtOccupied(selectedCourt.courtNumber, selectedDay, timeString)) return;

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
  const selectedCourtOpenSlotsCount = getCourtOpenSlotsCount(selectedCourt.courtNumber, selectedDay, allSlotTimes);

  const getSlotForCourt = (court: Court, timeString: string): TimeSlot => {
    const isOccupied = isCourtOccupied(court.courtNumber, selectedDay, timeString);
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

  const handleBookSelected = () => {
    if (selectedTimes.length === 0) return;
    const primarySlot = getSlotForCourt(selectedCourt, selectedTimes[0]);
    onSelectSlot(selectedCourt, primarySlot, selectedFormattedDate, selectedTimes);
  };

  // Scroll helper for mobile anchor buttons
  const scrollToCard = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="court-schedule" className="py-6 sm:py-14 lg:py-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-28 lg:pb-20">
      {/* Centered Section Header */}
      <div className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto px-2">
        <div className="inline-flex items-center rounded-full border border-[#bef264] bg-[#f7fee7] px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#3f6212] mb-2 sm:mb-3 shadow-xs">
          NEAREST AVAILABILITY
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
          Select Date, Time & Court
        </h2>
        <p className="mt-1 sm:mt-2 text-xs sm:text-base text-slate-500">
          Pick your preferred day on the calendar, choose your time slots, and reserve instantly
        </p>
      </div>

      {/* Mobile Quick Stepper Pill (Jump straight to any step on phone) */}
      <div className="lg:hidden mb-4 flex items-center justify-center gap-1.5 px-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => scrollToCard('card-date')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-bold text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
        >
          <Calendar className="h-3 w-3 text-slate-500" />
          <span>{monthNames[selectedMonth]} {selectedDay}</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToCard('card-time')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-bold text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
        >
          <Clock className="h-3 w-3 text-blue-600" />
          <span>{selectedTimes.length === 0 ? 'Pick Time' : `${selectedTimes.length} slot${selectedTimes.length > 1 ? 's' : ''}`}</span>
        </button>

        <button
          type="button"
          onClick={() => scrollToCard('card-court')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-[11px] font-bold text-slate-700 hover:bg-slate-50 shrink-0 cursor-pointer"
        >
          <MapPin className="h-3 w-3 text-[#4d7c0f]" />
          <span>Court #{selectedCourt.courtNumber}</span>
        </button>
      </div>

      {/* 3 Cards Container: Left (Calendar) | Middle (Time) | Right (Courts) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-center gap-4 sm:gap-6 max-w-6xl mx-auto">

        {/* CARD 1 (LEFT): CALENDAR CARD */}
        <div id="card-date" className="w-full lg:w-[360px] xl:w-[370px] lg:shrink-0 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm scroll-mt-20">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Select Date</h3>
              <p className="text-[10px] sm:text-xs text-slate-500">Pick your reservation date</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-slate-600">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </div>

          {/* Calendar Controls: Month Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 sm:mb-4">
            <button
              onClick={handlePrevMonth}
              disabled={monthOffset === 0}
              className={`p-2 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${monthOffset === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                }`}
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Month Dropdown */}
            <div className="relative">
              <select
                value={monthOffset}
                onChange={(e) => setMonthOffset(parseInt(e.target.value, 10))}
                aria-label="Month"
                className="appearance-none rounded-xl border border-slate-200 bg-white px-3 sm:px-4 py-1.5 pr-8 text-xs sm:text-sm font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                {futureMonths.map((fm) => (
                  <option key={fm.offset} value={fm.offset}>
                    {fm.name} {fm.year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              disabled={monthOffset >= futureMonths.length - 1}
              className={`p-2 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${monthOffset >= futureMonths.length - 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                }`}
              aria-label="Next Month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Days of the Week Header */}
          <div className="grid grid-cols-7 text-center text-[11px] sm:text-xs font-semibold text-slate-400 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Monthly Dates Grid with Fluid Responsive Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs sm:text-sm font-semibold">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square w-full max-w-[42px] mx-auto" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const isPast = isDateInPast(dayNum, monthOffset);
              const isFull = isDateFullyBooked(dayNum);
              const isSelected = selectedDay === dayNum;
              const isInRange = !isPast && dayNum >= 10 && dayNum <= 12;
              const isDisabled = isPast || isFull;

              return (
                <button
                  key={`day-${dayNum}`}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) handleSelectDay(dayNum);
                  }}
                  title={isPast ? `Date has passed (Day ${dayNum})` : isFull ? `Day ${dayNum} is fully booked` : `Select day ${dayNum}`}
                  className={`aspect-square w-full max-w-[42px] max-h-[42px] min-h-[34px] sm:min-h-[40px] rounded-lg sm:rounded-xl flex flex-col items-center justify-center transition-all mx-auto touch-manipulation ${isPast
                    ? 'text-slate-300 opacity-40 cursor-not-allowed line-through select-none hover:bg-transparent'
                    : isFull
                      ? 'bg-slate-100/80 text-slate-300 line-through cursor-not-allowed border border-dashed border-slate-200 select-none'
                      : isSelected
                        ? 'bg-slate-900 text-white font-black shadow-xs cursor-pointer'
                        : isInRange
                          ? 'bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 cursor-pointer'
                          : 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                    }`}
                >
                  <span className="leading-none">{dayNum}</span>
                  {isFull && !isPast && <span className="text-[7px] font-black text-rose-400 -mt-0.5 no-underline">FULL</span>}
                </button>
              );
            })}

            {/* Trailing days preview from next month */}
            {Array.from({ length: (7 - ((firstDayOfWeek + daysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`next-month-${i}`} className="aspect-square w-full max-w-[42px] flex items-center justify-center text-slate-300 mx-auto text-[11px] sm:text-xs">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Selected Date Summary & Availability Banner */}
          <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] sm:text-[10px] uppercase font-bold">Selected Date</span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{selectedFormattedDate}</span>
            </div>
            {isSelectedDateFull ? (
              <span className="rounded-full bg-rose-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-rose-700 border border-rose-200">
                Fully Booked
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-bold text-emerald-700 border border-emerald-200">
                Open For Play
              </span>
            )}
          </div>
        </div>

        {/* CARD 2 (MIDDLE): TIME CARD */}
        <div id="card-time" className="w-full lg:w-[350px] lg:shrink-0 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm scroll-mt-20">
          {/* Header */}
          <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Select Time
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                Slots for {selectedFormattedDate}
              </p>
            </div>
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Mobile Quick Court Switcher (Horizontal Chips) */}
          <div className="lg:hidden mb-3 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="font-bold text-slate-700">Active Court:</span>
              <span className="text-[11px] text-blue-600 font-bold">
                Court #{selectedCourt.courtNumber} · {selectedCourtOpenSlotsCount} open
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
              {displayCourts.map((c) => {
                const isSelected = selectedCourt.id === c.id;
                const openCount = getCourtOpenSlotsCount(c.courtNumber, selectedDay, allSlotTimes);
                const isFull = openCount === 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => handleSelectCourt(c)}
                    className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all touch-manipulation cursor-pointer ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>C#{c.courtNumber}</span>
                    <span className={`text-[9px] px-1 py-0.2 rounded font-black ${
                      isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isFull ? '0' : openCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots: 2 Columns */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-h-[340px] sm:max-h-[310px] overflow-y-auto pr-0.5 sm:pr-1">
            {/* Morning Column */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/70 mb-1">
                <Sun className="h-3 w-3 text-amber-600" />
                <span>Morning</span>
              </div>
              {morningSlots.map((item) => {
                const isSelected = selectedTimes.includes(item.time);
                const isOccupied = isCourtOccupied(selectedCourt.courtNumber, selectedDay, item.time);

                return (
                  <button
                    key={item.time}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => handleToggleTime(item.time)}
                    title={
                      isOccupied
                        ? `Court #${selectedCourt.courtNumber} is occupied at ${item.time}`
                        : `Select ${item.time} for Court #${selectedCourt.courtNumber}`
                    }
                    className={`w-full flex flex-col items-start px-2 sm:px-2.5 py-2 sm:py-1.5 rounded-xl transition-colors border text-left touch-manipulation ${isOccupied
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-45 cursor-not-allowed line-through select-none'
                      : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold hover:bg-blue-700 cursor-pointer shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs leading-none">{item.time}</span>
                      {isOccupied && (
                        <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase tracking-wider bg-slate-200 text-slate-500 no-underline">
                          FULL
                        </span>
                      )}
                    </div>
                    <span className={`text-[9px] mt-1 ${isOccupied ? 'text-slate-400' : isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {isOccupied ? 'Booked' : `${item.duration} session`}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Afternoon Column */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-800 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200/70 mb-1">
                <Sunset className="h-3 w-3 text-indigo-600" />
                <span>Afternoon</span>
              </div>
              {afternoonSlots.map((item) => {
                const isSelected = selectedTimes.includes(item.time);
                const isOccupied = isCourtOccupied(selectedCourt.courtNumber, selectedDay, item.time);

                return (
                  <button
                    key={item.time}
                    type="button"
                    disabled={isOccupied}
                    onClick={() => handleToggleTime(item.time)}
                    title={
                      isOccupied
                        ? `Court #${selectedCourt.courtNumber} is occupied at ${item.time}`
                        : `Select ${item.time} for Court #${selectedCourt.courtNumber}`
                    }
                    className={`w-full flex flex-col items-start px-2 sm:px-2.5 py-2 sm:py-1.5 rounded-xl transition-colors border text-left touch-manipulation ${isOccupied
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-45 cursor-not-allowed line-through select-none'
                      : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold hover:bg-blue-700 cursor-pointer shadow-xs'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-pointer'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-bold text-xs leading-none">{item.time}</span>
                      {isOccupied ? (
                        <span className="text-[8px] px-1 py-0.2 rounded font-black uppercase tracking-wider bg-slate-200 text-slate-500 no-underline">
                          FULL
                        </span>
                      ) : item.isPeak ? (
                        <span
                          className={`text-[8px] px-1 py-0.2 rounded font-black uppercase tracking-wider ${isSelected ? 'bg-blue-800 text-blue-100' : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          Peak
                        </span>
                      ) : null}
                    </div>
                    <span className={`text-[9px] mt-1 ${isOccupied ? 'text-slate-400' : isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {isOccupied ? 'Booked' : `${item.duration} session`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Time Footer Banner with Prominent Book Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <div className="min-w-0">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-extrabold text-slate-900 text-xs truncate">
                  Court #{selectedCourt.courtNumber}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-extrabold text-blue-600 text-xs truncate">
                  {selectedTimes.length === 0
                    ? 'No time selected'
                    : selectedTimes.length === 1
                      ? selectedTimes[0]
                      : `${selectedTimes.length} times`}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                {selectedTimes.length === 0
                  ? 'Click slots to pick'
                  : `₱${totalPrice} total • ${selectedTimes.length} hr${selectedTimes.length > 1 ? 's' : ''}`}
              </span>
            </div>

            <button
              type="button"
              disabled={!hasSelectedSlots}
              onClick={handleBookSelected}
              className={`rounded-xl px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 touch-manipulation ${!hasSelectedSlots
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-95 cursor-pointer shadow-sm'
                }`}
            >
              <span>{!hasSelectedSlots ? 'Pick Time' : `Book C#${selectedCourt.courtNumber}`}</span>
              {hasSelectedSlots && <ArrowUpRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* CARD 3 (RIGHT): 3x3 COURT CARD */}
        <div id="card-court" className="w-full lg:w-[380px] lg:shrink-0 rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm scroll-mt-20">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                3×3 Courts
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate max-w-[170px]">
                Click court to view available times
              </p>
            </div>

            <div className="flex items-center gap-2 text-[9px] sm:text-[10px]">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Open
              </span>
              <span className="flex items-center gap-1 text-slate-500 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Full
              </span>
            </div>
          </div>

          {/* 3x3 Grid of 9 Courts */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {displayCourts.map((court) => {
              const isSelected = selectedCourt.id === court.id;
              const openSlotsCount = getCourtOpenSlotsCount(court.courtNumber, selectedDay, allSlotTimes);
              const isCourtFullToday = openSlotsCount === 0;

              return (
                <button
                  type="button"
                  key={court.id}
                  disabled={isCourtFullToday}
                  onClick={() => {
                    if (!isCourtFullToday) {
                      handleSelectCourt(court);
                    }
                  }}
                  title={
                    isCourtFullToday
                      ? `Court #${court.courtNumber} is fully booked on this date`
                      : `Select Court #${court.courtNumber} (${openSlotsCount} slots open)`
                  }
                  className={`group relative flex flex-col justify-between rounded-xl border p-1 sm:p-1.5 transition-all text-left touch-manipulation ${isCourtFullToday
                    ? 'border-slate-200 bg-slate-100/90 opacity-40 cursor-not-allowed select-none'
                    : isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600 shadow-xs cursor-pointer'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 cursor-pointer'
                    }`}
                >
                  {/* Top: Court Badge & Status Dot */}
                  <div className="flex items-center justify-between mb-0.5 w-full">
                    <span
                      className={`px-1 py-0.2 rounded text-[8px] sm:text-[9px] font-black ${isCourtFullToday
                        ? 'bg-slate-400 text-slate-100'
                        : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-white'
                        }`}
                    >
                      #{court.courtNumber}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${isCourtFullToday ? 'bg-slate-400' : 'bg-emerald-500'
                        }`}
                      title={isCourtFullToday ? 'Fully Booked Today' : `${openSlotsCount} open slots`}
                    />
                  </div>

                  {/* Visual Mini Top-Down Court Graphic */}
                  <div
                    className={`relative w-full aspect-[16/10] rounded overflow-hidden border p-0.5 flex items-center justify-center my-0.5 select-none ${isCourtFullToday
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
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-900/30">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Court Info */}
                  <div className="mt-0.5 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-900 truncate leading-tight">
                        C{court.courtNumber}
                      </span>
                      <span className="text-[8px] font-black text-slate-900">
                        ₱{court.pricePerHour}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-slate-500">
                      <span className="truncate">
                        {court.type === 'indoor' ? 'In' : court.type === 'championship' ? 'Pro' : 'Deck'}
                      </span>
                      <span className={isCourtFullToday ? 'text-rose-500 font-bold' : 'text-emerald-600 font-bold'}>
                        {isCourtFullToday ? 'Full' : `${openSlotsCount} open`}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Bar for Selected Court Summary */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
            <div className="min-w-0">
              <span className="font-black text-xs text-slate-900 block truncate">
                Court #{selectedCourt.courtNumber} • {selectedCourt.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {selectedCourtOpenSlotsCount} slots open on this date
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Base Rate</span>
              <span className="text-xs font-black text-slate-900">₱{selectedCourt.pricePerHour}/hr</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Booking Bar */}
      {hasSelectedSlots && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm text-slate-900">
                  Court #{selectedCourt.courtNumber}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-extrabold text-blue-600 truncate">
                  {selectedTimes.length} slot{selectedTimes.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                ₱{totalPrice} total • {selectedFormattedDate}
              </p>
            </div>

            <button
              type="button"
              onClick={handleBookSelected}
              className="flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-[#2563eb] text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-95 transition-all shrink-0 cursor-pointer touch-manipulation"
            >
              <span>Book Court</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
