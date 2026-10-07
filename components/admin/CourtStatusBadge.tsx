import React from 'react';

export function CourtStatusBadge({
  status,
  onClick,
}: {
  status: string;
  onClick?: () => void;
}) {
  const configs: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    available: { label: 'Available', bg: 'bg-[#e6f4ea]', text: 'text-[#137333]', dot: 'bg-[#1e8e3e]' },
    in_play: { label: 'In Play', bg: 'bg-[#fef7e0]', text: 'text-[#b06000]', dot: 'bg-[#ea8600]' },
    reserved: { label: 'Reserved', bg: 'bg-[#e8f0fe]', text: 'text-[#1967d2]', dot: 'bg-[#1a73e8]' },
    maintenance: { label: 'Maintenance', bg: 'bg-[#fce8e6]', text: 'text-[#c5221f]', dot: 'bg-[#d93025]' },
  };

  const c = configs[status] || configs.available;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-opacity ${c.bg} ${c.text} ${onClick ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </button>
  );
}

export function BookingStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; bg: string; text: string }> = {
    confirmed: { label: 'Confirmed', bg: 'bg-[#e6f4ea]', text: 'text-[#137333]' },
    pending: { label: 'Pending', bg: 'bg-[#fef7e0]', text: 'text-[#b06000]' },
    cancelled: { label: 'Cancelled', bg: 'bg-[#fce8e6]', text: 'text-[#c5221f]' },
  };
  const c = configs[status] || configs.confirmed;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
