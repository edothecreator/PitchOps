'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Calendar,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/standings', label: 'Standings', icon: BarChart3 },
  { href: '/matches', label: 'Matches', icon: Calendar },
  { href: '/statistics', label: 'Statistics', icon: TrendingUp },
] as const;

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'flex flex-col w-60 shrink-0 bg-surface border-r border-white/5 min-h-screen',
        className
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10">
          <Activity className="w-4 h-4 text-accent" strokeWidth={2.5} />
        </div>
        <span className="text-white font-semibold tracking-tight text-[15px]">
          PitchOps
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold tracking-widest uppercase text-white/25 select-none">
          Platform
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0',
                  isActive ? 'text-accent' : 'text-white/40'
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[11px] text-white/20 leading-relaxed">
          Data via API-Football
          <br />
          <span className="tabular-nums">2024/25 Season</span>
        </p>
      </div>
    </aside>
  );
}
