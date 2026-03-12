'use client';

import { Role, Campus } from '@/lib/types';
import { ROLES_CONFIG } from '@/lib/mocks';
import { Home, Megaphone, PieChart, Map, BadgeCheck, ClipboardList, LogOut, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  Home: Home,
  Megaphone: Megaphone,
  PieChart: PieChart,
  Map: Map,
  BadgeCheck: BadgeCheck,
  ClipboardList: ClipboardList,
};

interface SidebarProps {
  role: Role;
  activeSection: string;
  onSectionChange: (id: string) => void;
  onLogout: () => void;
  campus: Campus;
}

export default function Sidebar({ role, activeSection, onSectionChange, onLogout, campus }: SidebarProps) {
  const config = ROLES_CONFIG[role];

  return (
    <aside className="w-full h-full bg-primary text-slate-300 flex flex-col shrink-0 border-r border-white/5 z-20 shadow-[10px_0_40px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="p-8 lg:p-10 border-b border-white/5 bg-black/10">
        <div className="flex items-center gap-4 text-white mb-4">
          <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white rounded-[1rem] lg:rounded-[1.25rem] flex items-center justify-center shadow-2xl border-2 border-white/10 overflow-hidden p-1">
            <img src="/iconos/Logo.png" alt="Comunidad Alerta Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg lg:text-xl tracking-tighter leading-none uppercase">Comunidad</span>
            <span className="font-black text-lg lg:text-xl tracking-tighter leading-none uppercase text-secondary">Alerta</span>
          </div>
        </div>
        <p className="text-[8px] lg:text-[9px] font-black text-white/40 tracking-widest uppercase mb-4 leading-tight">Unidos por un entorno más seguro</p>
        
        {campus !== 'Global' && (
          <div className="mt-2 inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 w-full">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span className="text-[9px] lg:text-[10px] font-black text-slate-300 truncate uppercase tracking-widest">{campus}</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-3 lg:space-y-4">
        {config.nav.map(item => {
          const Icon = iconMap[item.icon];
          const isActive = activeSection === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-4 lg:gap-5 p-4 lg:p-5 rounded-[1rem] lg:rounded-[1.25rem] transition-all duration-300 font-black text-xs lg:text-sm uppercase tracking-wider group",
                isActive 
                  ? "bg-secondary text-white shadow-[0_10px_30px_rgba(153,27,27,0.4)] scale-105" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5 lg:w-6 lg:h-6", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} /> 
              {item.text}
            </button>
          );
        })}
      </nav>

      <div className="p-6 lg:p-8 border-t border-white/5 bg-black/10">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-4 lg:p-5 rounded-[1rem] lg:rounded-[1.25rem] text-slate-500 hover:bg-secondary/10 hover:text-secondary transition-all font-black text-[10px] lg:text-xs uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5" /> DESCONECTAR TERMINAL
        </button>
      </div>
    </aside>
  );
}
