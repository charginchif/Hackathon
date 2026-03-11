'use client';

import { Role } from '@/lib/types';
import { ROLES_CONFIG } from '@/lib/mocks';
import { Shield, Home, Megaphone, PieChart, Map, BadgeCheck, ClipboardList, LogOut } from 'lucide-react';
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
}

export default function Sidebar({ role, activeSection, onSectionChange, onLogout }: SidebarProps) {
  const config = ROLES_CONFIG[role];

  return (
    <aside className="w-full lg:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 z-20 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 text-white mb-2">
          <Shield className="w-8 h-8 text-emerald-500" />
          <span className="font-bold text-xl tracking-wide font-headline">ES-2026</span>
        </div>
        <p className="text-xs text-slate-500 uppercase font-semibold">Panel de Control Módulo MVP</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {config.nav.map(item => {
          const Icon = iconMap[item.icon];
          const isActive = activeSection === item.id;
          return (
            <button 
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl transition font-medium group",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-200")} /> 
              {item.text}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}