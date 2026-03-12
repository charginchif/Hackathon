
'use client';

import { MapPin, School, ShieldAlert, ShieldCheck, Zap, DoorOpen, DoorClosed, Wrench, User, AlertTriangle, Building2, Navigation, Cctv, Lamp, TreeDeciduous, ParkingCircle, Hospital, ShoppingCart, Shield, Pill, Coffee, Trees } from 'lucide-react';
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
    case 'hospital': return <Hospital className="w-4 h-4" />;
    case 'comercio': return <ShoppingCart className="w-4 h-4" />;
    case 'policia': return <Shield className="w-4 h-4" />;
    case 'farmacia': return <Pill className="w-4 h-4" />;
    case 'cafeteria': return <Coffee className="w-4 h-4" />;
    case 'parque': return <Trees className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getMarkerColor = (type: MapMarker['type']) => {
  switch (type) {
    case 'entrada': return "bg-emerald-500 text-white";
    case 'salida': return "bg-slate-700 text-white";
    case 'falla': return "bg-yellow-500 text-white animate-bounce";
    case 'cctv': return "bg-blue-600 text-white";
    case 'edificio': return "bg-indigo-900 text-white";
    case 'calle': return "bg-slate-400 text-white opacity-40";
    case 'parking': return "bg-indigo-400 text-white";
    case 'hospital': return "bg-red-500 text-white";
    case 'policia': return "bg-blue-800 text-white shadow-[0_0_15px_rgba(30,64,175,0.5)]";
    case 'comercio': return "bg-orange-500 text-white";
    case 'farmacia': return "bg-emerald-400 text-white";
    case 'parque': return "bg-green-600 text-white";
    case 'cafeteria': return "bg-amber-700 text-white";
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
          <h3 className="text-xl font-black text-primary font-headline uppercase tracking-tight">Mapa de Entorno Urbano</h3>
          <p className="text-sm text-slate-500 font-medium">Comunidad Alerta: Unidos por un entorno más seguro.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1 text-[10px] font-bold">Zona Segura</Badge>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-[10px] font-bold">Servicios</Badge>
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 px-3 py-1 text-[10px] font-bold">Alerta Activa</Badge>
        </div>
      </div>
      
      <div className="flex-1 bg-slate-100 rounded-[2.5rem] border-4 border-white shadow-2xl relative overflow-hidden min-h-[650px]">
        {/* Radar Animation Elements */}
        <div className="radar-sweep"></div>
        
        {/* Calles y Cuadrícula Urbana Estilo Google Maps */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-[20%] left-0 w-full h-8 bg-slate-300"></div>
            <div className="absolute top-[80%] left-0 w-full h-8 bg-slate-300"></div>
            <div className="absolute top-0 left-[20%] w-8 h-full bg-slate-300"></div>
            <div className="absolute top-0 left-[80%] w-8 h-full bg-slate-300"></div>
            <div className="absolute top-[50%] left-0 w-full h-4 bg-slate-300 rotate-1"></div>
            <div className="absolute top-0 left-[50%] w-4 h-full bg-slate-300 -rotate-1"></div>
        </div>

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
                                    "w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-all group-hover:scale-125 group-hover:z-50",
                                    getMarkerColor(marker.type)
                                )}>
                                    {getMarkerIcon(marker.type)}
                                </div>
                                <span className="text-[7px] md:text-[9px] font-black text-slate-800 uppercase bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm border border-slate-200 whitespace-nowrap opacity-100 transition-all group-hover:bg-primary group-hover:text-white">
                                    {marker.label}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white p-3 border-none rounded-xl shadow-2xl">
                            <p className="text-xs font-black uppercase mb-1">{marker.label}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Categoría: {marker.type}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </TooltipProvider>

        {/* Centro de Mando Táctico (Edificio Principal) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 bg-white/90 backdrop-blur-md border-b-8 border-b-secondary border-4 border-primary rounded-[3rem] flex flex-col items-center justify-center shadow-2xl z-10 group hover:scale-105 transition-all">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-3 shadow-inner group-hover:rotate-6 transition-transform">
            <School className="w-10 h-10 text-secondary" />
          </div>
          <span className="text-primary font-black text-sm md:text-base uppercase tracking-[0.2em] font-headline text-center px-4 leading-none">COMUNIDAD ALERTA</span>
          <p className="text-[7px] font-bold text-slate-400 uppercase mt-2 tracking-widest text-center">Unidos por un entorno más seguro</p>
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
                      "cursor-pointer drop-shadow-[0_0_20px_rgba(239,68,68,0.7)] transition-all",
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
      </div>
    </div>
  );
}
