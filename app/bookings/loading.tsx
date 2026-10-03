import { Skeleton } from '../../components/ui/Skeleton';

export default function BookingsLoading() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-5 w-72 rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 p-5 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-56 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
