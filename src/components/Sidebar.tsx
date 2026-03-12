'use client';

import { Role, Campus } from '@/lib/types';
import { ROLES_CONFIG } from '@/lib/mocks';
import { Home, Megaphone, PieChart, Map, BadgeCheck, ClipboardList, LogOut, Landmark, MapPin } from 'lucide-react';
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
    <aside className="w-full lg:w-80 bg-primary text-slate-300 flex flex-col shrink-0 border-r border-white/5 z-20 shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3 text-white mb-2">
          <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <Landmark className="w-7 h-7 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl tracking-tighter leading-none">UNE</span>
            <span className="text-[10px] font-bold text-secondary tracking-widest uppercase">Seguridad 2026</span>
          </div>
        </div>
        {campus !== 'Global' && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 w-full">
            <MapPin className="w-3 h-3 text-secondary" />
            <span className="text-[10px] font-bold text-slate-300 truncate uppercase">{campus}</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto p-6 space-y-3">
        {config.nav.map(item => {
          const Icon = iconMap[item.icon];
          const isActive = activeSection === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold group",
                isActive 
                  ? "bg-secondary text-primary shadow-lg scale-105" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-slate-500 group-hover:text-white")} /> 
              {item.text}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" /> FINALIZAR SESIÓN
        </button>
      </div>
    </aside>
  );
}
