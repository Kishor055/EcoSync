'use server';

/**
 * @fileOverview A flow that summarizes a user's monthly energy and water usage.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUsageReportInputSchema = z.object({
  energyUsage: z.number().describe('The total energy usage for the month in kWh.'),
  waterUsage: z.number().describe('The total water usage for the month in gallons.'),
  averageTemperature: z.number().describe('The average temperature for the month in Fahrenheit.'),
  usageTrends: z.string().describe('A description of usage trends.'),
  conservationTips: z.string().describe('Tips followed by the user.'),
});

const SummarizeUsageReportOutputSchema = z.object({
  summary: z.string().describe('A professional summary of energy and water usage.'),
});

export type SummarizeUsageReportInput = z.infer<typeof SummarizeUsageReportInputSchema>;
export type SummarizeUsageReportOutput = z.infer<typeof SummarizeUsageReportOutputSchema>;

const prompt = ai.definePrompt({
  name: 'summarizeUsageReportPrompt',
  input: {schema: SummarizeUsageReportInputSchema},
  output: {schema: SummarizeUsageReportOutputSchema},
  prompt: `You are EcoSync's expert sustainability analyst. 
Analyze the following monthly performance:

Energy Usage: {{energyUsage}} kWh
Water Usage: {{waterUsage}} gallons
Avg Temp: {{averageTemperature}}°F
Trends: {{{usageTrends}}}
Conservation Actions: {{{conservationTips}}}

Provide a concise, encouraging, and professional summary of their performance.`,
});

export async function summarizeUsageReport(input: SummarizeUsageReportInput): Promise<SummarizeUsageReportOutput> {
  const {output} = await prompt(input);
  return output!;
}
