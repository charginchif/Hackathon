'use server';
/**
 * @fileOverview An AI assistant that provides suggested actions, relevant contacts,
 * and a draft communication message for incident reports.
 *
 * - incidentResponseAssistant - A function that processes an incident report
 *   and generates a response.
 * - IncidentReportInput - The input type for the incidentResponseAssistant function.
 * - IncidentResponseOutput - The return type for the incidentResponseAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IncidentReportInputSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('Unique identifier for the incident.'),
  category: z.enum(['Infraestructura', 'Sospechoso', 'Emergencia', 'Acoso', 'SOS']).describe('Category of the incident.'),
  description: z.string().describe('Detailed description of the incident.'),
  zone: z.string().describe('Location or zone where the incident occurred.'),
  user: z.string().describe('Name of the user who reported the incident.'),
  time: z.string().describe('Time the incident was reported (e.g., "10:15 AM").'),
});
export type IncidentReportInput = z.infer<typeof IncidentReportInputSchema>;

const IncidentResponseOutputSchema = z.object({
  suggestedActions: z.array(z.string()).describe('List of immediate actions to take.'),
  relevantContacts: z.array(z.object({
    name: z.string().describe('Name of the contact.'),
    role: z.string().describe('Role of the contact (e.g., "School Nurse", "Security Team").'),
    contactInfo: z.string().describe('Contact information (e.g., phone number, email).'),
  })).describe('List of relevant contacts for the incident.'),
  communicationMessage: z.string().describe('Draft message for internal or external communication.'),
});
export type IncidentResponseOutput = z.infer<typeof IncidentResponseOutputSchema>;

export async function incidentResponseAssistant(input: IncidentReportInput): Promise<IncidentResponseOutput> {
  return incidentResponseAssistantFlow(input);
}

const incidentResponseAssistantPrompt = ai.definePrompt({
  name: 'incidentResponseAssistantPrompt',
  input: { schema: IncidentReportInputSchema },
  output: { schema: IncidentResponseOutputSchema },
  prompt: `You are an AI assistant specialized in incident response for schools. Your goal is to provide quick and effective guidance based on reported incidents.

Analyze the following incident report and provide:
1. A list of suggested immediate actions.
2. A list of relevant contacts including their name, role, and contact information.
3. A concise draft communication message suitable for stakeholders (e.g., internal staff, parents, or students, depending on the severity).

Incident Report:
- ID: {{{id}}}
- Category: {{{category}}}
- Description: {{{description}}}
- Zone: {{{zone}}}
- Reported By: {{{user}}}
- Time: {{{time}}}

Consider the category and description to tailor your response. For example:
- For 'Emergencia' or 'SOS', prioritize safety and external emergency services.
- For 'Sospechoso', focus on security protocols and police contact.
- For 'Infraestructura', suggest contacting maintenance and assessing impact.
- For 'Acoso', recommend counseling, prefect, or school director involvement.

Structure the communication message to be clear, calm, and informative.`,
});

const incidentResponseAssistantFlow = ai.defineFlow(
  {
    name: 'incidentResponseAssistantFlow',
    inputSchema: IncidentReportInputSchema,
    outputSchema: IncidentResponseOutputSchema,
  },
  async (input) => {
    const { output } = await incidentResponseAssistantPrompt(input);
    if (!output) {
      throw new Error('Failed to generate incident response.');
    }
    return output;
  }
);
