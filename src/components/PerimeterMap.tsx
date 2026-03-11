'use client';

import { MapPin, School } from 'lucide-react';
import { Incident } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PerimeterMapProps {
  incidents: Incident[];
}

export default function PerimeterMap({ incidents }: PerimeterMapProps) {
  const activeIncidents = incidents.filter(i => i.status === 'pendiente');

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-headline">Mapa de Calor y Riesgos</h3>
          <p className="text-sm text-slate-500">Monitoreo en tiempo real del perímetro y accesos.</p>
        </div>
        <div className="flex gap-3">
          <span className="inline-flex items-center gap-2 text-xs bg-white border px-3 py-1.5 rounded-full shadow-sm">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div> Puertas
          </span>
          <span className="inline-flex items-center gap-2 text-xs bg-white border px-3 py-1.5 rounded-full shadow-sm">
            <div className="w-3 h-3 rounded-full bg-red-500"></div> Incidentes
          </span>
        </div>
      </div>
      
      <div className="flex-1 bg-grid-pattern rounded-2xl border border-slate-300 shadow-inner relative overflow-hidden min-h-[500px]">
        {/* Edificio Principal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] map-building rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm bg-slate-200/80">
          <div className="text-center">
            <School className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h2 className="text-slate-600 font-bold text-xl tracking-widest uppercase font-headline">Plantel</h2>
          </div>
        </div>
        
        {/* Accesos Fijos */}
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-4 flex flex-col items-center group cursor-pointer">
          <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded mb-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Puerta Norte</div>
          <div className="w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg z-10 relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
          </div>
        </div>

        <div className="absolute bottom-[30%] left-1/2 -translate-x-1/2 translate-y-4 flex flex-col items-center group cursor-pointer">
          <div className="w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg z-10 relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-50"></div>
          </div>
          <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded mt-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Puerta Sur</div>
        </div>

        <div className="absolute top-1/2 left-[30%] -translate-x-4 -translate-y-1/2 flex items-center group cursor-pointer">
          <div className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded mr-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">Entrada Proveedores</div>
          <div className="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
        </div>

        {/* Dynamic Incident Pins */}
        <TooltipProvider>
          {activeIncidents.map(inc => (
            <div 
              key={inc.id}
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-full z-20"
              style={{ top: inc.coords.top, left: inc.coords.left }}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="pin-bounce text-red-500 cursor-pointer drop-shadow-md">
                    <MapPin className="w-8 h-8" fill="currentColor" stroke="white" strokeWidth={1} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-slate-800 text-white border-none p-3 w-48 shadow-xl">
                  <p className="font-bold text-amber-400 text-xs mb-1 uppercase">{inc.category}</p>
                  <p className="text-[11px] leading-tight mb-2">{inc.description}</p>
                  <p className="text-[9px] text-slate-400 italic">Reportado por: {inc.user}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}