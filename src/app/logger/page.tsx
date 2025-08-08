
'use client';

import { Logger as LoggerSection } from '@/components/sections/Logger';
import { useChaiData } from '@/context/ChaiDataContext';

export default function LoggerPage() {
  const { handleLogBreak } = useChaiData();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <LoggerSection onLogBreak={handleLogBreak} />
    </div>
  );
}
