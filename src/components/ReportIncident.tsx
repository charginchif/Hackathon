'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, MapPin, Camera, Send, Check } from 'lucide-react';
import { Incident, IncidentCategory } from '@/lib/types';
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
    
    // Calculate mock coordinates based on zone
    let coords = { top: '50%', left: '50%' };
    if (zone.includes('Norte')) coords = { top: '20%', left: '50%' };
    if (zone.includes('Sur')) coords = { top: '80%', left: '50%' };
    if (zone.includes('Poniente')) coords = { top: '50%', left: '20%' };
    if (zone.includes('Parque')) coords = { top: '50%', left: '80%' };

    const newIncident: Incident = {
      id: Date.now(),
      category: category as IncidentCategory,
      description,
      zone,
      status: 'pendiente',
      user: userName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords
    };

    onReport(newIncident);
    setShowSuccess(true);
    setCategory('');
    setZone('');
    setDescription('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border-t-4 border-t-emerald-500 shadow-xl p-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Megaphone className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 font-headline">Crear Alerta Comunitaria</h3>
          <p className="text-slate-500 mt-1">Tu reporte ayuda a prevenir riesgos en el entorno escolar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">¿Qué está pasando?</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="p-6 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500 border-slate-200">
                  <SelectValue placeholder="Selecciona una categoría..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Infraestructura">Falla de Infraestructura (Luz, bache)</SelectItem>
                  <SelectItem value="Sospechoso">Persona/Vehículo Sospechoso</SelectItem>
                  <SelectItem value="Emergencia">Emergencia Médica</SelectItem>
                  <SelectItem value="Acoso">Situación de Riesgo / Acoso</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700">¿Dónde ocurre?</Label>
              <Select value={zone} onValueChange={setZone} required>
                <SelectTrigger className="p-6 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500 border-slate-200">
                  <SelectValue placeholder="Selecciona la zona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Puerta Norte">Puerta Norte (Principal)</SelectItem>
                  <SelectItem value="Puerta Sur">Puerta Sur (Estacionamiento)</SelectItem>
                  <SelectItem value="Calle Lateral Poniente">Calle Lateral Poniente</SelectItem>
                  <SelectItem value="Parque Aledaño">Parque Aledaño</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Detalles del Incidente</Label>
            <Textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4} 
              className="p-4 bg-slate-50 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-none border-slate-200" 
              placeholder="Describe brevemente lo que estás observando..."
            />
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer group">
            <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
            <p className="text-sm font-semibold text-slate-600">Adjuntar Fotografía (Opcional)</p>
            <p className="text-xs text-slate-400">Sube una imagen como evidencia</p>
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 h-14 text-lg font-bold gap-2 shadow-lg">
            <Send className="w-5 h-5" /> ENVIAR REPORTE AL CENTRO DE MANDO
          </Button>
        </form>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800 font-headline mb-2 text-center">¡Reporte Enviado!</DialogTitle>
          </DialogHeader>
          <p className="text-slate-500 mb-8 text-sm">El centro de mando ha recibido tu alerta y está siendo evaluada.</p>
          <Button onClick={() => setShowSuccess(false)} className="w-full bg-emerald-600">Entendido</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}