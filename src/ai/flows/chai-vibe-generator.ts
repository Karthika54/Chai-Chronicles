'use server';

/**
 * @fileOverview A chai vibe generator AI agent.
 *
 * - generateChaiVibe - A function that handles the chai vibe generation process.
 * - GenerateChaiVibeInput - The input type for the generateChaiVibe function.
 * - GenerateChaiVibeOutput - The return type for the generateChaiVibe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChaiVibeInputSchema = z.object({
  timestamp: z.string().describe('The timestamp of the chai break.'),
});
export type GenerateChaiVibeInput = z.infer<typeof GenerateChaiVibeInputSchema>;

const GenerateChaiVibeOutputSchema = z.object({
  vibeName: z.string().describe('The name of the chai vibe.'),
  vibeDescription: z.string().describe('The description of the chai vibe.'),
});
export type GenerateChaiVibeOutput = z.infer<typeof GenerateChaiVibeOutputSchema>;

export async function generateChaiVibe(input: GenerateChaiVibeInput): Promise<GenerateChaiVibeOutput> {
  return generateChaiVibeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChaiVibePrompt',
  input: {schema: GenerateChaiVibeInputSchema},
  output: {schema: GenerateChaiVibeOutputSchema},
  prompt: `You are a chai vibe generator. Given the timestamp of a chai break, you will generate a random chai vibe name and description.

Timestamp: {{{timestamp}}}

Consider the timestamp when creating the vibe; for example, a morning chai might have a different vibe than an evening chai.`,
});

const generateChaiVibeFlow = ai.defineFlow(
  {
    name: 'generateChaiVibeFlow',
    inputSchema: GenerateChaiVibeInputSchema,
    outputSchema: GenerateChaiVibeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
