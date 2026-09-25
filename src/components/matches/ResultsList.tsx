'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFixtures } from '@/hooks/useFixtures';
import { FixtureCardSkeleton, ErrorState, EmptyState } from '@/components/ui';
import { FixtureCard } from './FixtureCard';
import { cn } from '@/lib/utils';
import type { Fixture } from '@/lib/api/types';

const PAGE_SIZE = 8;

interface ResultsListProps {
  leagueId?: number;
  season?: number;
  onSelectFixture?: (fixture: Fixture) => void;
  selectedFixtureId?: number;
}

export function ResultsList({ leagueId, season, onSelectFixture, selectedFixtureId }: ResultsListProps) {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError, refetch } = useFixtures({
    league: leagueId,
    season,
    // Free plan: fetch whole season, paginate client-side
  });

  const allFixtures = data?.fixtures ?? [];
  const totalPages  = Math.ceil(allFixtures.length / PAGE_SIZE);
  const fixtures    = allFixtures.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (isLoading) return (
    <div className="space-y-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => <FixtureCardSkeleton key={i} />)}
    </div>
  );
  if (isError) return <ErrorState message="Could not load results." onRetry={() => void refetch()} />;
  if (!allFixtures.length) return <EmptyState message="No results found for this selection." />;

  return (
    <div className="space-y-3">
      {fixtures.map((f) => (
        <FixtureCard
          key={f.id}
          fixture={f}
          onSelect={onSelectFixture}
          selected={selectedFixtureId === f.id}
        />
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-white/8 transition-colors duration-150',
              page === 0 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white/80 hover:border-white/15'
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <span className="text-[12px] tabular-nums text-white/25">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border border-white/8 transition-colors duration-150',
              page >= totalPages - 1 ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-white/80 hover:border-white/15'
            )}
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
