'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, CheckCircle, CheckCircle2, MoreVertical, Radio, Sparkles } from 'lucide-react';
import { Incident } from '@/lib/types';
import { globalAlertGenerator } from '@/ai/flows/global-alert-generator';
import AIAssistant from './AIAssistant';

interface IncidentManagementProps {
  incidents: Incident[];
  onResolve: (id: number, status: 'atendido') => void;
}

export default function IncidentManagement({ incidents, onResolve }: IncidentManagementProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const handleGlobalAlert = async () => {
    const active = incidents.filter(i => i.status === 'pendiente');
    const msg = prompt("Mensaje de Alerta Global para padres y alumnos:");
    if (!msg) return;

    try {
      const response = await globalAlertGenerator({
        activeIncidents: active.map(i => ({
          category: i.category,
          description: i.description,
          zone: i.zone,
          time: i.time
        })),
        additionalContext: msg
      });
      alert(`SISTEMA C5: Alerta emitida exitosamente.\n\nMensaje generado:\n${response.alertMessage}`);
    } catch (err) {
      alert("Error al emitir alerta global.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-headline">Bandeja de Incidentes</h3>
          <p className="text-sm text-slate-500">Atiende los reportes generados por la comunidad.</p>
        </div>
        <Button 
          onClick={handleGlobalAlert}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-6 rounded-xl shadow-lg transition pulse-red gap-2 h-auto"
        >
          <Radio className="w-5 h-5 animate-pulse" /> EMITIR ALERTA GLOBAL
        </Button>
      </div>

      <div className="grid gap-4">
        {incidents.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No hay reportes en la base de datos.</p>
          </div>
        ) : (
          incidents.map(inc => (
            <Card 
              key={inc.id}
              className={`p-5 rounded-xl border shadow-sm transition-all hover:shadow-md ${inc.status === 'pendiente' ? 'border-amber-300 bg-white' : 'border-slate-200 bg-slate-50/50 opacity-70'}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-inner ${inc.status === 'pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant={inc.status === 'pendiente' ? 'default' : 'secondary'} className={`text-[10px] font-bold uppercase rounded ${inc.status === 'pendiente' ? 'bg-amber-500 text-white' : ''}`}>
                        {inc.category}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {inc.zone}
                      </span>
                      <span className="text-xs text-slate-400">• {inc.time}</span>
                    </div>
                    <p className="text-slate-800 font-semibold text-base leading-tight">{inc.description}</p>
                    <p className="text-[11px] text-slate-500 mt-2">Reportado por: <strong className="text-slate-700">{inc.user}</strong></p>
                  </div>
                </div>
                
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                  {inc.status === 'pendiente' ? (
                    <>
                      <Button 
                        onClick={() => setSelectedIncident(inc)}
                        variant="outline"
                        className="gap-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      >
                        <Sparkles className="w-4 h-4" /> Asistente IA
                      </Button>
                      <Button 
                        onClick={() => onResolve(inc.id, 'atendido')}
                        className="bg-emerald-100 hover:bg-emerald-600 text-emerald-700 hover:text-white border-none font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> MARCAR ATENDIDO
                      </Button>
                    </>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded-lg border border-slate-200 text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> RESUELTO
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selectedIncident && (
        <AIAssistant 
          incident={selectedIncident} 
          onClose={() => setSelectedIncident(null)} 
        />
      )}
    </div>
  );
}