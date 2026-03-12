'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, IdCard, AlertTriangle, Network, MapPin, ChevronRight, ShieldCheck, Zap, Building2, Cctv, DoorOpen, DoorClosed, Navigation, Hospital, ShoppingCart, Shield, Coffee, Trees, Pill, ParkingCircle, Lamp } from 'lucide-react';
import { Role, Incident, Campus, MapMarker } from '@/lib/types';
import { campusMarkers, campusZones } from '@/lib/mocks';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DashboardProps {
  role: Role;
  campus: Campus;
  incidents: Incident[];
  onNavigate: (section: string) => void;
}

const getMarkerIcon = (type: MapMarker['type']) => {
  switch (type) {
    case 'entrada': return <DoorOpen className="w-3 h-3" />;
    case 'cctv': return <Cctv className="w-3 h-3" />;
    case 'edificio': return <Building2 className="w-3 h-3" />;
    case 'hospital': return <Hospital className="w-3 h-3" />;
    case 'policia': return <Shield className="w-3 h-3" />;
    case 'comercio': return <ShoppingCart className="w-3 h-3" />;
    default: return <MapPin className="w-3 h-3" />;
  }
};

const getMarkerColor = (type: MapMarker['type']) => {
  switch (type) {
    case 'entrada': return "bg-emerald-500";
    case 'cctv': return "bg-blue-600";
    case 'hospital': return "bg-red-500";
    case 'policia': return "bg-blue-800";
    case 'comercio': return "bg-orange-500";
    default: return "bg-slate-500";
  }
};

export default function Dashboard({ role, campus, incidents = [], onNavigate }: DashboardProps) {
  const campusDisplay = campus === 'Global' ? 'Todos los Planteles' : campus;
  
  const campusIncidents = (incidents || []).filter(i => campus === 'Global' ? true : i.campus === campus);
  const activeReports = campusIncidents.filter(i => i.status === 'pendiente').length;
  const criticalReports = campusIncidents.filter(i => i.severity === 'critica' && i.status === 'pendiente').length;
  
  const markers = campusMarkers[campus] || [];
  const zones = campusZones[campus] || [];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary font-headline uppercase tracking-tighter leading-none">Comunidad Alerta</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Unidos por un entorno más seguro: <strong className="text-primary">{campusDisplay}</strong></p>
        </div>
        {criticalReports > 0 && (
          <Badge className="bg-red-600 text-white animate-pulse px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold gap-2">
            <Zap className="w-4 h-4 fill-white" /> {criticalReports} ALERTA(S) SOS EN CURSO
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className={cn(
            "text-white border-none p-5 md:p-6 shadow-xl relative overflow-hidden group transition-all",
            criticalReports > 0 ? "bg-red-600 animate-pulse" : "bg-primary"
        )}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full transform translate-x-8 -translate-y-8"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Estatus Perimetral</p>
              <h3 className="text-2xl md:text-3xl font-black">{criticalReports > 0 ? 'CRÍTICO' : 'SEGURO'}</h3>
            </div>
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-secondary opacity-50" />
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className={cn("w-2 h-2 rounded-full", criticalReports > 0 ? "bg-white" : "bg-emerald-400")}></span>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{criticalReports > 0 ? 'Protocolo SOS Activo' : 'Red Protegida'}</p>
          </div>
        </Card>

        <Card className="p-5 md:p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Acceso Biométrico</p>
              <h3 className="text-2xl md:text-3xl font-black text-primary">Normal</h3>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
              <IdCard className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 font-medium">Validación Comunidad Alerta</p>
        </Card>

        <Card className="p-5 md:p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Incidencias</p>
              <h3 className="text-2xl md:text-3xl font-black text-primary">{activeReports}</h3>
            </div>
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border ${activeReports > 0 ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 font-medium">Bandeja de Operaciones</p>
        </Card>

        <Card className="p-5 md:p-6 border-slate-100 shadow-lg hover:shadow-xl transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Enlace C5</p>
              <h3 className="text-2xl md:text-3xl font-black text-primary">Activo</h3>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
              <Network className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 font-medium">Respuesta Táctica Directa</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px] border-slate-100 shadow-xl rounded-[2.5rem] bg-slate-100 relative group">
          <div className="p-4 md:p-6 border-b flex justify-between items-center bg-white/90 backdrop-blur-md z-30 absolute top-0 left-0 w-full">
            <h4 className="font-extrabold text-sm md:text-base text-primary uppercase tracking-tight flex items-center gap-2">
               <Navigation className="w-4 h-4 text-secondary rotate-45" /> MONITOREO URBANO: {campusDisplay}
            </h4>
            <button 
                onClick={() => onNavigate('mapa')}
                className="text-[9px] md:text-xs font-bold text-secondary hover:text-primary transition-all flex items-center gap-1 bg-secondary/10 px-3 py-1.5 rounded-full hover:scale-105"
            >
                MAPA COMPLETO <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-slate-200">
            {/* Radar Animation Elements */}
            <div className="radar-sweep"></div>
            
            {/* Calles y Cuadrícula Urbana */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-[20%] w-full h-4 bg-slate-800"></div>
                <div className="absolute top-[80%] w-full h-4 bg-slate-800"></div>
                <div className="absolute left-[20%] h-full w-4 bg-slate-800"></div>
                <div className="absolute left-[80%] h-full w-4 bg-slate-800"></div>
                <div className="absolute top-[50%] w-full h-2 bg-slate-800 rotate-1"></div>
                <div className="absolute left-[50%] h-full w-2 bg-slate-800 -rotate-1"></div>
            </div>

            {/* Zonas Urbanas Simples */}
            {zones.slice(0, 2).map(zone => (
              <div 
                key={zone.id}
                className={cn(
                  "absolute rounded-[2rem] border-2 opacity-30 z-10",
                  zone.type === 'danger-high' && "bg-red-500/20 border-red-500",
                  zone.type === 'safe' && "bg-emerald-500/20 border-emerald-500"
                )}
                style={zone.coords}
              />
            ))}

            {/* Marcadores de Infraestructura */}
            <TooltipProvider>
              {markers.slice(0, 10).map(marker => (
                <div key={marker.id} className="absolute z-20" style={marker.coords}>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110",
                    getMarkerColor(marker.type)
                  )}>
                    {getMarkerIcon(marker.type)}
                  </div>
                </div>
              ))}
            </TooltipProvider>

            <div className="w-[85%] md:w-2/3 h-1/2 map-building rounded-[3rem] flex flex-col items-center justify-center relative shadow-2xl overflow-hidden bg-white/80 backdrop-blur-[4px] z-10 border-4 border-white group-hover:scale-[1.02] transition-transform">
               <div className="absolute inset-0 bg-indigo-50/10"></div>
               <Building2 className="w-12 h-12 md:w-16 md:h-16 text-primary mb-2 opacity-80" />
               <span className="text-primary font-black uppercase tracking-[0.2em] text-sm md:text-xl font-headline relative z-10 text-center px-6 leading-tight">
                COMUNIDAD ALERTA
              </span>
              <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest relative z-10">Sede Central de Protección</p>
              
              {campusIncidents.filter(i => i.status === 'pendiente').map((inc) => (
                <div 
                  key={inc.id}
                  className={cn(
                      "absolute w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-white shadow-lg z-20",
                      inc.severity === 'critica' ? "bg-red-600 animate-ping" : "bg-amber-500"
                  )}
                  style={inc.coords}
                />
              ))}
            </div>

            {/* Alertas SOS en Tiempo Real sobre el mini-mapa */}
            {campusIncidents.filter(i => i.status === 'pendiente' && i.severity === 'critica').slice(0, 1).map(inc => (
              <div key={inc.id} className="absolute top-[60%] left-[60%] z-40 animate-bounce">
                <div className="bg-red-600 text-white p-2 rounded-xl shadow-2xl border-2 border-white flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-white" />
                  <span className="text-[10px] font-black uppercase whitespace-nowrap">ALERTA SOS: {inc.userName}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 md:p-8 flex flex-col h-[400px] md:h-[500px] border-slate-100 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <h4 className="font-extrabold text-sm md:text-base text-primary mb-4 md:mb-6 border-b pb-4 uppercase tracking-tight flex items-center justify-between">
            ALERTAS RECIENTES
            <Badge className="bg-primary text-secondary text-[8px] md:text-[10px]">TIEMPO REAL</Badge>
          </h4>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
            {campusIncidents.length > 0 ? campusIncidents.slice(0, 10).map(inc => (
              <div key={inc.id} className={cn(
                  "flex gap-3 md:gap-4 items-start p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all hover:scale-[1.02]",
                  inc.severity === 'critica' ? "bg-red-50 border-red-200" : (inc.status === 'pendiente' ? "bg-amber-50/50 border-amber-100" : "bg-slate-50 border-slate-100")
              )}>
                <div className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    inc.severity === 'critica' ? "bg-red-600 text-white" : (inc.status === 'pendiente' ? "bg-amber-100 text-amber-600" : "bg-primary/10 text-primary")
                )}>
                  {inc.category === 'SOS' ? <Zap className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : (inc.status === 'pendiente' ? <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" /> : <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={cn("text-xs md:text-sm font-extrabold leading-tight truncate", inc.severity === 'critica' ? "text-red-700" : "text-primary")}>{inc.category}</p>
                  <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-1 truncate">{inc.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase">{inc.time}</p>
                    {inc.severity === 'critica' && <span className="text-[7px] md:text-[8px] font-black text-red-600 animate-pulse">URGENTE</span>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full opacity-30">
                <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mb-2" />
                <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Entorno Protegido</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
