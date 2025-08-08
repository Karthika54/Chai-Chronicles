'use server';

/**
 * @fileOverview An AI agent for generating "ancient" facts about chai and snacks.
 *
 * - getChaiFact - A function that returns a fun, historical fact about a given topic.
 * - GetChaiFactInput - The input type for the getChaiFact function.
 * - GetChaiFactOutput - The return type for the getChaiFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetChaiFactInputSchema = z.object({
  topic: z.string().describe('The topic for the fact, e.g., "Chai", "Samosa".'),
});
export type GetChaiFactInput = z.infer<typeof GetChaiFactInputSchema>;

const GetChaiFactOutputSchema = z.object({
  fact: z.string().describe('A fun, creative, and possibly exaggerated "ancient" fact about the topic.'),
});
export type GetChaiFactOutput = z.infer<typeof GetChaiFactOutputSchema>;

export async function getChaiFact(input: GetChaiFactInput): Promise<GetChaiFactOutput> {
  return chaiFactGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chaiFactGeneratorPrompt',
  input: {schema: GetChaiFactInputSchema},
  output: {schema: GetChaiFactOutputSchema},
  prompt: `You are the Chai Historian, a whimsical expert in the ancient and possibly fabricated history of tea and snacks.

Generate a single, fun, and creative "ancient fact" about the origin of the following topic: {{{topic}}}.

The fact should be entertaining and sound vaguely plausible but can be entirely made up. Think of it as a fun piece of trivia for a tea enthusiast.`,
});

const chaiFactGeneratorFlow = ai.defineFlow(
  {
    name: 'chaiFactGeneratorFlow',
    inputSchema: GetChaiFactInputSchema,
    outputSchema: GetChaiFactOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
