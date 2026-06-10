import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Enterprise Genkit configuration.
 * Updated to use gemini-1.5-flash-latest to resolve API resolution issues.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash-latest',
});
