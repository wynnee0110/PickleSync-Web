'use client';

import React, { useState } from 'react';
import { Court, TimeSlot } from '@/types/booking';
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight, Sun, Sunset, CheckCircle2 } from 'lucide-react';
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

  // Base month starting from September 2025 (matching design)
  // Generates future months so users can only navigate forward to future months
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

  const [monthOffset, setMonthOffset] = useState(0); // 0 = current/base month (Sep)
  const currentMonthData = futureMonths[monthOffset] || futureMonths[0];
  const selectedMonth = currentMonthData.month;
  const selectedYear = currentMonthData.year;

  const [selectedDay, setSelectedDay] = useState(9); // Default selected day matching image (9)

  // Morning slots starting from 8:00 AM in 1-hour intervals
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

  // Selected Time Slots State (supports multi-selection highlight & toggle)
  const [selectedTimes, setSelectedTimes] = useState<string[]>(() => {
    const firstOpen = getFirstOpenSlotForCourt(selectedCourt.courtNumber, 9, allSlotTimes);
    return firstOpen ? [firstOpen] : ['08:00 AM'];
  });

  // Days in month logic
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay(); // 0 = Sunday

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

  // Safe day selection
  const handleSelectDay = (dayNum: number) => {
    if (isDateInPast(dayNum, monthOffset) || isDateFullyBooked(dayNum)) return;
    setSelectedDay(dayNum);

    // If currently selected court is fully booked on this new day, switch to first open court
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

    // Keep any selected times that are still open on this active court on this day
    setSelectedTimes((prev) => {
      const stillOpen = prev.filter((t) => !isCourtOccupied(activeCourt.courtNumber, dayNum, t));
      if (stillOpen.length > 0) return stillOpen;
      const firstOpen = getFirstOpenSlotForCourt(activeCourt.courtNumber, dayNum, allSlotTimes);
      return firstOpen ? [firstOpen] : [];
    });
  };

  // Court selection handler: clicking a court reveals its available times in the middle time card
  const handleSelectCourt = (court: Court) => {
    if (isCourtFullyBookedOnDate(court.courtNumber, selectedDay, allSlotTimes)) return;
    onSelectCourt(court);

    // Keep any selected times that are still available on the newly selected court
    setSelectedTimes((prev) => {
      const stillOpen = prev.filter((t) => !isCourtOccupied(court.courtNumber, selectedDay, t));
      if (stillOpen.length > 0) return stillOpen;
      const firstOpen = getFirstOpenSlotForCourt(court.courtNumber, selectedDay, allSlotTimes);
      return firstOpen ? [firstOpen] : [];
    });
  };

  // Multi-selection toggle for time slots: click to select, click again to undo/deselect
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

  // Helper to find slot object for court at selected time
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

  // Quick book handler using selected court and all chosen time slots
  const handleBookSelected = () => {
    if (selectedTimes.length === 0) return;
    const primarySlot = getSlotForCourt(selectedCourt, selectedTimes[0]);
    onSelectSlot(selectedCourt, primarySlot, selectedFormattedDate, selectedTimes);
  };

  return (
    <section id="court-schedule" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Centered Section Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-[#bef264] bg-[#f7fee7] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#3f6212] mb-3 shadow-xs">
          NEAREST AVAILABILITY
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight">
          Book a Court
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-500">
          Pick your preferred date and time slot to reserve your court session instantly
        </p>
      </div>

      {/* Centered 2 Cards Container: Left (Calendar) | Right (Time) */}
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6 max-w-4xl mx-auto">

        {/* CARD 1 (LEFT): CALENDAR CARD */}
        <div className="w-full md:w-[380px] shrink-0 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Select Date</h3>
              <p className="text-[10px] text-slate-500">Pick your reservation date</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </div>

          {/* Calendar Controls: Month Selector (Future Months) */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <button
              onClick={handlePrevMonth}
              disabled={monthOffset === 0}
              className={`p-2 rounded-xl transition-colors ${monthOffset === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                }`}
              aria-label="Previous Month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Month Dropdown Only (Future Months) */}
            <div className="relative">
              <select
                value={monthOffset}
                onChange={(e) => setMonthOffset(parseInt(e.target.value, 10))}
                aria-label="Month"
                className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-1.5 pr-8 text-sm font-bold text-slate-800 hover:border-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
              >
                {futureMonths.map((fm) => (
                  <option key={fm.offset} value={fm.offset}>
                    {fm.name}
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
              className={`p-2 rounded-xl transition-colors ${monthOffset >= futureMonths.length - 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100 cursor-pointer'
                }`}
              aria-label="Next Month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Days of the Week Header */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-slate-400 mb-2">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Monthly Dates Grid with Grayed-Out Full Dates */}
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 w-10" />
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
                  className={`h-10 w-10 rounded-xl flex flex-col items-center justify-center transition-all mx-auto ${isPast
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
              <div key={`next-month-${i}`} className="h-10 w-10 flex items-center justify-center text-slate-300 mx-auto">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Selected Date Summary & Availability Banner */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Selected Date</span>
              <span className="font-extrabold text-slate-900 text-sm">{selectedFormattedDate}</span>
            </div>
            {isSelectedDateFull ? (
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 border border-rose-200">
                Fully Booked
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                Open For Play
              </span>
            )}
          </div>
        </div>

        {/* CARD 2 (RIGHT): TIME CARD */}
        <div className="w-full md:w-[380px] shrink-0 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Select Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Available slots for {monthNames[selectedMonth]} {selectedDay}, {selectedYear}
              </p>
            </div>
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Clock className="h-4 w-4" />
            </div>
          </div>

          {/* Time Slots: 2 Columns (Morning & Afternoon) based on Selected Court */}
          <div className="grid grid-cols-2 gap-2.5 max-h-[310px] overflow-y-auto pr-1">
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
                    className={`w-full flex flex-col items-start px-2.5 py-1.5 rounded-xl transition-colors border text-left ${isOccupied
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-45 cursor-not-allowed line-through select-none'
                      : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold hover:bg-blue-700 cursor-pointer'
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
                    className={`w-full flex flex-col items-start px-2.5 py-1.5 rounded-xl transition-colors border text-left ${isOccupied
                      ? 'border-slate-200 bg-slate-100 text-slate-400 opacity-45 cursor-not-allowed line-through select-none'
                      : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-bold hover:bg-blue-700 cursor-pointer'
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
                <span className="font-extrabold text-blue-600 text-xs truncate">
                  {selectedTimes.length === 0
                    ? 'No time selected'
                    : selectedTimes.length === 1
                      ? selectedTimes[0]
                      : `${selectedTimes.length} times selected`}
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
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 ${!hasSelectedSlots
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8] active:scale-95 cursor-pointer shadow-sm'
                }`}
            >
              <span>{!hasSelectedSlots ? 'Select Time' : 'Book Now'}</span>
              {hasSelectedSlots && <ArrowUpRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
