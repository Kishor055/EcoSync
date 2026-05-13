
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Enterprise Genkit configuration.
 * Standardizing on Gemini 1.5 Flash for optimal performance and cost-efficiency.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});
