import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Court } from '@/types/booking';
import { ReservationFormData } from '../types';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courts: Court[];
  defaultCourtId?: string;
  onSubmit: (data: ReservationFormData) => void;
}

export function NewReservationModal({
  isOpen,
  onClose,
  courts,
  defaultCourtId,
  onSubmit,
}: NewReservationModalProps) {
  const [formCourtId, setFormCourtId] = useState('');
  const [formPlayerName, setFormPlayerName] = useState('');
  const [formTimeSlot, setFormTimeSlot] = useState('06:00 PM');
  const [formDate, setFormDate] = useState('Sep 9, 2025');
  const [formDuration, setFormDuration] = useState('60');

  if (!isOpen) return null;

  const effectiveCourtId = formCourtId || defaultCourtId || courts[0]?.id || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPlayerName.trim()) return;

    onSubmit({
      courtId: effectiveCourtId,
      playerName: formPlayerName.trim(),
      timeSlot: formTimeSlot,
      date: formDate,
      duration: formDuration,
    });

    setFormPlayerName('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202124]/40 backdrop-blur-[1px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_24px_rgba(60,64,67,0.2)] p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f3f4]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#c2e7ff] text-[#001d35] flex items-center justify-center">
              <Plus className="h-4 w-4 stroke-[3]" />
            </div>
            <h3 className="text-base font-semibold text-[#1f1f1f]">New Court Reservation</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5f6368] hover:bg-[#f1f3f4] rounded-full cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="pt-4 space-y-4">
          {/* Player Name */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1">Player Name</label>
            <input
              type="text"
              required
              value={formPlayerName}
              onChange={(e) => setFormPlayerName(e.target.value)}
              placeholder="e.g. Marcus Lopez"
              className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0]"
            />
          </div>

          {/* Court Selection */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1">Court</label>
            <select
              value={effectiveCourtId}
              onChange={(e) => setFormCourtId(e.target.value)}
              className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] bg-white cursor-pointer"
            >
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  Court #{c.courtNumber} · {c.name} (₱{c.pricePerHour}/hr)
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#444746] mb-1">Date</label>
              <select
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] bg-white cursor-pointer"
              >
                <option value="Sep 9, 2025">Sep 9, 2025 (Today)</option>
                <option value="Sep 10, 2025">Sep 10, 2025 (Tomorrow)</option>
                <option value="Sep 11, 2025">Sep 11, 2025</option>
                <option value="Sep 12, 2025">Sep 12, 2025</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#444746] mb-1">Time Slot</label>
              <select
                value={formTimeSlot}
                onChange={(e) => setFormTimeSlot(e.target.value)}
                className="w-full rounded-xl border border-[#dadce0] px-3 py-2 text-sm text-[#1f1f1f] outline-none focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] bg-white cursor-pointer"
              >
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="07:00 PM">07:00 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1">Duration</label>
            <div className="grid grid-cols-3 gap-2">
              {['60', '90', '120'].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setFormDuration(dur)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    formDuration === dur
                      ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0] font-semibold'
                      : 'border-[#dadce0] text-[#444746] hover:bg-[#f8fafd]'
                  }`}
                >
                  {dur} mins
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#f1f3f4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#0b57d0] text-white hover:bg-[#0842a0] transition-colors shadow-sm cursor-pointer"
            >
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
