'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, IdCard, AlertTriangle, Network, MapPin, ChevronRight, Landmark, ShieldCheck, Zap } from 'lucide-react';
import { Role, Incident, Campus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DashboardProps {
  role: Role;
  campus: Campus;
  incidents: Incident[];
  onNavigate: (section: string) => void;
}

export default function Dashboard({ role, campus, incidents, onNavigate }: DashboardProps) {
  const campusDisplay = campus === 'Global' ? 'Todos los Planteles' : campus;
  
  const campusIncidents = incidents.filter(i => campus === 'Global' ? true : i.campus === campus);
  const activeReports = campusIncidents.filter(i => i.status === 'pendiente').length;
  const criticalReports = campusIncidents.filter(i => i.severity === 'critica' && i.status === 'pendiente').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary font-headline">Panel de Control <span className="text-secondary tracking-tight">ISSU SAFE</span></h1>
          <p className="text-slate-500 font-medium">Monitoreo Institucional: <strong className="text-primary">{campusDisplay}</strong></p>
        </div>
        {criticalReports > 0 && (
          <Badge className="bg-red-600 text-white animate-pulse px-4 py-2 rounded-xl text-xs font-bold gap-2">
            <Zap className="w-4 h-4 fill-white" /> {criticalReports} ALERTA(S) SOS EN CURSO
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={cn(
            "text-white border-none p-6 shadow-xl relative overflow-hidden group transition-all",
            criticalReports > 0 ? "bg-red-600 animate-pulse" : "bg-primary"
        )}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform translate-x-8 -translate-y-8"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Estatus Perimetral</p>
              <h3 className="text-3xl font-black">{criticalReports > 0 ? 'CRÍTICO' : 'SEGURO'}</h3>
            </div>
            <Landmark className="w-10 h-10 text-secondary opacity-50" />
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className={cn("w-2 h-2 rounded-full", criticalReports > 0 ? "bg-white" : "bg-emerald-400")}></span>
            <p className="text-[10px] font-bold uppercase tracking-widest">{criticalReports > 0 ? 'Protocolo SOS Activo' : 'Protección Activa'}</p>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Acceso Biométrico</p>
              <h3 className="text-3xl font-black text-primary">Normal</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
              <IdCard className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium">Validación de Identidad ISSU</p>
        </Card>

        <Card className="p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Incidencias</p>
              <h3 className="text-3xl font-black text-primary">{activeReports}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${activeReports > 0 ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium">Bandeja de Operaciones</p>
        </Card>

        <Card className="p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Enlace C5 ISSU</p>
              <h3 className="text-3xl font-black text-primary">Activo</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
              <Network className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium">Respuesta Táctica Directa</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col min-h-[450px] border-slate-100 shadow-xl rounded-3xl bg-white">
          <div className="p-6 border-b flex justify-between items-center bg-white z-10">
            <h4 className="font-extrabold text-primary uppercase tracking-tight">Geolocalización ISSU: {campusDisplay}</h4>
            <button 
                onClick={() => onNavigate('mapa')}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 bg-secondary/10 px-3 py-1.5 rounded-full"
            >
                VISTA TÁCTICA <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 bg-grid-pattern relative flex items-center justify-center bg-slate-50">
            <div className="w-3/4 h-2/3 map-building rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden bg-slate-100">
               <div className="absolute inset-0 bg-indigo-50/20"></div>
              <span className="text-slate-300 font-black uppercase tracking-[0.2em] text-2xl font-headline relative z-10">
                {campus === 'Global' ? 'SISTEMA ISSU' : campus.split(' ').pop()}
              </span>
              
              {campusIncidents.filter(i => i.status === 'pendiente').map((inc) => (
                <div 
                  key={inc.id}
                  className={cn(
                      "absolute w-5 h-5 rounded-full border-4 border-white shadow-lg z-20",
                      inc.severity === 'critica' ? "bg-red-600 animate-ping" : "bg-amber-500"
                  )}
                  style={inc.coords}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8 flex flex-col h-[450px] border-slate-100 shadow-xl rounded-3xl bg-white overflow-hidden">
          <h4 className="font-extrabold text-primary mb-6 border-b pb-4 uppercase tracking-tight flex items-center justify-between">
            ALERTAS RECIENTES
            <Badge className="bg-primary text-secondary">TIEMPO REAL</Badge>
          </h4>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {campusIncidents.length > 0 ? campusIncidents.slice(0, 10).map(inc => (
              <div key={inc.id} className={cn(
                  "flex gap-4 items-start p-4 rounded-2xl border transition-all hover:scale-[1.02]",
                  inc.severity === 'critica' ? "bg-red-50 border-red-200" : (inc.status === 'pendiente' ? "bg-amber-50/50 border-amber-100" : "bg-slate-50 border-slate-100")
              )}>
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    inc.severity === 'critica' ? "bg-red-600 text-white" : (inc.status === 'pendiente' ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary")
                )}>
                  {inc.category === 'SOS' ? <Zap className="w-5 h-5 fill-current" /> : (inc.status === 'pendiente' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />)}
                </div>
                <div className="flex-1">
                  <p className={cn("text-sm font-extrabold leading-tight", inc.severity === 'critica' ? "text-red-700" : "text-primary")}>{inc.category}</p>
                  <p className="text-xs text-slate-500 font-medium mb-1 truncate">{inc.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{inc.time}</p>
                    {inc.severity === 'critica' && <span className="text-[8px] font-black text-red-600 animate-pulse">URGENTE</span>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                <ShieldCheck className="w-16 h-16 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400">ENTORNO PROTEGIDO</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
