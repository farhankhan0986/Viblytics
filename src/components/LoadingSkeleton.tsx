export function LoadingSkeleton() {
  const pulse = "animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800";
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Channel summary card skeleton */}
      <div className="w-full rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm">
        <div className="bg-slate-200 dark:bg-slate-800 h-28 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mx-6 -mt-8 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-md ring-1 ring-slate-100 dark:ring-slate-800 space-y-3">
              <div className={`${pulse} h-9 w-9`} />
              <div className={`${pulse} h-3 w-20`} />
              <div className={`${pulse} h-6 w-16`} />
            </div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm p-6 space-y-4">
        <div className={`${pulse} h-4 w-48`} />
        <div className="flex flex-col gap-3 pt-2">
          {[80, 65, 50, 38, 25].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`${pulse} h-3 w-32`} />
              <div className={`${pulse} h-6 rounded`} style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className={`${pulse} h-4 w-28`} />
            <div className={`${pulse} h-3 w-48`} />
          </div>
          <div className={`${pulse} h-10 w-32`} />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className={`${pulse} h-14 w-24 shrink-0`} />
              <div className="flex-1 space-y-2">
                <div className={`${pulse} h-3.5 w-3/4`} />
                <div className={`${pulse} h-3 w-1/3`} />
              </div>
              <div className={`${pulse} h-4 w-14`} />
              <div className={`${pulse} h-4 w-10`} />
              <div className={`${pulse} h-4 w-10`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
