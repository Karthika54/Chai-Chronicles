
'use client';

import { Hero } from '@/components/sections/Hero';
import { useChaiData } from '@/context/ChaiDataContext';

export default function Home() {
    const { showBounce } = useChaiData();
    return <Hero showBounce={showBounce} />;
}
