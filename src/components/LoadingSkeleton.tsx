import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  const pulse = "animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/50";
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center space-y-5 py-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-indigo-500/20 dark:bg-indigo-400/20 blur-xl animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50 shadow-xl overflow-hidden p-[2px]">
             {/* Conic spinner border */}
             <div className="absolute inset-[-150%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_70%,#6366f1_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_70%,#818cf8_100%)]" />
             <div className="absolute inset-[2px] rounded-xl bg-slate-50 dark:bg-slate-900" />
             <Loader2 className="relative z-10 h-7 w-7 text-indigo-600 dark:text-indigo-400 animate-[spin_1s_linear_infinite_reverse]" />
          </div>
        </div>
        <div className="space-y-2 text-center max-w-[280px]">
          <h3 className="text-[17px] font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Analyzing Channel Data
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Crunching performance metrics and training AI insights...
          </p>
        </div>
      </div>

      {/* Channel summary card skeleton */}
      <div className="w-full rounded-3xl overflow-hidden ring-1 ring-slate-200/50 dark:ring-slate-800/80 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-slate-200/80 dark:bg-slate-800/80 h-32 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-6 -mt-10 mb-6 relative z-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-800/80 space-y-3">
              <div className={`${pulse} h-10 w-10 rounded-xl`} />
              <div className="space-y-2 pt-2">
                <div className={`${pulse} h-3 w-16`} />
                <div className={`${pulse} h-7 w-24`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart skeleton */}
        <div className="lg:col-span-2 rounded-3xl bg-white/80 dark:bg-slate-900/80 ring-1 ring-slate-200/50 dark:ring-slate-800/80 shadow-sm p-7 space-y-6 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className={`${pulse} h-5 w-48`} />
            <div className={`${pulse} h-8 w-24 rounded-full`} />
          </div>
          <div className="flex flex-col gap-4 pt-4">
            {[85, 70, 55, 40, 25].map((w, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`${pulse} h-3 w-36`} />
                <div className={`${pulse} h-8 rounded-md`} style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional card skeleton */}
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 ring-1 ring-slate-200/50 dark:ring-slate-800/80 shadow-sm p-7 space-y-6 backdrop-blur-sm">
           <div className={`${pulse} h-5 w-32`} />
           <div className="space-y-4 pt-2">
             {Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="flex items-center gap-3">
                 <div className={`${pulse} h-10 w-10 rounded-full shrink-0`} />
                 <div className="space-y-2 flex-1">
                   <div className={`${pulse} h-3 w-3/4`} />
                   <div className={`${pulse} h-3 w-1/2`} />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 ring-1 ring-slate-200/50 dark:ring-slate-800/80 shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 dark:border-slate-800/50">
          <div className="space-y-2">
            <div className={`${pulse} h-5 w-32`} />
            <div className={`${pulse} h-3 w-56`} />
          </div>
          <div className={`${pulse} h-10 w-40 rounded-xl`} />
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-5 px-7 py-5">
              <div className={`${pulse} h-16 w-32 shrink-0 rounded-xl`} />
              <div className="flex-1 space-y-3">
                <div className={`${pulse} h-4 w-3/4`} />
                <div className={`${pulse} h-3 w-1/3`} />
              </div>
              <div className="hidden md:block">
                <div className={`${pulse} h-5 w-20`} />
              </div>
              <div className={`${pulse} h-8 w-24 rounded-full`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
