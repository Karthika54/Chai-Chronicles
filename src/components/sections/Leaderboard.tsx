'use client';

import type { ChaiBreak } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMemo } from 'react';
import { Users } from 'lucide-react';

const getTitle = (rank: number) => {
  if (rank === 1) return '🥇 Chai Sultan';
  if (rank === 2) return '🥈 Samosa Sidekick';
  if (rank === 3) return '🥉 Biscuit Baron';
  return ' Chai Chum';
};

export function Leaderboard({ breaks }: { breaks: ChaiBreak[] }) {
  const leaderboardData = useMemo(() => {
    const friendCounts = new Map<string, number>();
    breaks.forEach(b => {
      b.attendees.forEach(friend => {
        const friendName = friend.trim();
        if (friendName) {
            friendCounts.set(friendName, (friendCounts.get(friendName) || 0) + 1);
        }
      });
    });

    return Array.from(friendCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [breaks]);

  return (
    <section id="leaderboard">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-3xl">Friend Leaderboard</CardTitle>
                <CardDescription>Who is the ultimate chai connoisseur?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {leaderboardData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Friend Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="text-right">Chai Breaks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((friend, index) => (
                <TableRow key={friend.name}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{friend.name}</TableCell>
                  <TableCell>{getTitle(index + 1)}</TableCell>
                  <TableCell className="text-right">{friend.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
             <div className="text-center py-8 text-muted-foreground">
              <p>No friends logged yet. Time to invite someone for chai!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
