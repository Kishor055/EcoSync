'use server';

/**
 * @fileOverview A flow that summarizes a user's monthly energy and water usage.
 *
 * - summarizeUsageReport - A function that generates a summary of a user's energy and water usage.
 * - SummarizeUsageReportInput - The input type for the summarizeUsageReport function.
 * - SummarizeUsageReportOutput - The return type for the summarizeUsageReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUsageReportInputSchema = z.object({
  energyUsage: z
    .number()
    .describe('The total energy usage for the month in kWh.'),
  waterUsage: z.number().describe('The total water usage for the month in gallons.'),
  averageTemperature: z
    .number()
    .describe('The average temperature for the month in Fahrenheit.'),
  usageTrends: z
    .string()
    .describe(
      'A description of the user usage trends for both energy and water for the month.
      Include specifics, such as which appliances contributed most to the usage.'
    ),
  conservationTips: z
    .string()
    .describe('Tips that the user has followed to conserve energy and water.'),
});
export type SummarizeUsageReportInput = z.infer<typeof SummarizeUsageReportInputSchema>;

const SummarizeUsageReportOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the users energy and water usage, highlighting key trends and areas for improvement.'
    ),
});
export type SummarizeUsageReportOutput = z.infer<typeof SummarizeUsageReportOutputSchema>;

export async function summarizeUsageReport(
  input: SummarizeUsageReportInput
): Promise<SummarizeUsageReportOutput> {
  return summarizeUsageReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeUsageReportPrompt',
  input: {schema: SummarizeUsageReportInputSchema},
  output: {schema: SummarizeUsageReportOutputSchema},
  prompt: `You are an expert sustainability consultant. You are helping a user understand
their energy and water usage for the month.

Here is the energy usage: {{energyUsage}} kWh
Here is the water usage: {{waterUsage}} gallons
Here is the average temperature: {{averageTemperature}} degrees Fahrenheit
Here is a description of the user trends: {{usageTrends}}
Here are the conservation tips the user followed: {{conservationTips}}

Generate a summary of the users energy and water usage, highlighting key trends and areas for improvement.
`,
});

const summarizeUsageReportFlow = ai.defineFlow(
  {
    name: 'summarizeUsageReportFlow',
    inputSchema: SummarizeUsageReportInputSchema,
    outputSchema: SummarizeUsageReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
