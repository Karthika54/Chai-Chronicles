'use client';

import { BADGES } from '@/lib/badges';
import type { ChaiBreak, GetChaiFactOutput } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AchievementsProps {
  breaks: ChaiBreak[];
  facts: GetChaiFactOutput[];
}

export function Achievements({ breaks, facts }: AchievementsProps) {
  const unlockedBadges = BADGES.filter(badge => badge.isUnlocked(breaks, facts));
  const lockedBadges = BADGES.filter(badge => !badge.isUnlocked(breaks, facts));

  return (
    <section id="achievements">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Achievements</CardTitle>
              <CardDescription>Milestones on your epic chai journey.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {BADGES.length > 0 ? (
            <TooltipProvider>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[...unlockedBadges, ...lockedBadges].map(badge => (
                  <Tooltip key={badge.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          'flex flex-col items-center justify-center p-4 rounded-lg aspect-square transition-all',
                          badge.isUnlocked(breaks, facts)
                            ? 'bg-primary/20 border-2 border-primary'
                            : 'bg-muted/50 border border-dashed'
                        )}
                      >
                        <badge.icon
                          className={cn(
                            'w-12 h-12 mb-2',
                            badge.isUnlocked(breaks, facts) ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                        <p
                          className={cn(
                            'font-bold text-center text-sm',
                            badge.isUnlocked(breaks, facts) ? 'text-primary-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {badge.name}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{badge.description}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Achievements are coming soon. Keep sipping!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
