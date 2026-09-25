'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/standings', label: 'Standings', icon: BarChart3 },
  { href: '/matches', label: 'Matches', icon: Calendar },
  { href: '/statistics', label: 'Stats', icon: TrendingUp },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-white/5 bg-surface md:hidden">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === '/' ? pathname === '/' : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 py-3',
              'text-[10px] font-medium transition-colors duration-150',
              isActive ? 'text-accent' : 'text-white/35 hover:text-white/60'
            )}
          >
            <Icon
              className={cn(
                'w-5 h-5',
                isActive ? 'text-accent' : 'text-white/35'
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
