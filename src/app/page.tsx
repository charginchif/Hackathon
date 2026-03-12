'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, School, ChevronRight, LogOut, Bell, User as UserIcon, ScanFace, Loader2, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROLES_CONFIG, mockIncidents, mockAccessLogs, CAMPUSES } from '@/lib/mocks';
import { Role, User, Incident, AccessLog, Campus } from '@/lib/types';
import Dashboard from '@/components/Dashboard';
import PerimeterMap from '@/components/PerimeterMap';
import AccessControl from '@/components/AccessControl';
import IncidentManagement from '@/components/IncidentManagement';
import ReportIncident from '@/components/ReportIncident';
import Sidebar from '@/components/Sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [activeCampus, setActiveCampus] = useState<Campus>('UNE Campus Central');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [accessLogs] = useState<AccessLog[]>(mockAccessLogs);
  
  // Biometric login states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  const startLoginFlow = (role: Role) => {
    setPendingRole(role);
    setIsScanning(true);
    setScanProgress(0);
  };

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => setScanProgress(p => p + 5), 100);
      return () => clearTimeout(timer);
    } else if (isScanning && scanProgress >= 100) {
      setTimeout(() => {
        if (pendingRole) completeLogin(pendingRole);
      }, 500);
    }
  }, [isScanning, scanProgress, pendingRole]);

  const completeLogin = (role: Role) => {
    const config = ROLES_CONFIG[role];
    const user: User = {
      id: role === 'alumno' ? 'U-7821' : 'A-101',
      name: config.name,
      role: role,
      roleDisplay: config.roleDisplay
    };
    setCurrentUser(user);
    setActiveSection(config.defaultSection);
    setIsScanning(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsScanning(false);
    setScanProgress(0);
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
        
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center relative z-10 border border-secondary/20">
          {!isScanning ? (
            <>
              <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-primary rounded-2xl text-secondary shadow-lg">
                <ShieldCheck className="w-14 h-14" />
              </div>
              <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-1 font-headline">ESCUELAS SEGURAS UNE</h1>
              <p className="text-slate-500 mb-8 font-medium">Plataforma Institucional de Prevención</p>
              
              <div className="space-y-4 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <ScanFace className="w-4 h-4" /> Autenticación Biométrica FaceID
                </p>
                <button 
                  onClick={() => startLoginFlow('alumno')}
                  className="w-full flex items-center justify-between p-5 border border-slate-200 rounded-2xl hover:border-secondary hover:bg-secondary/5 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-secondary group-hover:text-primary transition-colors">
                      <UserCheck className="w-6 h-6 text-slate-500 group-hover:text-primary" />
                    </div>
                    <div>
                      <span className="block font-bold text-primary">Comunidad Universitaria</span>
                      <span className="text-xs text-slate-500">Alumnos, Docentes, Staff</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-secondary" />
                </button>

                <button 
                  onClick={() => startLoginFlow('autoridad')}
                  className="w-full flex items-center justify-between p-5 border border-slate-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <Landmark className="w-6 h-6 text-slate-500 group-hover:text-white" />
                    </div>
                    <div>
                      <span className="block font-bold text-primary">Autoridad UNE</span>
                      <span className="text-xs text-slate-500">Dirección, C5 Institucional</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 rounded-3xl border-4 border-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <UserIcon className="w-24 h-24 text-slate-200" />
                  </div>
                </div>
                {/* Scan Overlay */}
                <div className="face-scan-line"></div>
                <div className={`absolute inset-0 border-4 border-secondary rounded-3xl transition-opacity duration-300 ${scanProgress > 90 ? 'opacity-100' : 'opacity-0 animate-pulse'}`}></div>
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2">Validando Biometría...</h2>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-secondary transition-all duration-100 ease-out"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-slate-400 text-sm font-medium">Por favor, mantenga su rostro frente a la cámara.</p>
              {scanProgress >= 100 && <div className="mt-4 text-emerald-500 flex items-center gap-2 font-bold animate-bounce"><ShieldCheck className="w-5 h-5" /> Acceso Concedido</div>}
            </div>
          )}
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
        <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-primary font-headline tracking-tight uppercase">
              {ROLES_CONFIG[currentUser.role].nav.find(n => n.id === activeSection)?.text || 'Vista General'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistema En Línea - UNE Red Segura</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">PLANTEL:</span>
              <Select value={activeCampus} onValueChange={(v: Campus) => setActiveCampus(v)}>
                <SelectTrigger className="w-[220px] bg-slate-50 border-slate-200 font-bold text-primary rounded-xl h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  {CAMPUSES.map(c => (
                    <SelectItem key={c} value={c} className="font-medium">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button className="relative text-slate-400 hover:text-primary transition group p-2 rounded-full hover:bg-slate-50">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-primary leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-tight">{currentUser.roleDisplay}</p>
              </div>
              <div className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center font-bold shadow-lg border-2 border-slate-100">
                <UserIcon className="w-7 h-7" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          {activeSection === 'dashboard' && <Dashboard role={currentUser.role} campus={activeCampus} incidents={incidents} onNavigate={setActiveSection} />}
          {activeSection === 'mapa' && <PerimeterMap campus={activeCampus} incidents={incidents} />}
          {activeSection === 'accesos' && <AccessControl logs={accessLogs} campus={activeCampus} />}
          {activeSection === 'gestion' && <IncidentManagement incidents={incidents} onResolve={handleUpdateIncidentStatus} campus={activeCampus} />}
          {activeSection === 'reportar' && <ReportIncident onReport={handleAddIncident} userName={currentUser.name} campus={activeCampus} />}
        </div>
      </main>
    </div>
  );
}
