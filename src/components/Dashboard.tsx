'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, IdCard, AlertTriangle, Network, MapPin, ChevronRight } from 'lucide-react';
import { Role, Incident } from '@/lib/types';

interface DashboardProps {
  role: Role;
  incidents: Incident[];
  onNavigate: (section: string) => void;
}

export default function Dashboard({ role, incidents, onNavigate }: DashboardProps) {
  const activeReports = incidents.filter(i => i.status === 'pendiente').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-none p-6 shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 text-sm font-medium mb-1">Nivel de Seguridad</p>
              <h3 className="text-3xl font-bold">Óptimo</h3>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-300 opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Accesos Validados (Hoy)</p>
              <h3 className="text-3xl font-bold">842</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <IdCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            <span className="text-emerald-500 font-semibold">↑ 12%</span> vs ayer
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Reportes Activos</p>
              <h3 className="text-3xl font-bold">{activeReports}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">En el perímetro escolar</p>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Nodos Conectados</p>
              <h3 className="text-3xl font-bold">15</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
              <Network className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">Comunidad en vigilancia</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-4 border-b flex justify-between items-center bg-white z-10">
            <h4 className="font-bold text-slate-700">Vista Rápida Perimetral</h4>
            {role === 'autoridad' && (
              <button 
                onClick={() => onNavigate('mapa')}
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
              >
                Ver Mapa Completo <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex-1 bg-grid-pattern relative flex items-center justify-center bg-slate-200">
            <div className="w-2/3 h-1/2 map-building rounded-lg flex items-center justify-center relative shadow-xl">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-sm font-headline">Escuela</span>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md"></div>
              {incidents.filter(i => i.status === 'pendiente').slice(0, 2).map((inc, idx) => (
                <div 
                  key={inc.id}
                  className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white pulse-red"
                  style={{ top: idx === 0 ? '10%' : '80%', left: idx === 0 ? '10%' : '90%' }}
                />
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 flex flex-col h-[400px]">
          <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">Última Actividad</h4>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {incidents.slice(0, 6).map(inc => (
              <div key={inc.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${inc.status === 'pendiente' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {inc.status === 'pendiente' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{inc.category} en {inc.zone}</p>
                  <p className="text-xs text-slate-500">{inc.time} • {inc.status.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}