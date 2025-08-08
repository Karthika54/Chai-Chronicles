
'use client';

import { Achievements as AchievementsSection } from '@/components/sections/Achievements';
import { useChaiData } from '@/context/ChaiDataContext';

export default function AchievementsPage() {
  const { chaiBreaks, facts } = useChaiData();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <AchievementsSection breaks={chaiBreaks} facts={facts} />
    </div>
  );
}
