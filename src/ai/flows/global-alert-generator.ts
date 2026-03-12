'use server';
/**
 * @fileOverview A Genkit flow for generating global alert messages based on incidents or user input.
 *
 * - globalAlertGenerator - A function that generates a global alert message.
 * - GlobalAlertGeneratorInput - The input type for the globalAlertGenerator function.
 * - GlobalAlertGeneratorOutput - The return type for the globalAlertGenerator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input Schema
const IncidentSchema = z.object({
  category: z.string().describe('The category of the incident (e.g., Infraestructura, Sospechoso, Emergencia, Acoso).'),
  description: z.string().describe('A brief description of the incident.'),
  zone: z.string().describe('The zone where the incident occurred (e.g., Puerta Norte, Calle Lateral Poniente).'),
  time: z.string().describe('The time the incident was reported (e.g., 10:15 AM).'),
});

const GlobalAlertGeneratorInputSchema = z.object({
  activeIncidents: z.array(IncidentSchema).optional().describe('A list of currently active incidents.'),
  additionalContext: z.string().optional().describe('Any additional context or brief input provided by the user for the alert.'),
});
export type GlobalAlertGeneratorInput = z.infer<typeof GlobalAlertGeneratorInputSchema>;

// Output Schema
const GlobalAlertGeneratorOutputSchema = z.object({
  alertMessage: z.string().describe('The generated global alert message for the community.'),
});
export type GlobalAlertGeneratorOutput = z.infer<typeof GlobalAlertGeneratorOutputSchema>;

export async function globalAlertGenerator(input: GlobalAlertGeneratorInput): Promise<GlobalAlertGeneratorOutput> {
  return globalAlertGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'globalAlertGeneratorPrompt',
  input: { schema: GlobalAlertGeneratorInputSchema },
  output: { schema: GlobalAlertGeneratorOutputSchema },
  prompt: `You are an AI assistant for the "Comunidad Alerta" platform, specialized in generating urgent and clear global alert messages for the community.

Your task is to draft a concise and informative alert message based on the provided active incidents and/or additional context. The message should be directed to residents, parents, and neighbors, informing them about the situation and, if applicable, advising on safety measures.

If there are active incidents, summarize them clearly. If additional context is provided, incorporate it. If no specific incidents or context are given, generate a general safety reminder.

Focus on clarity, urgency, and actionable advice where appropriate. The tone should be serious but reassuring.

Here are the details:

{{#if activeIncidents}}
Active Incidents:
{{#each activeIncidents}}
- Category: {{this.category}}
  Description: {{this.description}}
  Zone: {{this.zone}}
  Time: {{this.time}}
{{/each}}
{{/if}}

{{#if additionalContext}}
Additional Context: "{{additionalContext}}"
{{/if}}

Please generate the alert message in Spanish. Ensure the message is suitable for a professional safety alert system. Mention "Comunidad Alerta: Unidos por un entorno más seguro" as the signature.
`
});

const globalAlertGeneratorFlow = ai.defineFlow(
  {
    name: 'globalAlertGeneratorFlow',
    inputSchema: GlobalAlertGeneratorInputSchema,
    outputSchema: GlobalAlertGeneratorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
