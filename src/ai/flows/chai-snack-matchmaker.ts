'use server';

/**
 * @fileOverview An AI agent for suggesting chai snacks from a user-provided menu.
 *
 * - suggestChaiSnack - A function that suggests a snack based on mood, budget, and a custom snack menu.
 * - SuggestChaiSnackInput - The input type for the suggestChaiSnack function.
 * - SuggestChaiSnackOutput - The return type for the suggestChaiSnack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChaiSnackInputSchema = z.object({
  mood: z.string().describe('The user\'s current mood or preference.'),
  budget: z.number().describe('The user\'s maximum budget for a snack.'),
  menu: z.string().describe('A string containing a list of available snacks and their prices, provided by the user.'),
});
export type SuggestChaiSnackInput = z.infer<typeof SuggestChaiSnackInputSchema>;

const SuggestChaiSnackOutputSchema = z.object({
  snackName: z.string().describe('The name of the suggested snack. If no snack fits, this should be "Imaginary Paratha".'),
  snackPersonality: z.string().describe('A quirky, one-sentence personality for the snack.'),
  chaiSynergyScore: z.number().describe('A nonsensical score from 1-100 representing how well the snack pairs with chai.'),
  snackAffordabilityAura: z.string().describe('A whimsical name for the affordability level (e.g., "Frugal Feast", "Opulent Nibble").'),
});
export type SuggestChaiSnackOutput = z.infer<typeof SuggestChaiSnackOutputSchema>;


export async function suggestChaiSnack(input: SuggestChaiSnackInput): Promise<SuggestChaiSnackOutput> {
  return chaiSnackMatchmakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chaiSnackMatchmakerPrompt',
  input: {schema: SuggestChaiSnackInputSchema},
  output: {schema: SuggestChaiSnackOutputSchema},
  prompt: `You are the Chai Snack Matchmaker. Your task is to suggest the perfect chai-time snack from the user-provided list below based on their mood and budget.

Available Snacks Menu (provided by the user):
{{{menu}}}

User's Mood/Preferences: {{{mood}}}
User's Budget: {{{budget}}}

1.  Analyze the provided snack menu and their prices.
2.  Filter the snacks to find ones that are within the user's budget.
3.  From the affordable snacks, choose the one that best matches the user's mood/preferences.
4.  If no snacks fit the budget or mood, you MUST suggest "Imaginary Paratha".
5.  Generate a quirky "Snack Personality" for the chosen snack.
6.  Create a nonsensical "Chai Synergy Score" between 1 and 100.
7.  Assign a "Snack Affordability Aura" based on the budget (e.g., <10: "Thrifty Treat", <20: "Frugal Feast", >=20: "Opulent Nibble").

Return ONLY the final suggestion in the specified output format.`,
});

const chaiSnackMatchmakerFlow = ai.defineFlow(
  {
    name: 'chaiSnackMatchmakerFlow',
    inputSchema: SuggestChaiSnackInputSchema,
    outputSchema: SuggestChaiSnackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
