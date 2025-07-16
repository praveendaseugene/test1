'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest use cases for a detected object.
 *
 * - suggestUseCases - A function that suggests use cases for a detected object.
 * - SuggestUseCasesInput - The input type for the suggestUseCases function.
 * - SuggestUseCasesOutput - The return type for the suggestUseCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUseCasesInputSchema = z.object({
  objectName: z.string().describe('The name of the detected object.'),
});
export type SuggestUseCasesInput = z.infer<typeof SuggestUseCasesInputSchema>;

const SuggestUseCasesOutputSchema = z.object({
  useCases: z.array(z.string()).describe('An array of suggested use cases for the detected object.'),
});
export type SuggestUseCasesOutput = z.infer<typeof SuggestUseCasesOutputSchema>;

export async function suggestUseCases(input: SuggestUseCasesInput): Promise<SuggestUseCasesOutput> {
  return suggestUseCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUseCasesPrompt',
  input: {schema: SuggestUseCasesInputSchema},
  output: {schema: SuggestUseCasesOutputSchema},
  prompt: `You are an AI assistant that suggests use cases for detected objects.

  Suggest at least 3 use cases for the following object:
  Object Name: {{{objectName}}}
  `,
});

const suggestUseCasesFlow = ai.defineFlow(
  {
    name: 'suggestUseCasesFlow',
    inputSchema: SuggestUseCasesInputSchema,
    outputSchema: SuggestUseCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
