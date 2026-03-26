import { BarChart3 } from "lucide-react";
import { BiLogoYoutube } from 'react-icons/bi';
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row h-14 items-center justify-between gap-2 px-4 md:px-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <div className="relative flex items-center justify-center">
              <Image
                src="/icon.svg"
                alt="Viblytics Logo"
                width={20}
                height={20}
                className="relative z-10"
              />
            </div>

            <span className="font-medium text-slate-600 dark:text-slate-300">Viblytics</span>
            <span>·</span>
            <span>YouTube competitor intelligence for modern teams</span>
          </div>
        </div>

        <span className="text-xs flex items-center gap-2 justify-center  text-slate-400 dark:text-slate-500">
          <BiLogoYoutube className="h-4 w-4 text-red-500" />Powered by YouTube Data API v3</span>
      </div>
    </footer>
  );
}
