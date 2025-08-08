
'use client';

import { Leaderboard } from '@/components/sections/Leaderboard';
import { Tracker } from '@/components/sections/Tracker';
import { Vibe } from '@/components/sections/Vibe';
import { useChaiData } from '@/context/ChaiDataContext';

export default function DashboardPage() {
  const { chaiBreaks } = useChaiData();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 space-y-16 md:space-y-24">
      <Vibe latestBreak={chaiBreaks[0]} />
      <Tracker breaks={chaiBreaks} />
      <Leaderboard breaks={chaiBreaks} />
    </div>
  );
}
