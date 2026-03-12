'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, IdCard, AlertTriangle, Network, MapPin, ChevronRight, Landmark } from 'lucide-react';
import { Role, Incident, Campus } from '@/lib/types';

interface DashboardProps {
  role: Role;
  campus: Campus;
  incidents: Incident[];
  onNavigate: (section: string) => void;
}

export default function Dashboard({ role, campus, incidents, onNavigate }: DashboardProps) {
  const campusIncidents = incidents.filter(i => i.campus === campus);
  const activeReports = campusIncidents.filter(i => i.status === 'pendiente').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary font-headline">Panel de Control <span className="text-secondary tracking-tight">UNE</span></h1>
          <p className="text-slate-500 font-medium">Monitoreo activo para: <strong className="text-primary">{campus}</strong></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-primary text-white border-none p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-bl-full transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest mb-1">Estatus Perimetral</p>
              <h3 className="text-3xl font-black">SEGURIDAD A+</h3>
            </div>
            <Landmark className="w-10 h-10 text-secondary opacity-50" />
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <p className="text-[10px] font-bold text-emerald-400">PROTECCIÓN ACTIVA</p>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Biometría (Hoy)</p>
              <h3 className="text-3xl font-black text-primary">1,248</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
              <IdCard className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium">
            <span className="text-primary font-bold">↑ 8%</span> incremento de flujo
          </p>
        </Card>

        <Card className="p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Alertas Activas</p>
              <h3 className="text-3xl font-black text-primary">{activeReports}</h3>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${activeReports > 0 ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium">Incidentes en resolución</p>
        </Card>

        <Card className="p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-1">Módulos Vigilancia</p>
              <h3 className="text-3xl font-black text-primary">32</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
              <Network className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 font-medium">Red de respuesta UNE</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col min-h-[450px] border-slate-100 shadow-xl rounded-3xl">
          <div className="p-6 border-b flex justify-between items-center bg-white z-10">
            <h4 className="font-extrabold text-primary uppercase tracking-tight">Geolocalización UNE: {campus}</h4>
            {role === 'autoridad' && (
              <button 
                onClick={() => onNavigate('mapa')}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 bg-secondary/10 px-3 py-1.5 rounded-full"
              >
                MODO MAPA COMPLETO <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex-1 bg-grid-pattern relative flex items-center justify-center bg-slate-50">
            <div className="w-3/4 h-2/3 map-building rounded-3xl flex items-center justify-center relative shadow-2xl overflow-hidden">
               <div className="absolute inset-0 bg-blue-50/30"></div>
              <span className="text-slate-300 font-black uppercase tracking-[0.2em] text-2xl font-headline relative z-10">{campus.split(' ').pop()}</span>
              {/* Fake Campus Structure */}
              <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-white border border-slate-200 rounded shadow-sm z-10"></div>
              <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-white border border-slate-200 rounded shadow-sm z-10"></div>
              
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full border-4 border-white shadow-lg"></div>
              
              {campusIncidents.filter(i => i.status === 'pendiente').slice(0, 2).map((inc, idx) => (
                <div 
                  key={inc.id}
                  className="absolute w-5 h-5 bg-red-600 rounded-full border-4 border-white shadow-lg pulse-red z-20"
                  style={{ top: idx === 0 ? '20%' : '70%', left: idx === 0 ? '15%' : '85%' }}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-8 flex flex-col h-[450px] border-slate-100 shadow-xl rounded-3xl">
          <h4 className="font-extrabold text-primary mb-6 border-b pb-4 uppercase tracking-tight flex items-center justify-between">
            ALERTA TEMPRANA
            <Badge className="bg-primary text-secondary">VIVO</Badge>
          </h4>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {campusIncidents.length > 0 ? campusIncidents.slice(0, 6).map(inc => (
              <div key={inc.id} className={`flex gap-4 items-start p-4 rounded-2xl border transition-all hover:scale-[1.02] ${inc.status === 'pendiente' ? 'bg-amber-50/50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${inc.status === 'pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                  {inc.status === 'pendiente' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-primary leading-tight">{inc.category}</p>
                  <p className="text-xs text-slate-500 font-medium mb-1">{inc.zone}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{inc.time} • {inc.status}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                <ShieldCheck className="w-16 h-16 text-slate-300 mb-2" />
                <p className="text-xs font-bold text-slate-400">SIN INCIDENTES ACTIVOS</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
