import React from 'react';
import { Download } from 'lucide-react';
import { TimeframeOption } from './types';

interface AdminSubheaderProps {
  title?: string;
  subtitle?: string;
  lastRefreshed: string;
  timeframe: TimeframeOption;
  onChangeTimeframe: (timeframe: TimeframeOption) => void;
  onExportCSV: () => void;
}

export function AdminSubheader({
  title = 'Dashboard',
  subtitle,
  lastRefreshed,
  timeframe,
  onChangeTimeframe,
  onExportCSV,
}: AdminSubheaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">{title}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e] animate-pulse" />
            Live Sync
          </span>
        </div>
        <p className="text-xs text-[#5f6368] mt-1">
          {subtitle ||
            `Real-time on-site court occupancy, booking revenue, and member activity · Updated ${lastRefreshed}`}
        </p>
      </div>

      {/* Timeframe pill selector & Export */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="inline-flex rounded-full bg-[#eef2f6] p-0.5 border border-[#dadce0]">
          {(['Today', 'This week', 'This month'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChangeTimeframe(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-white text-[#1f1f1f] shadow-sm font-semibold'
                  : 'text-[#5f6368] hover:text-[#1f1f1f]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dadce0] bg-white text-xs font-medium text-[#444746] hover:bg-[#f8fafd] transition-colors shadow-sm cursor-pointer"
        >
          <Download className="h-3.5 w-3.5 text-[#5f6368]" />
          Export CSV
        </button>
      </div>
    </div>
  );
}
