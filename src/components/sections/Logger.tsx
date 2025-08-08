
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ChaiBreak } from '@/lib/types';
import { generateChaiVibe } from '@/ai/flows/chai-vibe-generator';
import { suggestChaiSnack, type SuggestChaiSnackOutput } from '@/ai/flows/chai-snack-matchmaker';
import { SNACKS } from '@/lib/consts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CircleDashed, UtensilsCrossed, Star } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  attendees: z.string().min(1, 'At least one person must be present!'),
  description: z.string().optional(),
  snack: z.string().min(1, 'A snack must be chosen!'),
  budget: z.preprocess(
    (a) => (a === '' ? undefined : a),
    z.number({ coerce: true }).optional()
  ),
  rating: z.number().min(1).max(5).optional(),
});

const SnackMatchmaker = ({ onSnackSelect }: { onSnackSelect: (snack: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestChaiSnackOutput | null>(null);
  const [mood, setMood] = useState('');
  const [budget, setBudget] = useState('');
  const [menu, setMenu] = useState('');
  const { toast } = useToast();

  const handleMatchmaking = async () => {
    const numBudget = parseFloat(budget);
    if (!mood || !menu) {
      toast({
        title: "Missing Information",
        description: "Please enter your preferences and the snack menu!",
        variant: "destructive",
      });
      return;
    }
     if (isNaN(numBudget) || numBudget <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid budget!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const suggestion = await suggestChaiSnack({ mood, budget: numBudget, menu });
      setResult(suggestion);
      onSnackSelect(suggestion.snackName);
    } catch (error) {
      console.error("Failed to get snack suggestion:", error);
      toast({
        title: "The Oracle is Busy",
        description: "The Snack Matchmaker is contemplating the universe... please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-4">
      <Card className="bg-accent/10">
        <CardHeader>
          <CardTitle className="text-lg font-headline">Chai Snack Matchmaker</CardTitle>
          <CardDescription>Let destiny (and AI) pick your perfect chai companion.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-1 gap-4 mb-4">
              <Textarea 
                placeholder="Enter the snack menu, e.g., Samosa - 15, Pakora - 20"
                value={menu}
                onChange={(e) => setMenu(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
             <Input 
                placeholder="What are your preferences? (e.g. 'spicy', 'sweet')" 
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                disabled={isLoading}
             />
             <Input 
                type="number" 
                placeholder="Max budget (₹)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                disabled={isLoading}
             />
          </div>
          <Button onClick={handleMatchmaking} disabled={isLoading} className="w-full">
            {isLoading && <CircleDashed className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Analyzing Chai Vibes...' : 'Find My Snack!'}
          </Button>

          {result && !isLoading && (
             <div className="mt-4 p-4 bg-background rounded-lg text-center">
                <p className="text-xs font-bold text-primary">{result.snackAffordabilityAura}</p>
                <p className="font-bold text-xl text-primary">{result.snackName}</p>
                <p className="text-sm italic">"{result.snackPersonality}"</p>
                {result.snackName !== 'Imaginary Paratha' && (
                  <p className="text-sm mt-2">Chai Synergy Score: <span className="font-bold">{result.chaiSynergyScore}%</span></p>
                )}
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


export function Logger({ onLogBreak }: { onLogBreak: (breakData: Omit<ChaiBreak, 'id'>) => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedSnack, setSuggestedSnack] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendees: '',
      description: '',
      snack: '',
      budget: 0,
      rating: 3,
    },
  });
  
  const rating = form.watch('rating');

  const handleSnackSelect = (snackName: string) => {
    if (snackName) {
      setSuggestedSnack(snackName);
      form.setValue('snack', snackName);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const timestamp = new Date();
      const vibe = await generateChaiVibe({ timestamp: timestamp.toISOString() });
      const newBreak: Omit<ChaiBreak, 'id'> = {
        timestamp,
        attendees: values.attendees.split(',').map(s => s.trim()),
        description: values.description || '',
        snack: values.snack,
        budget: values.budget,
        rating: values.rating,
        vibe: {
          name: vibe.vibeName,
          description: vibe.vibeDescription,
        },
      };
      onLogBreak(newBreak);
      form.reset();
      setSuggestedSnack(null); // Clear suggested snack after logging
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to log chai break:", error);
      toast({
        title: "Error",
        description: "Could not log chai break. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const snackOptions = [...new Set([...SNACKS.map(s => s.name), "Other", suggestedSnack].filter(Boolean) as string[])];

  return (
    <section id="logger">
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
           <div className="flex items-center gap-4">
             <UtensilsCrossed className="w-8 h-8 text-primary" />
             <div>
              <CardTitle className="font-headline text-3xl">Log a Chai Break</CardTitle>
              <CardDescription>Document your glorious moment of procrastination.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="attendees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Who’s here?</FormLabel>
                      <FormControl>
                        <Input placeholder="Alice, Bob, Carol (comma-separated)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your chai</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Cardamom bliss at Priya’s stall" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="snack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Snack Choice (or let the matchmaker decide)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a snack or let AI choose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {snackOptions.map(snack => (
                            <SelectItem key={snack} value={snack}>
                              {snack}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget (₹, optional)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate the experience ({rating} / 5 stars)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Slider 
                            defaultValue={[3]} 
                            min={1} 
                            max={5} 
                            step={1} 
                            onValueChange={(value) => field.onChange(value[0])}
                           />
                           <div className="flex">
                           {[1,2,3,4,5].map(i => <Star key={i} className={`w-6 h-6 ${i <= (rating || 0) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />)}
                           </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              
              <SnackMatchmaker 
                onSnackSelect={handleSnackSelect}
              />

              <Button type="submit" size="lg" className="w-full font-bold" disabled={isSubmitting}>
                 {isSubmitting && <CircleDashed className="mr-2 h-4 w-4 animate-spin" />}
                Log it!
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
