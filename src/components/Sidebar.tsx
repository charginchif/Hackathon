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
    <aside className="w-full h-full bg-primary text-primary-foreground flex flex-col shrink-0 border-r border-muted/30 z-20 shadow-[10px_0_30px_rgba(150,147,155,0.25)] overflow-hidden">
      <div className="p-8 lg:p-10 border-b border-primary-foreground/20 bg-primary/95">
        <div className="flex items-center gap-4 text-primary-foreground mb-5">
          <div className="w-20 h-20 lg:w-24 lg:h-24 bg-background rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-muted/40 overflow-hidden p-2">
            <img src="/iconos/IconoLogo.png" alt="Comunidad Alerta Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg lg:text-xl tracking-tighter leading-none uppercase">Comunidad</span>
            <span className="font-black text-lg lg:text-xl tracking-tighter leading-none uppercase text-secondary-foreground">Alerta</span>
          </div>
        </div>
        <p className="text-[8px] lg:text-[9px] font-black text-primary-foreground/75 tracking-widest uppercase mb-4 leading-tight">Unidos por un entorno más seguro</p>
        
        {campus !== 'Global' && (
          <div className="mt-2 inline-flex items-center gap-3 px-4 py-2 bg-background/95 rounded-2xl border border-muted/30 w-full">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-[9px] lg:text-[10px] font-black text-foreground truncate uppercase tracking-widest">{campus}</span>
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
                  ? "bg-secondary text-secondary-foreground shadow-[0_10px_24px_rgba(197,22,23,0.35)] scale-[1.02]" 
                  : "text-primary-foreground/80 hover:bg-background/20 hover:text-primary-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 lg:w-6 lg:h-6", isActive ? "text-secondary-foreground" : "text-primary-foreground/65 group-hover:text-primary-foreground")} /> 
              {item.text}
            </button>
          );
        })}
      </nav>

      <div className="p-6 lg:p-8 border-t border-primary-foreground/20 bg-primary/95">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-4 lg:p-5 rounded-[1rem] lg:rounded-[1.25rem] text-primary-foreground/70 hover:bg-background/20 hover:text-primary-foreground transition-all font-black text-[10px] lg:text-xs uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5" /> DESCONECTAR TERMINAL
        </button>
      </div>
    </aside>
  );
}
