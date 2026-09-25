'use client';

import { usePrediction } from '@/hooks/useFixtureDetail';
import { Card, CardHeader, CardTitle, CardBody, TeamLogo, Skeleton, ErrorState, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/utils';

const COMPARISON_LABELS: Record<string, string> = {
  form: 'Form', att: 'Attack', def: 'Defense',
  h2h: 'H2H', goals: 'Goals', total: 'Overall',
};

interface PredictionCardProps {
  fixtureId: number;
  homeTeam: { id: number; name: string; logo: string };
  awayTeam: { id: number; name: string; logo: string };
}

export function PredictionCard({ fixtureId, homeTeam, awayTeam }: PredictionCardProps) {
  const { data, isLoading, isError, refetch } = usePrediction(fixtureId);

  if (isLoading) return (
    <Card><CardHeader><Skeleton className="h-4 w-28" /></CardHeader>
      <CardBody className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8 w-full rounded" />)}
      </CardBody>
    </Card>
  );
  if (isError || !data) return (
    <Card><ErrorState message="Could not load prediction." onRetry={() => void refetch()} className="py-6" /></Card>
  );

  const { predictions: p, comparison } = data;
  const homePercent = parseInt(p.percent.home);
  const drawPercent = parseInt(p.percent.draw);
  const awayPercent = parseInt(p.percent.away);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Prediction</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        {/* Win probability bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <TeamLogo src={homeTeam.logo} alt={homeTeam.name} size={16} />
              <span className="text-[12px] text-white/60">{homeTeam.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-white/60">{awayTeam.name}</span>
              <TeamLogo src={awayTeam.logo} alt={awayTeam.name} size={16} />
            </div>
          </div>
          <div className="flex h-3 rounded-full overflow-hidden gap-px">
            <div className="bg-accent transition-all duration-500" style={{ width: `${homePercent}%` }} title={`Home ${homePercent}%`} />
            <div className="bg-white/20 transition-all duration-500" style={{ width: `${drawPercent}%` }} title={`Draw ${drawPercent}%`} />
            <div className="bg-accent-blue transition-all duration-500" style={{ width: `${awayPercent}%` }} title={`Away ${awayPercent}%`} />
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] tabular-nums text-accent font-medium">{p.percent.home}</span>
            <span className="text-[11px] tabular-nums text-white/30">Draw {p.percent.draw}</span>
            <span className="text-[11px] tabular-nums text-accent-blue font-medium">{p.percent.away}</span>
          </div>
        </div>

        {/* Advice */}
        <div className="px-3 py-2.5 rounded-lg bg-accent/5 border border-accent/15">
          <p className="text-[12px] text-accent font-medium">{p.advice}</p>
        </div>

        {/* Comparison bars */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">Team Comparison</p>
          {Object.entries(comparison)
            .filter(([k]) => k !== 'poisson_distribution')
            .map(([key, val]) => {
              const h = parseInt((val as { home: string }).home);
              const a = parseInt((val as { away: string }).away);
              return (
                <ProgressBar
                  key={key}
                  value={h} valueB={a}
                  colorA="bg-accent" colorB="bg-accent-blue"
                  label={COMPARISON_LABELS[key] ?? key}
                  showValues={false}
                />
              );
            })}
        </div>
      </CardBody>
    </Card>
  );
}
