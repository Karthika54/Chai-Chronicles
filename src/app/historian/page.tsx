
'use client';

import { Historian as HistorianSection } from '@/components/sections/Historian';
import { useChaiData } from '@/context/ChaiDataContext';

export default function HistorianPage() {
  const { handleNewFact } = useChaiData();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <HistorianSection onNewFact={handleNewFact} />
    </div>
  );
}
