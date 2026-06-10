'use server';

/**
 * @fileOverview AI Predictive Maintenance Agent.
 * Analyzes appliance telemetry to forecast potential hardware failures.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MaintenanceInputSchema = z.object({
  applianceType: z.string(),
  energyUsageTrend: z.array(z.number()),
  healthScore: z.number(),
  lastMaintenance: z.string(),
});

const MaintenanceOutputSchema = z.object({
  failureProbability: z.number().describe('0-1 probability of failure within 30 days.'),
  failureReason: z.string().describe('Potential cause of failure (e.g., Compressor Overload).'),
  recommendedAction: z.string().describe('Suggested maintenance step.'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
});

export type MaintenanceInput = z.infer<typeof MaintenanceInputSchema>;
export type MaintenanceOutput = z.infer<typeof MaintenanceOutputSchema>;

const prompt = ai.definePrompt({
  name: 'predictiveMaintenancePrompt',
  input: { schema: MaintenanceInputSchema },
  output: { schema: MaintenanceOutputSchema },
  prompt: `You are an AI Industrial Systems Engineer. Analyze the telemetry of this home appliance.

Appliance: {{applianceType}}
Usage Trend (last 7 days): {{#each energyUsageTrend}}{{this}}, {{/each}}
Current Health: {{healthScore}}%
Last Maintenance: {{lastMaintenance}}

Predict the likelihood of failure and identify anomalies in power consumption. Provide precise technical reasoning.`,
});

export async function predictMaintenance(input: MaintenanceInput): Promise<MaintenanceOutput> {
  const { output } = await prompt(input);
  return output!;
}
