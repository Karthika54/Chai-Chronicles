'use client';

import React, { useState } from 'react';
import { getChaiFact, type GetChaiFactOutput } from '@/ai/flows/chai-facts-generator';
import { SNACKS } from '@/lib/consts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CircleDashed, ScrollText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Historian({ onNewFact }: { onNewFact: (p: GetChaiFactOutput) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('Chai');
  const [currentFact, setCurrentFact] = useState<GetChaiFactOutput | null>(null);
  const { toast } = useToast();

  const handleReveal = async () => {
    if (!topic) {
        toast({
            title: "No Topic Selected",
            description: "Please select a topic to unearth a fact.",
            variant: "destructive",
        });
        return;
    }
    setIsLoading(true);
    setCurrentFact(null);
    try {
      const result = await getChaiFact({ topic });
      setCurrentFact(result);
      onNewFact(result);
    } catch (error) {
      console.error("Failed to get fact:", error);
      toast({
        title: "The Historian is Stumped",
        description: "Could not retrieve a fact. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const factTopics = ['Chai', ...SNACKS.map(s => s.name)];

  return (
    <section id="historian">
      <Card className="bg-card/50 backdrop-blur-sm text-center">
        <CardHeader>
          <div className="flex items-center justify-center gap-4">
            <ScrollText className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl">Chai Historian</CardTitle>
              <CardDescription>What ancient secrets will you uncover?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Select onValueChange={setTopic} defaultValue={topic}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a topic..." />
                    </SelectTrigger>
                    <SelectContent>
                        {factTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button onClick={handleReveal} disabled={isLoading} size="lg" className="font-bold flex-shrink-0 bg-primary/90 text-primary-foreground hover:bg-primary">
                    {isLoading ? (
                    <>
                        <CircleDashed className="mr-2 h-4 w-4 animate-spin" />
                        Unearthing...
                    </>
                    ) : "Unearth a Fact"}
                </Button>
            </div>
          
          {currentFact && (
            <div className="mt-6 p-4 bg-amber-100/50 dark:bg-amber-900/20 rounded-lg max-w-2xl mx-auto">
                <blockquote className="border-l-4 border-amber-500 dark:border-amber-400 pl-4 italic text-amber-900 dark:text-amber-100">
                    {currentFact.fact}
                </blockquote>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
