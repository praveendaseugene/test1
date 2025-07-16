// 'use server';
/**
 * @fileOverview Provides real-time visual analysis using the device's camera.
 *
 * - analyzeVisuals - Analyzes the real-time visual data from the camera.
 * - AnalyzeVisualsInput - Input type for the analyzeVisuals function.
 * - AnalyzeVisualsOutput - Output type for the analyzeVisuals function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeVisualsInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo captured from the device camera as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type AnalyzeVisualsInput = z.infer<typeof AnalyzeVisualsInputSchema>;

const AnalyzeVisualsOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the visual scene.'),
});
export type AnalyzeVisualsOutput = z.infer<typeof AnalyzeVisualsOutputSchema>;

export async function analyzeVisuals(input: AnalyzeVisualsInput): Promise<AnalyzeVisualsOutput> {
  return analyzeVisualsFlow(input);
}

const analyzeVisualsPrompt = ai.definePrompt({
  name: 'analyzeVisualsPrompt',
  input: {schema: AnalyzeVisualsInputSchema},
  output: {schema: AnalyzeVisualsOutputSchema},
  prompt: `You are an AI visual analysis expert providing real-time scene understanding.

  Analyze the scene captured in the following image and provide a detailed description of what the camera sees. Describe objects, environment conditions, and any notable details.

  Image: {{media url=photoDataUri}}
  `,
});

const analyzeVisualsFlow = ai.defineFlow(
  {
    name: 'analyzeVisualsFlow',
    inputSchema: AnalyzeVisualsInputSchema,
    outputSchema: AnalyzeVisualsOutputSchema,
  },
  async input => {
    const {output} = await analyzeVisualsPrompt(input);
    return output!;
  }
);
