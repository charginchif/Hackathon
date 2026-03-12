'use client';

import { MapPin, School, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { Incident, ZoneOverlay } from '@/lib/types';
import { campusZones } from '@/lib/mocks';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PerimeterMapProps {
  incidents: Incident[];
  campus: string;
}

export default function PerimeterMap({ incidents, campus }: PerimeterMapProps) {
  const activeIncidents = incidents.filter(i => i.status === 'pendiente' && (campus === 'Global' ? true : i.campus === campus));
  const zones = campusZones[campus] || [];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-headline">Mapa Perimetral Inteligente</h3>
          <p className="text-sm text-slate-500">Monitoreo dinámico de zonas calientes y perímetros seguros.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <ShieldCheck className="w-3 h-3" /> Zonas Seguras
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <ShieldAlert className="w-3 h-3" /> Zonas de Riesgo
          </div>
        </div>
      </div>
      
      <div className="flex-1 bg-grid-pattern rounded-3xl border border-slate-200 shadow-inner relative overflow-hidden min-h-[550px] bg-slate-50">
        {/* Layout del Campus (Simulado Estilo CUCEI) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            {/* Dibujamos edificios simulados */}
            <div className="absolute top-[20%] left-[15%] w-32 h-48 bg-slate-400 rounded-lg"></div>
            <div className="absolute top-[10%] left-[45%] w-48 h-20 bg-slate-400 rounded-lg"></div>
            <div className="absolute bottom-[20%] right-[15%] w-40 h-40 bg-slate-400 rounded-lg"></div>
            <div className="absolute top-[40%] right-[30%] w-24 h-64 bg-slate-400 rounded-lg"></div>
        </div>

        {/* Zonas de Riesgo/Seguridad */}
        {zones.map(zone => (
          <div 
            key={zone.id}
            className={cn(
              "absolute rounded-2xl border-2 transition-all duration-500",
              zone.type === 'danger' 
                ? "bg-red-500/20 border-red-500 animate-pulse" 
                : "bg-emerald-500/20 border-emerald-500"
            )}
            style={zone.coords}
          >
            <div className={cn(
                "absolute -top-6 left-0 text-[8px] font-black uppercase px-2 py-0.5 rounded",
                zone.type === 'danger' ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
            )}>
                {zone.name}
            </div>
          </div>
        ))}

        {/* Edificio Central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 bg-white/80 backdrop-blur border-4 border-primary rounded-3xl flex flex-col items-center justify-center shadow-2xl z-10">
          <School className="w-8 h-8 text-primary mb-1" />
          <span className="text-primary font-black text-xs uppercase tracking-widest">Torre UNE</span>
          <div className="mt-2 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
          </div>
        </div>

        {/* Incidentes Dinámicos */}
        <TooltipProvider>
          {activeIncidents.map(inc => (
            <div 
              key={inc.id}
              className="absolute w-12 h-12 -translate-x-1/2 -translate-y-full z-30"
              style={{ top: inc.coords.top, left: inc.coords.left }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={cn(
                      "cursor-pointer drop-shadow-xl transition-transform hover:scale-125",
                      inc.severity === 'critica' ? "animate-bounce text-red-600" : "text-amber-500"
                  )}>
                    <div className="relative">
                        {inc.category === 'SOS' && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-red-600">
                                <Zap className="w-3 h-3 text-red-600 fill-red-600 animate-pulse" />
                            </div>
                        )}
                        <MapPin className="w-10 h-10" fill="currentColor" stroke="white" strokeWidth={1.5} />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-900 text-white border-none p-4 w-56 rounded-2xl shadow-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                        inc.severity === 'critica' ? "bg-red-500" : "bg-amber-500"
                    )}>{inc.category}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{inc.time}</span>
                  </div>
                  <p className="font-bold text-sm leading-tight mb-1">{inc.description}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {inc.zone}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}