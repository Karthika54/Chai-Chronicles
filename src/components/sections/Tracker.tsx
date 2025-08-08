'use client';

import type { ChaiBreak } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, Award, Zap } from 'lucide-react';

const processChartData = (breaks: ChaiBreak[]) => {
  const breaksByDay: { [key: string]: number } = {};
  breaks.forEach(b => {
    const day = new Date(b.timestamp).toLocaleDateString('en-CA'); // YYYY-MM-DD
    breaksByDay[day] = (breaksByDay[day] || 0) + 1;
  });

  // Get last 7 days
  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayKey = d.toLocaleDateString('en-CA');
    chartData.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      breaks: breaksByDay[dayKey] || 0,
    });
  }
  return chartData;
};

const calculateLongestStreak = (breaks: ChaiBreak[]) => {
    if (breaks.length === 0) return 0;

    const breakDays = [...new Set(breaks.map(b => new Date(b.timestamp).toDateString()))]
      .map(d => new Date(d))
      .sort((a,b) => a.getTime() - b.getTime());

    if (breakDays.length === 0) return 0;
    
    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < breakDays.length; i++) {
        const diff = (breakDays[i].getTime() - breakDays[i-1].getTime()) / (1000 * 3600 * 24);
        if (diff === 1) {
            currentStreak++;
        } else {
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
        }
    }
    return Math.max(longestStreak, currentStreak);
};


export function Tracker({ breaks }: { breaks: ChaiBreak[] }) {
  const chartData = useMemo(() => processChartData(breaks), [breaks]);
  const longestStreak = useMemo(() => calculateLongestStreak(breaks), [breaks]);
  const [intensityScore, setIntensityScore] = useState<number | null>(null);

  useEffect(() => {
    // Generate a random score once on component mount, only on client
    setIntensityScore(Math.floor(Math.random() * 100) + 1);
  }, []);

  const chartConfig = {
    breaks: {
      label: 'Breaks',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <section id="tracker">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
           <div className="flex items-center gap-4">
            <TrendingUp className="w-8 h-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-3xl">Chai Streak Tracker</CardTitle>
                <CardDescription>Meaningless yet delightful stats.</CardDescription>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
            <div className="p-4 bg-accent/10 rounded-lg">
                <Award className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{longestStreak}</p>
                <p className="text-sm text-muted-foreground">Longest Streak (days)</p>
            </div>
             <div className="p-4 bg-accent/10 rounded-lg">
                <Zap className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{intensityScore ?? '...'}</p>
                <p className="text-sm text-muted-foreground">Weekly Chai Intensity Score</p>
            </div>
             <div className="p-4 bg-accent/10 rounded-lg">
                <p className="text-2xl font-bold">{breaks.length}</p>
                <p className="text-sm text-muted-foreground">Total Breaks Logged</p>
            </div>
          </div>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="breaks" fill="var(--color-breaks)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
