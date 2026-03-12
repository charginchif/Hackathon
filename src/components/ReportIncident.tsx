'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, MapPin, Camera, Send, Check, Zap } from 'lucide-react';
import { Incident, IncidentCategory, IncidentSeverity } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReportIncidentProps {
  onReport: (incident: Incident) => void;
  userName: string;
}

export default function ReportIncident({ onReport, userName }: ReportIncidentProps) {
  const [category, setCategory] = useState<string>('');
  const [zone, setZone] = useState<string>('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newIncident: Incident = {
      id: Date.now(),
      category: category as IncidentCategory,
      description,
      zone,
      campus: 'UNE Campus Central', // Mock default
      status: 'pendiente',
      severity: (category === 'Emergencia' || category === 'Acoso') ? 'alta' : 'media',
      user: userName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords: { top: '30%', left: '30%' } // Mock random
    };

    onReport(newIncident);
    setShowSuccess(true);
    setCategory('');
    setZone('');
    setDescription('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="bg-red-600 p-8 border-none text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-black uppercase tracking-tight">Protocolo SOS</h3>
            <p className="text-red-100 font-bold">Usa este botón solo en caso de peligro inminente o emergencia crítica.</p>
          </div>
          <Button 
            onClick={() => {
                onReport({
                    id: Date.now(),
                    category: 'SOS',
                    description: 'BOTÓN SOS ACTIVADO DESDE PANEL REPORTAR',
                    zone: 'UBICACIÓN POR GPS',
                    campus: 'UNE Campus Central',
                    status: 'pendiente',
                    severity: 'critica',
                    user: userName,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    coords: { top: '50%', left: '50%' }
                });
                setShowSuccess(true);
            }}
            className="bg-white text-red-600 hover:bg-red-50 h-16 px-10 rounded-2xl font-black text-xl shadow-2xl animate-pulse flex gap-3"
          >
            <Zap className="w-8 h-8 fill-current" /> ACTIVAR SOS
          </Button>
        </div>
      </Card>

      <Card className="border-t-4 border-t-primary shadow-xl p-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 font-headline">Reporte Comunitario</h3>
          <p className="text-slate-500 mt-1">Colabora con la seguridad del plantel informando riesgos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">¿Qué está pasando?</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="p-6 bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary border-slate-200">
                  <SelectValue placeholder="Categoría..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infraestructura">Falla de Infraestructura</SelectItem>
                  <SelectItem value="Sospechoso">Persona Sospechosa</SelectItem>
                  <SelectItem value="Emergencia">Emergencia Médica</SelectItem>
                  <SelectItem value="Acoso">Situación de Acoso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">¿Dónde ocurre?</Label>
              <Select value={zone} onValueChange={setZone} required>
                <SelectTrigger className="p-6 bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary border-slate-200">
                  <SelectValue placeholder="Zona del campus..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Puerta Norte">Puerta Norte</SelectItem>
                  <SelectItem value="Puerta Sur">Puerta Sur</SelectItem>
                  <SelectItem value="Edificio A">Edificio A (Aulas)</SelectItem>
                  <SelectItem value="Explanada">Explanada Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Descripción</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4} 
              className="p-4 bg-slate-50 rounded-xl focus:ring-2 focus:ring-primary border-slate-200 resize-none" 
              placeholder="Escribe detalles importantes..."
            />
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer group">
            <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
            <p className="text-sm font-semibold text-slate-600">Evidencia Visual</p>
            <p className="text-xs text-slate-400">Adjunta una foto para mejor respuesta</p>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-14 text-lg font-bold gap-2 shadow-lg rounded-xl">
            <Send className="w-5 h-5" /> ENVIAR REPORTE AL C5
          </Button>
        </form>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 font-headline mb-2 text-center uppercase">¡Recibido!</DialogTitle>
          </DialogHeader>
          <p className="text-slate-500 mb-8 text-sm font-medium">El Centro de Mando ha recibido tu alerta. Mantente en un lugar seguro mientras evaluamos la situación.</p>
          <Button onClick={() => setShowSuccess(false)} className="w-full bg-primary rounded-xl font-bold h-12">ENTENDIDO</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}