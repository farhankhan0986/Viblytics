import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row h-14 items-center justify-between gap-2 px-4 md:px-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-linear-to-br from-indigo-600 to-violet-600">
            <BarChart3 className="h-3 w-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-medium text-slate-600 dark:text-slate-300">Viblytics</span>
          <span>·</span>
          <span>YouTube competitor intelligence for modern teams</span>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">Powered by YouTube Data API v3</span>
      </div>
    </footer>
  );
}
