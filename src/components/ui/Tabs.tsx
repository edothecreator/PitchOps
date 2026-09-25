'use client';

import { cn } from '@/lib/utils';

// ─── Simple controlled Tabs ───────────────────────────────────────────────────

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  className,
  size = 'md',
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-lg border border-white/8 bg-white/[0.03] p-0.5',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
              size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-[12px]',
              isActive
                ? 'bg-surface text-white shadow-sm border border-white/8'
                : 'text-white/40 hover:text-white/65'
            )}
          >
            {item.icon}
            {item.label}
            {item.badge !== undefined && (
              <span
                className={cn(
                  'min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold inline-flex items-center justify-center tabular-nums',
                  isActive
                    ? 'bg-accent/15 text-accent'
                    : 'bg-white/8 text-white/35'
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Underline-style tabs (for page-level sections) ──────────────────────────

interface UnderlineTabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function UnderlineTabs<T extends string = string>({
  items,
  value,
  onChange,
  className,
}: UnderlineTabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 border-b border-white/8',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none',
              isActive ? 'text-white' : 'text-white/40 hover:text-white/65',
              'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:rounded-t-full after:transition-opacity after:duration-150',
              isActive ? 'after:bg-accent after:opacity-100' : 'after:opacity-0'
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
