'use server';

/**
 * @fileOverview A conversational sustainability assistant AI agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssistantInputSchema = z.object({
  message: z.string().describe('The user message.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string()
  })).optional().describe('Chat history.'),
  context: z.string().optional().describe('Context about the user (e.g., their current appliances).')
});

const AssistantOutputSchema = z.object({
  reply: z.string().describe('The AI assistant reply.'),
});

export type AssistantInput = z.infer<typeof AssistantInputSchema>;
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function sustainabilityAssistantChat(input: AssistantInput): Promise<AssistantOutput> {
  return sustainabilityAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sustainabilityAssistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: AssistantOutputSchema },
  prompt: `You are EcoBot, a friendly and expert home sustainability consultant. 
Your goal is to help users reduce their energy and water consumption.

{{#if context}}
Context about user's home:
{{{context}}}
{{/if}}

History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User: {{{message}}}
EcoBot:`,
});

const sustainabilityAssistantFlow = ai.defineFlow(
  {
    name: 'sustainabilityAssistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
