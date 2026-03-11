'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, School, ChevronRight, LogOut, Bell, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROLES_CONFIG, mockIncidents, mockAccessLogs } from '@/lib/mocks';
import { Role, User, Incident, AccessLog } from '@/lib/types';
import Dashboard from '@/components/Dashboard';
import PerimeterMap from '@/components/PerimeterMap';
import AccessControl from '@/components/AccessControl';
import IncidentManagement from '@/components/IncidentManagement';
import ReportIncident from '@/components/ReportIncident';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [accessLogs] = useState<AccessLog[]>(mockAccessLogs);

  const login = (role: Role) => {
    const config = ROLES_CONFIG[role];
    const user: User = {
      id: role === 'alumno' ? '123' : '456',
      name: config.name,
      role: role,
      roleDisplay: config.roleDisplay
    };
    setCurrentUser(user);
    setActiveSection(config.defaultSection);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
    setActiveSection('dashboard');
  };

  const handleUpdateIncidentStatus = (id: number, status: 'atendido') => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
  };

  if (!currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center relative z-10 border border-emerald-500/20">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full text-emerald-600 shadow-inner">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight mb-1 font-headline">Escuelas Seguras</h1>
          <p className="text-slate-500 mb-8 font-medium">Plataforma de Inmunidad Urbana</p>
          
          <div className="space-y-4 text-left">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ingresar al MVP como:</p>
            <button 
              onClick={() => login('alumno')}
              className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center group-hover:bg-emerald-200 group-hover:text-emerald-700 transition-colors">
                  <UserCheck className="w-5 h-5 text-slate-500 group-hover:text-emerald-700" />
                </div>
                <div>
                  <span className="block font-bold text-slate-700">Comunidad</span>
                  <span className="text-xs text-slate-500">Alumno, Padre o Vecino</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>

            <button 
              onClick={() => login('autoridad')}
              className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                  <School className="w-5 h-5 text-slate-500 group-hover:text-blue-700" />
                </div>
                <div>
                  <span className="block font-bold text-slate-700">Autoridad</span>
                  <span className="text-xs text-slate-500">Director, Prefecto, C5</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-background">
      <Sidebar 
        role={currentUser.role} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={logout} 
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 font-headline">
            {ROLES_CONFIG[currentUser.role].nav.find(n => n.id === activeSection)?.text || 'Vista General'}
          </h2>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-xs text-emerald-600 font-medium capitalize">{currentUser.roleDisplay}</p>
              </div>
              <div className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth">
          {activeSection === 'dashboard' && <Dashboard role={currentUser.role} incidents={incidents} onNavigate={setActiveSection} />}
          {activeSection === 'mapa' && <PerimeterMap incidents={incidents} />}
          {activeSection === 'accesos' && <AccessControl logs={accessLogs} />}
          {activeSection === 'gestion' && <IncidentManagement incidents={incidents} onResolve={handleUpdateIncidentStatus} />}
          {activeSection === 'reportar' && <ReportIncident onReport={handleAddIncident} userName={currentUser.name} />}
        </div>
      </main>
    </div>
  );
}