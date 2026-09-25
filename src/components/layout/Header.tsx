'use client';

import { usePathname } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { formatFullDate } from '@/lib/utils';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/':           { title: 'Overview',    subtitle: 'Season highlights · top 5 leagues + UCL + Europa League' },
  '/standings':  { title: 'Standings',   subtitle: 'Full league tables · 2010–2024 seasons' },
  '/matches':    { title: 'Matches',     subtitle: 'Results, events, lineups & head-to-head' },
  '/statistics': { title: 'Statistics',  subtitle: 'Scorers, assists, cards & team analytics' },
};

function getPageMeta(pathname: string) {
  for (const [key, value] of Object.entries(PAGE_TITLES)) {
    if (key === '/' ? pathname === '/' : pathname.startsWith(key)) return value;
  }
  return { title: 'PitchOps', subtitle: '' };
}

export function Header() {
  const pathname = usePathname();
  const qc = useQueryClient();
  const { title, subtitle } = getPageMeta(pathname);
  const today = formatFullDate(new Date().toISOString());

  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-white/5 bg-surface shrink-0">
      <div>
        <h1 className="text-white font-semibold text-[15px] leading-none">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[12px] text-white/35 leading-none">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-[12px] text-white/30 tabular-nums">{today}</span>
        <button
          onClick={() => void qc.invalidateQueries()}
          title="Refresh all data"
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium',
            'text-white/40 hover:text-white/70 hover:bg-white/5',
            'border border-white/5 hover:border-white/10 transition-colors duration-150'
          )}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
    </header>
  );
}
