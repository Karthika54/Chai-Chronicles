'use client';

import type { ChaiBreak } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wind } from 'lucide-react';

export function Vibe({ latestBreak }: { latestBreak?: ChaiBreak }) {
  if (!latestBreak) {
    return (
        <section id="vibe" className="text-center">
            <Card className="bg-card/50 backdrop-blur-sm inline-block">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Wind className="w-8 h-8 text-primary" />
                        <div>
                        <CardTitle className="font-headline text-3xl">Chai Vibe</CardTitle>
                         <CardDescription>Log a break to generate the current vibe!</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </section>
    );
  }

  return (
    <section id="vibe" className="text-center">
      <Card className="bg-card/50 backdrop-blur-sm inline-block animate-fade-in">
        <CardHeader>
          <div className="flex items-center gap-4">
             <Wind className="w-8 h-8 text-primary" />
             <div>
                <CardTitle className="font-headline text-3xl">{latestBreak.vibe.name}</CardTitle>
                <CardDescription>Latest generated vibe</CardDescription>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic text-accent-foreground/80">"{latestBreak.vibe.description}"</p>
        </CardContent>
      </Card>
    </section>
  );
}
