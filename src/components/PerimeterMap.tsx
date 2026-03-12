
'use client';

import { MapPin, School, ShieldAlert, ShieldCheck, Zap, DoorOpen, DoorClosed, Wrench, User, AlertTriangle, Building2, Navigation, Cctv, Lamp, TreeDeciduous, ParkingCircle } from 'lucide-react';
import { Incident, ZoneOverlay, MapMarker } from '@/lib/types';
import { campusZones, campusMarkers } from '@/lib/mocks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface PerimeterMapProps {
  incidents: Incident[];
  campus: string;
}

const getMarkerIcon = (type: MapMarker['type']) => {
  switch (type) {
    case 'entrada': return <DoorOpen className="w-4 h-4" />;
    case 'salida': return <DoorClosed className="w-4 h-4" />;
    case 'falla': return <Wrench className="w-4 h-4" />;
    case 'estudiante': return <User className="w-4 h-4" />;
    case 'cctv': return <Cctv className="w-4 h-4" />;
    case 'iluminacion': return <Lamp className="w-4 h-4" />;
    case 'edificio': return <Building2 className="w-4 h-4" />;
    case 'calle': return <Navigation className="w-4 h-4 rotate-45" />;
    case 'parking': return <ParkingCircle className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getMarkerColor = (type: MapMarker['type']) => {
  switch (type) {
    case 'entrada': return "bg-emerald-500 text-white";
    case 'salida': return "bg-slate-700 text-white";
    case 'falla': return "bg-yellow-500 text-white animate-bounce";
    case 'cctv': return "bg-blue-600 text-white";
    case 'edificio': return "bg-primary text-white";
    case 'calle': return "bg-slate-400 text-white opacity-40";
    case 'parking': return "bg-indigo-400 text-white";
    default: return "bg-slate-500 text-white";
  }
};

export default function PerimeterMap({ incidents, campus }: PerimeterMapProps) {
  const activeIncidents = incidents.filter(i => i.status === 'pendiente' && (campus === 'Global' ? true : i.campus === campus));
  const zones = campusZones[campus] || [];
  const markers = campusMarkers[campus] || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-xl font-black text-primary font-headline uppercase tracking-tight">Mapa Táctico de Comunidad Alerta</h3>
          <p className="text-sm text-slate-500 font-medium">Urbanización en tiempo real: Monitoreo de calles, edificios y perímetros.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 text-[10px] font-bold">Zona Segura</Badge>
          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 text-[10px] font-bold">Riesgo Alto</Badge>
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 px-3 py-1 text-[10px] font-bold">Crítico</Badge>
        </div>
      </div>
      
      <div className="flex-1 bg-grid-pattern rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden min-h-[650px] bg-slate-50">
        {/* Radar Animation Elements */}
        <div className="radar-sweep"></div>
        <div className="radar-circle w-[200px] h-[200px] opacity-40"></div>
        <div className="radar-circle w-[500px] h-[500px] opacity-20"></div>
        <div className="radar-circle w-[800px] h-[800px] opacity-10"></div>

        {/* Capas de Riesgo / Zonas Urbanas */}
        {zones.map(zone => (
          <div 
            key={zone.id}
            className={cn(
              "absolute rounded-[2rem] border-2 transition-all duration-700 z-10 backdrop-blur-[1px]",
              zone.type === 'danger-high' && "danger-high animate-pulse",
              zone.type === 'danger-mid' && "danger-mid",
              zone.type === 'danger-low' && "danger-low",
              zone.type === 'safe' && "safe-zone"
            )}
            style={zone.coords}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[8px] font-black uppercase px-3 py-1 rounded-full bg-slate-900 text-white shadow-xl border border-white/20">
                    {zone.name}
                </span>
            </div>
          </div>
        ))}

        {/* Puntos de Infraestructura y Vida Urbana */}
        <TooltipProvider>
            {markers.map(marker => (
                <div key={marker.id} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={marker.coords}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-1 group">
                                <div className={cn(
                                    "w-7 h-7 md:w-8 md:h-8 rounded-xl border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-all group-hover:scale-125 group-hover:z-50",
                                    getMarkerColor(marker.type)
                                )}>
                                    {getMarkerIcon(marker.type)}
                                </div>
                                <span className="text-[7px] md:text-[9px] font-black text-slate-800 uppercase bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm border border-slate-100 whitespace-nowrap opacity-80 group-hover:opacity-100">
                                    {marker.label}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-3 border-none rounded-xl shadow-2xl">
                            <p className="text-xs font-black uppercase mb-1">{marker.label}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Estado: Operativo</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </TooltipProvider>

        {/* Centro de Mando Táctico (Edificio Principal) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-white/80 backdrop-blur-md border-b-8 border-b-secondary border-4 border-primary rounded-[3rem] flex flex-col items-center justify-center shadow-2xl z-10 group hover:scale-105 transition-all">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-3 shadow-inner group-hover:rotate-6 transition-transform">
            <School className="w-10 h-10 text-secondary" />
          </div>
          <span className="text-primary font-black text-sm md:text-base uppercase tracking-[0.2em] font-headline text-center px-4 leading-none">COMUNIDAD ALERTA</span>
          <p className="text-[7px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Centro de Mando Principal</p>
          <div className="mt-4 flex gap-3">
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[6px] font-black text-emerald-600 uppercase">Red Activa</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse delay-150"></div>
                <span className="text-[6px] font-black text-secondary uppercase">C5 Link</span>
            </div>
          </div>
        </div>

        {/* Incidentes Dinámicos de Usuarios */}
        <TooltipProvider>
          {activeIncidents.map(inc => (
            <div 
              key={inc.id}
              className="absolute w-14 h-14 -translate-x-1/2 -translate-y-full z-40"
              style={{ top: inc.coords.top, left: inc.coords.left }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                      "cursor-pointer drop-shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all",
                      inc.severity === 'critica' ? "animate-bounce text-red-600 scale-125" : "text-orange-500"
                  )}>
                    <div className="relative flex flex-col items-center">
                        {inc.category === 'SOS' && (
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center border-4 border-red-600 shadow-2xl z-50">
                                <Zap className="w-5 h-5 text-red-600 fill-red-600 animate-pulse" />
                            </div>
                        )}
                        <MapPin className="w-14 h-14" fill="currentColor" stroke="white" strokeWidth={2} />
                        <span className="mt-[-15px] text-[8px] font-black bg-red-600 text-white px-2 py-0.5 rounded shadow-lg uppercase whitespace-nowrap">
                            ALERTA: {inc.userName}
                        </span>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none p-5 w-72 rounded-[2rem] shadow-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className={cn(
                        "text-[10px] font-black uppercase px-3 py-1 rounded-full",
                        inc.severity === 'critica' ? "bg-red-500 text-white" : "bg-orange-500 text-white"
                    )}>{inc.category}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{inc.time}</span>
                  </div>
                  <p className="font-black text-lg leading-tight mb-2 uppercase tracking-tighter">{inc.description}</p>
                  <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-bold mb-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-secondary" /> {inc.zone}
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-secondary" /> {inc.userName}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Respuesta Táctica Iniciada</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>

        {/* Calles e Infraestructura Urbana Visual (Inventada) */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute top-[20%] left-0 w-full h-[2px] bg-slate-900"></div>
            <div className="absolute top-[80%] left-0 w-full h-[2px] bg-slate-900"></div>
            <div className="absolute top-0 left-[20%] w-[2px] h-full bg-slate-900"></div>
            <div className="absolute top-0 left-[80%] w-[2px] h-full bg-slate-900"></div>
        </div>
      </div>
    </div>
  );
}
