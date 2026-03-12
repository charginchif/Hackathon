'use client';

import { MapPin, School, ShieldAlert, ShieldCheck, Zap, DoorOpen, DoorClosed, Wrench, User, AlertTriangle } from 'lucide-react';
import { Incident, ZoneOverlay, MapMarker } from '@/lib/types';
import { campusZones, campusMarkers } from '@/lib/mocks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PerimeterMapProps {
  incidents: Incident[];
  campus: string;
}

export default function PerimeterMap({ incidents, campus }: PerimeterMapProps) {
  const activeIncidents = incidents.filter(i => i.status === 'pendiente' && (campus === 'Global' ? true : i.campus === campus));
  const zones = campusZones[campus] || [];
  const markers = campusMarkers[campus] || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-xl font-black text-primary font-headline uppercase tracking-tight">Mapa Táctico Perimetral</h3>
          <p className="text-sm text-slate-500 font-medium">Visualización de riesgos, accesos y estado de infraestructura en tiempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Zona Segura</Badge>
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Riesgo Bajo</Badge>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">Riesgo Alto</Badge>
          <Badge className="bg-red-100 text-red-700 border-red-200">Crítico</Badge>
        </div>
      </div>
      
      <div className="flex-1 bg-grid-pattern rounded-[2rem] border border-slate-200 shadow-2xl relative overflow-hidden min-h-[600px] bg-slate-50">
        {/* Capas de Riesgo */}
        {zones.map(zone => (
          <div 
            key={zone.id}
            className={cn(
              "absolute rounded-3xl border-2 transition-all duration-700",
              zone.type === 'danger-high' && "danger-high animate-pulse",
              zone.type === 'danger-mid' && "danger-mid",
              zone.type === 'danger-low' && "danger-low",
              zone.type === 'safe' && "safe-zone"
            )}
            style={zone.coords}
          >
            <div className="absolute -top-7 left-2 whitespace-nowrap">
                <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-slate-900 text-white shadow-sm">
                    {zone.name}
                </span>
            </div>
          </div>
        ))}

        {/* Puntos de Infraestructura y Accesos */}
        <TooltipProvider>
            {markers.map(marker => (
                <div key={marker.id} className="absolute" style={marker.coords}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className={cn(
                                "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-transform hover:scale-125",
                                marker.type === 'entrada' ? "bg-emerald-500 text-white" :
                                marker.type === 'salida' ? "bg-slate-700 text-white" :
                                marker.type === 'falla' ? "bg-yellow-500 text-white animate-bounce" :
                                "bg-indigo-400 text-white opacity-60"
                            )}>
                                {marker.type === 'entrada' && <DoorOpen className="w-4 h-4" />}
                                {marker.type === 'salida' && <DoorClosed className="w-4 h-4" />}
                                {marker.type === 'falla' && <Wrench className="w-4 h-4" />}
                                {marker.type === 'estudiante' && <User className="w-4 h-4" />}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-2 border-none">
                            <p className="text-[10px] font-bold uppercase">{marker.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </TooltipProvider>

        {/* Edificio Central Institucional */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-40 bg-white/90 backdrop-blur-md border-b-8 border-b-secondary border-4 border-primary rounded-[2.5rem] flex flex-col items-center justify-center shadow-2xl z-10 group hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-inner">
            <School className="w-10 h-10 text-secondary" />
          </div>
          <span className="text-primary font-black text-sm uppercase tracking-[0.2em] font-headline">NÚCLEO ISSU</span>
          <div className="mt-3 flex gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></span>
          </div>
        </div>

        {/* Incidentes Dinámicos */}
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
                      "cursor-pointer drop-shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all",
                      inc.severity === 'critica' ? "animate-bounce text-red-600 scale-125" : "text-orange-500"
                  )}>
                    <div className="relative">
                        {inc.category === 'SOS' && (
                            <div className="absolute -top-3 -right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center border-4 border-red-600 shadow-xl">
                                <Zap className="w-4 h-4 text-red-600 fill-red-600 animate-pulse" />
                            </div>
                        )}
                        <MapPin className="w-12 h-12" fill="currentColor" stroke="white" strokeWidth={2} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none p-5 w-64 rounded-3xl shadow-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <Badge className={cn(
                        "text-[9px] font-black uppercase",
                        inc.severity === 'critica' ? "bg-red-500" : "bg-orange-500"
                    )}>{inc.category}</Badge>
                    <span className="text-[9px] text-slate-400 font-bold">{inc.time}</span>
                  </div>
                  <p className="font-bold text-base leading-tight mb-2">{inc.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <MapPin className="w-3 h-3 text-secondary" /> {inc.zone}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    <span className="text-[10px] font-black text-red-400 uppercase">Respuesta en Camino</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border", className)}>
            {children}
        </span>
    );
}
