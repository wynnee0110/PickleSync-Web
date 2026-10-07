import React from 'react';
import { X } from 'lucide-react';
import { Court } from '@/types/booking';
import { CourtStatus } from '../types';

interface CourtStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court | null;
  onUpdateStatus: (status: CourtStatus) => void;
}

export function CourtStatusModal({
  isOpen,
  onClose,
  court,
  onUpdateStatus,
}: CourtStatusModalProps) {
  if (!isOpen || !court) return null;

  const statusOptions: {
    status: CourtStatus;
    label: string;
    desc: string;
    dot: string;
  }[] = [
    {
      status: 'available',
      label: 'Available',
      desc: 'Court is open for public reservations',
      dot: 'bg-[#1e8e3e]',
    },
    {
      status: 'in_play',
      label: 'In Play',
      desc: 'Players are currently on court',
      dot: 'bg-[#ea8600]',
    },
    {
      status: 'reserved',
      label: 'Reserved',
      desc: 'Booked for an upcoming slot',
      dot: 'bg-[#1a73e8]',
    },
    {
      status: 'maintenance',
      label: 'Maintenance',
      desc: 'Court closed for cleaning or repairs',
      dot: 'bg-[#d93025]',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#202124]/40 backdrop-blur-[1px] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white border border-[#dadce0] shadow-[0_4px_24px_rgba(60,64,67,0.2)] p-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f3f4]">
          <div>
            <h3 className="text-sm font-semibold text-[#1f1f1f]">Change Court Status</h3>
            <p className="text-xs text-[#5f6368]">{court.name}</p>
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

        <div className="pt-4 space-y-2">
          {statusOptions.map((opt) => (
            <button
              key={opt.status}
              type="button"
              onClick={() => onUpdateStatus(opt.status)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                court.status === opt.status
                  ? 'border-[#0b57d0] bg-[#e8f0fe]/60'
                  : 'border-[#dadce0] hover:bg-[#f8fafd]'
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full mt-1 flex-shrink-0 ${opt.dot}`} />
              <div>
                <span className="text-xs font-semibold text-[#1f1f1f]">{opt.label}</span>
                <p className="text-[11px] text-[#5f6368] mt-0.5">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4 mt-2 flex justify-end border-t border-[#f1f3f4]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-[#444746] hover:bg-[#f1f3f4] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
