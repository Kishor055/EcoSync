
'use server';
/**
 * @fileOverview AI Waste Identification Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseWasteInputSchema = z.object({
  photoDataUri: z.string().describe("Base64 encoded photo of the waste item."),
});

const DiagnoseWasteOutputSchema = z.object({
  item: z.object({
    name: z.string().describe("Common name of the item."),
    material: z.string().describe("Primary material detected."),
    isRecyclable: z.boolean().describe("Whether the item is generally recyclable."),
  }),
  disposal: z.object({
    instructions: z.string().describe("Step by step disposal guide."),
    caution: z.string().optional().describe("Any environmental or safety cautions."),
  }),
  impact: z.object({
    co2Savings: z.number().describe("Estimated CO2 savings in kg if recycled."),
  }),
});

export type DiagnoseWasteInput = z.infer<typeof DiagnoseWasteInputSchema>;
export type DiagnoseWasteOutput = z.infer<typeof DiagnoseWasteOutputSchema>;

const prompt = ai.definePrompt({
  name: 'diagnoseWastePrompt',
  input: {schema: DiagnoseWasteInputSchema},
  output: {schema: DiagnoseWasteOutputSchema},
  prompt: `You are an AI Environmental Specialist. Analyze the provided image to identify the waste material.

Determine if the item is recyclable, provide disposal instructions, and estimate the carbon savings from recycling this specific item.

Image: {{media url=photoDataUri}}`,
});

export async function diagnoseWaste(input: DiagnoseWasteInput): Promise<DiagnoseWasteOutput> {
  const {output} = await prompt(input);
  return output!;
}
