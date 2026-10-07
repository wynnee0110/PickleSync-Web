import React from 'react';
import Link from 'next/link';
import { Plus, Download, CalendarCheck, Settings } from 'lucide-react';

interface AdminQuickActionsSectionProps {
  onNewBooking: () => void;
  onExportCSV: () => void;
  onOpenSettings?: () => void;
}

export function AdminQuickActionsSection({
  onNewBooking,
  onExportCSV,
  onOpenSettings,
}: AdminQuickActionsSectionProps) {
  const actions = [
    {
      label: 'Add Reservation',
      icon: Plus,
      action: onNewBooking,
      bg: 'hover:bg-[#e8f0fe] text-[#0b57d0]',
    },
    {
      label: 'Download CSV Report',
      icon: Download,
      action: onExportCSV,
      bg: 'hover:bg-[#e6f4ea] text-[#137333]',
    },
    {
      label: 'View Booking Page',
      icon: CalendarCheck,
      href: '/book',
      bg: 'hover:bg-[#fef7e0] text-[#b06000]',
    },
    {
      label: 'Club Settings',
      icon: Settings,
      action: onOpenSettings,
      bg: 'hover:bg-[#f3e8fd] text-[#7c3aed]',
    },
  ];

  return (
    <section aria-label="Quick Actions" className="bg-white rounded-2xl border border-[#dadce0] p-5 shadow-[0_1px_2px_rgba(60,64,67,0.06)]">
      <h2 className="text-sm font-semibold text-[#1f1f1f] mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((item) => {
          const Icon = item.icon;
          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#dadce0] bg-white transition-all text-center cursor-pointer ${item.bg}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium text-[#1f1f1f]">{item.label}</span>
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[#dadce0] bg-white transition-all text-center cursor-pointer ${item.bg}`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium text-[#1f1f1f]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
