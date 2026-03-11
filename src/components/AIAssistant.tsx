'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Phone, MessageSquare, ListChecks, Loader2, User } from 'lucide-react';
import { Incident } from '@/lib/types';
import { incidentResponseAssistant, IncidentResponseOutput } from '@/ai/flows/incident-response-assistant';

interface AIAssistantProps {
  incident: Incident;
  onClose: () => void;
}

export default function AIAssistant({ incident, onClose }: AIAssistantProps) {
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<IncidentResponseOutput | null>(null);

  useEffect(() => {
    const fetchAIResponse = async () => {
      try {
        const res = await incidentResponseAssistant({
          id: incident.id,
          category: incident.category,
          description: incident.description,
          zone: incident.zone,
          user: incident.user,
          time: incident.time
        });
        setResponse(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAIResponse();
  }, [incident]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none">
        <DialogHeader className="p-6 bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold font-headline">Asistente de Respuesta IA</DialogTitle>
              <DialogDescription className="text-slate-400">Análisis estratégico para: #{incident.id} - {incident.category}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6 bg-slate-50">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
              <p className="font-medium animate-pulse">Generando recomendaciones estratégicas...</p>
            </div>
          ) : response ? (
            <div className="space-y-8 pb-4">
              {/* Suggested Actions */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <ListChecks className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-lg uppercase tracking-tight">Protocolos Sugeridos</h4>
                </div>
                <div className="grid gap-2">
                  {response.suggestedActions.map((action, i) => (
                    <div key={i} className="flex gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</div>
                      <p className="text-sm text-slate-700">{action}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contacts */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-lg uppercase tracking-tight">Contactos Relevantes</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {response.relevantContacts.map((contact, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <p className="font-bold text-slate-800 text-sm mb-1">{contact.name}</p>
                      <p className="text-xs text-blue-600 font-semibold mb-2 uppercase">{contact.role}</p>
                      <p className="text-xs text-slate-500 font-mono bg-slate-50 p-1 rounded inline-block">{contact.contactInfo}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Message Draft */}
              <section>
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-lg uppercase tracking-tight">Borrador de Comunicación</h4>
                </div>
                <div className="p-5 bg-purple-50 rounded-xl border border-purple-100 text-slate-700 text-sm italic leading-relaxed shadow-inner">
                  "{response.communicationMessage}"
                </div>
              </section>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">No se pudo generar una respuesta en este momento.</div>
          )}
        </ScrollArea>

        <DialogFooter className="p-6 border-t bg-white flex-shrink-0">
          <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800">Cerrar Asistente</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}