
'use server';

/**
 * @fileOverview AI Carbon Footprint Prediction Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CarbonPredictionInputSchema = z.object({
  currentMonthlyUsage: z.number().describe("Total current monthly energy usage in kWh."),
  historicTrends: z.array(z.number()).describe("Last 6 months of usage data."),
  lifestyleFactor: z.enum(['urban', 'suburban', 'industrial']).describe("User's living environment."),
});

const CarbonPredictionOutputSchema = z.object({
  predictedCarbon: z.number().describe("Predicted CO2 emissions in kg for next month."),
  confidence: z.number().describe("0-1 confidence score."),
  mitigationStrategy: z.string().describe("AI recommended strategy to lower footprint."),
  projectedSavings: z.number().describe("Potential kg saved if strategy followed."),
});

export type CarbonPredictionInput = z.infer<typeof CarbonPredictionInputSchema>;
export type CarbonPredictionOutput = z.infer<typeof CarbonPredictionOutputSchema>;

const prompt = ai.definePrompt({
  name: 'carbonPredictionPrompt',
  input: {schema: CarbonPredictionInputSchema},
  output: {schema: CarbonPredictionOutputSchema},
  prompt: `You are an AI Sustainability Data Scientist. Analyze the following resource metrics:

Current Usage: {{currentMonthlyUsage}} kWh
Historic Trends: {{#each historicTrends}}{{this}}, {{/each}}
Lifestyle: {{lifestyleFactor}}

Predict the carbon footprint for the next month and provide a tactical mitigation strategy.`,
});

export async function predictCarbonFootprint(input: CarbonPredictionInput): Promise<CarbonPredictionOutput> {
  const {output} = await prompt(input);
  return output!;
}
