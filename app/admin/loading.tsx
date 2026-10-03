import { Skeleton } from '../../components/ui/Skeleton';

export default function AdminLoading() {
  return (
    <div className="flex h-screen bg-[#f8fafd] text-[#1f1f1f]">
      {/* Sidebar skeleton */}
      <div className="w-64 flex-shrink-0 border-r border-[#e0e2ec] bg-white p-4 space-y-4 flex flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="h-8 w-8 rounded-lg bg-[#eef2f6]" />
          <Skeleton className="h-5 w-28 rounded-md bg-[#eef2f6]" />
        </div>

        {/* FAB Button */}
        <Skeleton className="h-12 w-40 rounded-2xl bg-[#e3eefc]" />

        {/* Navigation items */}
        <div className="space-y-1.5 pt-2 flex-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-full bg-[#f0f4f9]" />
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-[#e0e2ec]">
          <Skeleton className="h-9 w-full rounded-full bg-[#f0f4f9]" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar skeleton */}
        <div className="h-16 border-b border-[#e0e2ec] bg-white px-6 flex items-center justify-between">
          <Skeleton className="h-10 w-96 rounded-full bg-[#f0f4f9]" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full bg-[#f0f4f9]" />
            <Skeleton className="h-9 w-9 rounded-full bg-[#f0f4f9]" />
            <Skeleton className="h-9 w-9 rounded-full bg-[#d3e3fd]" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-8 space-y-6 overflow-y-auto">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48 rounded-lg bg-[#e2e7ec]" />
              <Skeleton className="h-4 w-72 rounded-md bg-[#eef2f6]" />
            </div>
            <Skeleton className="h-9 w-32 rounded-full bg-[#eef2f6]" />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl border border-[#dadce0] bg-white p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-8 rounded-full bg-[#eef2f6]" />
                  <Skeleton className="h-5 w-14 rounded-full bg-[#eef2f6]" />
                </div>
                <Skeleton className="h-7 w-28 rounded-md bg-[#e2e7ec]" />
                <Skeleton className="h-3.5 w-36 rounded-md bg-[#eef2f6]" />
              </div>
            ))}
          </div>

          {/* Chart + panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 h-72 rounded-2xl border border-[#dadce0] bg-white p-6 space-y-4">
              <Skeleton className="h-5 w-36 rounded-md bg-[#e2e7ec]" />
              <Skeleton className="h-48 w-full rounded-xl bg-[#f0f4f9]" />
            </div>
            <div className="h-72 rounded-2xl border border-[#dadce0] bg-white p-6 space-y-4">
              <Skeleton className="h-5 w-28 rounded-md bg-[#e2e7ec]" />
              <Skeleton className="h-48 w-full rounded-xl bg-[#f0f4f9]" />
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="h-80 rounded-2xl border border-[#dadce0] bg-white p-5 space-y-3">
              <Skeleton className="h-5 w-36 rounded-md bg-[#e2e7ec]" />
              <Skeleton className="h-60 w-full rounded-xl bg-[#f0f4f9]" />
            </div>
            <div className="h-80 rounded-2xl border border-[#dadce0] bg-white p-5 space-y-3">
              <Skeleton className="h-5 w-36 rounded-md bg-[#e2e7ec]" />
              <Skeleton className="h-60 w-full rounded-xl bg-[#f0f4f9]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
