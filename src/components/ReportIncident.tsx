'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Camera, Send, Check, Zap } from 'lucide-react';
import { Incident, User, IncidentCategory } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUser } from '@/firebase';

interface ReportIncidentProps {
  onReport: (incident: Partial<Incident>) => void;
  user: User;
}

export default function ReportIncident({ onReport, user }: ReportIncidentProps) {
  const { user: fbUser } = useUser();
  const [category, setCategory] = useState<string>('');
  const [zone, setZone] = useState<string>('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbUser) return;
    
    const campusId = user.campus === 'Global' ? 'Campus Metropolitano' : user.campus;

    onReport({
      id: Date.now().toString(),
      category: category as IncidentCategory,
      description,
      zone,
      campus: campusId,
      schoolId: campusId,
      status: 'pendiente',
      severity: (category === 'Emergencia' || category === 'Acoso') ? 'alta' : 'media',
      userId: fbUser.uid,
      userName: user.name,
      reporterUserId: fbUser.uid,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords: { top: '35%', left: '40%' }
    });

    setShowSuccess(true);
    setCategory('');
    setZone('');
    setDescription('');
  };

  const handleSOSQuick = () => {
    if (!fbUser) return;
    const campusId = user.campus === 'Global' ? 'Campus Metropolitano' : user.campus;

    onReport({
        id: Date.now().toString(),
        category: 'SOS',
        description: 'BOTÓN SOS ACTIVADO POR USUARIO',
        zone: 'UBICACIÓN DINÁMICA',
        campus: campusId,
        schoolId: campusId,
        status: 'pendiente',
        severity: 'critica',
        userId: fbUser.uid,
        userName: user.name,
        reporterUserId: fbUser.uid,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coords: { top: '50%', left: '50%' }
    });
    setShowSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="bg-red-600 p-8 border-none text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-3xl font-black uppercase tracking-tight">Protocolo SOS ISSU</h3>
            <p className="text-red-100 font-bold opacity-80">Alerta inmediata por peligro inminente.</p>
          </div>
          <Button 
            onClick={handleSOSQuick}
            className="bg-white text-red-600 h-16 px-10 rounded-2xl font-black text-xl shadow-2xl animate-pulse flex gap-3"
          >
            <Zap className="w-8 h-8 fill-current" /> ACTIVAR SOS
          </Button>
        </div>
      </Card>

      <Card className="shadow-xl p-8 bg-white border border-slate-100 rounded-3xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Reporte de Seguridad</h3>
          <p className="text-slate-500 mt-1">Colabora con la vigilancia de tu campus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Tipo de Incidencia</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="h-14 bg-slate-50 rounded-xl border-slate-200">
                  <SelectValue placeholder="Seleccionar..." />
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
              <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Zona del Incidente</Label>
              <Select value={zone} onValueChange={setZone} required>
                <SelectTrigger className="h-14 bg-slate-50 rounded-xl border-slate-200">
                  <SelectValue placeholder="Seleccionar zona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Puerta Norte">Puerta Norte</SelectItem>
                  <SelectItem value="Puerta Sur">Puerta Sur</SelectItem>
                  <SelectItem value="Edificio A">Edificio A (Aulas)</SelectItem>
                  <SelectItem value="Explanada">Explanada Principal</SelectItem>
                  <SelectItem value="Laboratorios">Área de Laboratorios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Detalles</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4} 
              className="bg-slate-50 rounded-xl border-slate-200 resize-none p-4" 
              placeholder="Describa la situación..."
            />
          </div>

          <Button type="submit" className="w-full bg-primary h-14 text-lg font-bold gap-2 shadow-lg rounded-xl">
            <Send className="w-5 h-5" /> ENVIAR AL CENTRO DE MANDO
          </Button>
        </form>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md p-10 text-center rounded-[2rem]">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-primary text-center uppercase">¡Reporte Enviado!</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-center">
              El Centro de Mando ISSU ha registrado tu reporte. Nuestras unidades han sido notificadas.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowSuccess(false)} className="w-full bg-primary rounded-xl font-bold h-12 mt-4">ENTENDIDO</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}