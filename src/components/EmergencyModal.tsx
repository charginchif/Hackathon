'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Flame, Ambulance, Siren, Zap, CheckCircle2 } from 'lucide-react';
import { Incident } from '@/lib/types';
import { useState } from 'react';

interface EmergencyModalProps {
  incident: Incident;
  onClose: () => void;
  onDispatch: (id: number | string) => void;
}

export default function EmergencyModal({ incident, onClose, onDispatch }: EmergencyModalProps) {
  const [dispatched, setDispatched] = useState<string | null>(null);

  const handleDispatch = (service: string) => {
    setDispatched(service);
    setTimeout(() => {
      onDispatch(incident.id);
      onClose();
    }, 2000);
  };

  if (dispatched) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-10 text-center border-none shadow-2xl">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary mb-2 uppercase text-center">¡Despacho Exitoso!</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-center">
              Se ha enviado la alerta a las unidades de {dispatched}. La unidad está en camino a la zona: {incident.zone}.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>ALERTA SOS ACTIVA - PROTOCOLO ISSU</DialogTitle>
          <DialogDescription>
            Intervención inmediata requerida para el usuario {incident.userName} en {incident.zone}.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-red-600 p-8 text-white flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">ALERTA SOS ACTIVA</h2>
            <p className="text-red-100 font-bold opacity-90">{incident.userName} ha solicitado auxilio inmediato</p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-red-600 uppercase bg-red-50 px-2 py-1 rounded">Prioridad Crítica</span>
              <span className="text-[10px] font-bold text-slate-400">{incident.time}</span>
            </div>
            <p className="text-lg font-bold text-slate-800 leading-tight mb-2">{incident.description}</p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
                <Siren className="w-4 h-4" /> Ubicación: <strong className="text-slate-700">{incident.zone} ({incident.campus})</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
                onClick={() => handleDispatch('POLICÍA / C5')}
                className="h-24 flex-col gap-2 bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              <Siren className="w-8 h-8 text-white" />
              <span className="font-black text-[10px] uppercase">Policía / C5</span>
            </Button>
            <Button 
                onClick={() => handleDispatch('CUERPOS MÉDICOS')}
                className="h-24 flex-col gap-2 bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              <Ambulance className="w-8 h-8 text-white" />
              <span className="font-black text-[10px] uppercase">Ambulancia</span>
            </Button>
            <Button 
                onClick={() => handleDispatch('BOMBEROS')}
                className="h-24 flex-col gap-2 bg-orange-600 hover:bg-orange-700 rounded-2xl shadow-lg transition-transform hover:scale-105"
            >
              <Flame className="w-8 h-8 text-white" />
              <span className="font-black text-[10px] uppercase">Bomberos</span>
            </Button>
          </div>
        </div>

        <DialogFooter className="p-6 bg-slate-50 border-t">
          <Button variant="ghost" onClick={onClose} className="w-full font-bold text-slate-400">Ignorar Alerta (No Recomendado)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
