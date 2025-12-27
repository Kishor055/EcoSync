'use server';
/**
 * @fileOverview A sustainability tip generation AI agent.
 *
 * - generateSustainabilityTips - A function that generates personalized sustainability tips based on user consumption data.
 * - SustainabilityTipsInput - The input type for the generateSustainabilityTips function.
 * - SustainabilityTipsOutput - The return type for the generateSustainabilityTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SustainabilityTipsInputSchema = z.object({
  consumptionData: z.string().describe('The user consumption data.'),
});
export type SustainabilityTipsInput = z.infer<typeof SustainabilityTipsInputSchema>;

const SustainabilityTipsOutputSchema = z.object({
  tips: z.string().describe('Personalized sustainability tips based on consumption data.'),
});
export type SustainabilityTipsOutput = z.infer<typeof SustainabilityTipsOutputSchema>;

export async function generateSustainabilityTips(input: SustainabilityTipsInput): Promise<SustainabilityTipsOutput> {
  return generateSustainabilityTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSustainabilityTipsPrompt',
  input: {schema: SustainabilityTipsInputSchema},
  output: {schema: SustainabilityTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized sustainability tips to users based on their consumption data.\n\nBased on the following consumption data: {{{consumptionData}}}, generate actionable tips to reduce their environmental impact.`,
});

const generateSustainabilityTipsFlow = ai.defineFlow(
  {
    name: 'generateSustainabilityTipsFlow',
    inputSchema: SustainabilityTipsInputSchema,
    outputSchema: SustainabilityTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
