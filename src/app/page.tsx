'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, ChevronRight, Bell, User as UserIcon, ScanFace, Mail, Lock, Landmark, Loader2, Zap, LayoutDashboard, Map as MapIcon, Megaphone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLES_CONFIG, mockIncidents, mockAccessLogs, CAMPUSES, MOCK_USERS } from '@/lib/mocks';
import { Role, User, Incident, AccessLog, Campus } from '@/lib/types';
import Dashboard from '@/components/Dashboard';
import PerimeterMap from '@/components/PerimeterMap';
import AccessControl from '@/components/AccessControl';
import IncidentManagement from '@/components/IncidentManagement';
import ReportIncident from '@/components/ReportIncident';
import Sidebar from '@/components/Sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmergencyModal from '@/components/EmergencyModal';
import StudentAccess from '@/components/StudentAccess';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [activeCampus, setActiveCampus] = useState<Campus>('Campus Metropolitano');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>(mockAccessLogs);
  const [activeEmergency, setActiveEmergency] = useState<Incident | null>(null);
  
  // Login states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Monitor SOS events for admin
  useEffect(() => {
    if (currentUser?.role === 'autoridad') {
      const emergency = incidents.find(i => i.category === 'SOS' && i.status === 'pendiente');
      if (emergency) {
        setActiveEmergency(emergency);
      }
    }
  }, [incidents, currentUser]);

  const startBiometricLogin = (userId: string) => {
    setIsScanning(true);
    setScanProgress(0);
    setLoginError('');
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const user = MOCK_USERS[userId];
            handleLoginSuccess(user);
          }, 600);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    setTimeout(() => {
      const userFound = Object.values(MOCK_USERS).find(u => u.email === loginEmail && u.password === loginPass);
      if (userFound) {
        handleLoginSuccess(userFound);
      } else {
        setLoginError('Credenciales ISSU no válidas.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'alumno') {
      setActiveCampus(user.campus);
    } else {
      setActiveCampus('Campus Metropolitano');
    }
    setActiveSection(ROLES_CONFIG[user.role].defaultSection);
    setIsScanning(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsScanning(false);
    setScanProgress(0);
    setLoginEmail('');
    setLoginPass('');
    setLoginError('');
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
    if (newIncident.category !== 'SOS') {
        setActiveSection('dashboard');
    }
  };

  const handleAddAccessLog = (newLog: AccessLog) => {
    setAccessLogs(prev => [newLog, ...prev]);
  };

  const handleUpdateIncidentStatus = (id: number, status: 'atendido' | 'despachado') => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status } : inc));
    if (activeEmergency?.id === id) setActiveEmergency(null);
  };

  const handleSOS = () => {
    const newSOS: Incident = {
        id: Date.now(),
        category: 'SOS',
        description: 'ALERTA SOS: USUARIO SOLICITA AUXILIO INMEDIATO',
        zone: 'ZONA DE RIESGO DETECTADA',
        campus: currentUser?.campus as Exclude<Campus, 'Global'>,
        status: 'pendiente',
        severity: 'critica',
        user: currentUser?.name || 'Usuario Anónimo',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coords: { top: '50%', left: '50%' }
    };
    handleAddIncident(newSOS);
  };

  if (!currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-indigo-950 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 relative z-10 border border-slate-200">
          {!isScanning ? (
            <>
              <div className="text-center mb-10">
                <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-primary rounded-3xl text-secondary shadow-xl border-4 border-slate-50">
                  <Landmark className="w-14 h-14" />
                </div>
                <h1 className="text-3xl font-black text-primary tracking-tighter mb-2 font-headline uppercase leading-none">ISSU SEGURIDAD</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Instituto de Seguridad Superior Urbana</p>
              </div>

              <Tabs defaultValue="biometric" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-10 bg-slate-100 p-1.5 rounded-2xl">
                  <TabsTrigger value="biometric" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs uppercase">Biometría</TabsTrigger>
                  <TabsTrigger value="email" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-xs uppercase">Credenciales</TabsTrigger>
                </TabsList>

                <TabsContent value="biometric" className="space-y-6">
                  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 mb-8 flex items-start gap-4">
                    <ScanFace className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-[11px] text-indigo-900 leading-relaxed font-medium">El sistema ISSU utiliza reconocimiento facial avanzado para validar su identidad en cualquier campus de la red.</p>
                  </div>

                  <div className="grid gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => startBiometricLogin('alumno_metro')}
                      className="justify-between h-16 border-slate-200 hover:border-primary hover:bg-primary/5 rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <UserCheck className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                        <div className="text-left">
                          <p className="text-sm font-black text-primary leading-none mb-1">Estudiante ISSU</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Campus Metropolitano</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => startBiometricLogin('admin_global')}
                      className="justify-between h-16 border-secondary/20 hover:border-secondary hover:bg-secondary/5 rounded-2xl group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Landmark className="w-6 h-6 text-slate-400 group-hover:text-secondary" />
                        <div className="text-left">
                          <p className="text-sm font-black text-primary leading-none mb-1">Autoridad Institucional</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dirección de Seguridad</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-6">
                  <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Identificador ISSU</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          type="email" 
                          placeholder="usuario@issu.edu.mx" 
                          className="pl-12 rounded-2xl h-14 border-slate-200"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Token de Acceso</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-12 rounded-2xl h-14 border-slate-200"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {loginError && <p className="text-xs text-secondary font-black bg-secondary/5 p-3 rounded-xl text-center border border-secondary/20">{loginError}</p>}
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black shadow-xl text-white uppercase tracking-widest"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Sincronizar Acceso'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="relative w-56 h-56 mb-10">
                <div className="absolute inset-0 rounded-[3rem] border-8 border-slate-50 overflow-hidden shadow-inner">
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <UserIcon className="w-28 h-28 text-slate-200" />
                  </div>
                </div>
                <div className="face-scan-line"></div>
                <div className={`absolute inset-0 border-4 border-secondary rounded-[3rem] transition-opacity duration-500 ${scanProgress > 90 ? 'opacity-100' : 'opacity-0 animate-pulse'}`}></div>
              </div>
              <h2 className="text-2xl font-black text-primary mb-2 font-headline uppercase tracking-tight">Escaneando Biometría</h2>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6 shadow-inner">
                <div 
                  className="h-full bg-primary transition-all duration-100 ease-out shadow-[0_0_10px_rgba(30,27,75,0.5)]"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Protocolo de Identidad ISSU v2.0</p>
              {scanProgress >= 100 && (
                <div className="mt-6 text-emerald-600 flex items-center gap-2 font-black animate-bounce bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100 uppercase text-xs tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> Autorizado
                </div>
              )}
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
        campus={currentUser.campus}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white h-24 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-primary font-headline tracking-tighter uppercase leading-none">
              {ROLES_CONFIG[currentUser.role].nav.find(n => n.id === activeSection)?.text || 'Operaciones'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enlace Satelital Activo • ISSU-NET</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {currentUser.role === 'alumno' && (
                <Button 
                    onClick={handleSOS}
                    className="bg-secondary hover:bg-secondary/90 text-white font-black px-8 py-6 rounded-2xl shadow-2xl animate-pulse flex gap-3 border-b-4 border-b-black/20"
                >
                    <Zap className="w-6 h-6 fill-white" /> BOTÓN SOS
                </Button>
            )}

            {currentUser.role === 'autoridad' && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Central de Mando:</span>
                <Select value={activeCampus as string} onValueChange={(v: Campus) => setActiveCampus(v)}>
                  <SelectTrigger className="w-[260px] bg-slate-50 border-slate-200 font-black text-primary rounded-2xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-200">
                    {CAMPUSES.map(c => (
                      <SelectItem key={c} value={c} className="font-bold text-xs uppercase">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <button className="relative text-slate-300 hover:text-primary transition group p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-secondary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-primary leading-tight uppercase tracking-tighter">{currentUser.name}</p>
                <p className="text-[9px] text-secondary font-black uppercase tracking-widest">{currentUser.roleDisplay}</p>
              </div>
              <div className="w-14 h-14 bg-indigo-900 text-secondary rounded-[1.25rem] flex items-center justify-center font-bold shadow-xl border-4 border-slate-50 overflow-hidden group hover:scale-110 transition-transform cursor-pointer">
                <UserIcon className="w-8 h-8" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth bg-slate-50/50">
          {activeSection === 'dashboard' && (
            <Dashboard 
              role={currentUser.role} 
              campus={activeCampus as Campus} 
              incidents={incidents} 
              onNavigate={setActiveSection} 
            />
          )}
          {activeSection === 'mapa' && <PerimeterMap campus={activeCampus} incidents={incidents} />}
          {activeSection === 'accesos' && currentUser.role === 'autoridad' && <AccessControl logs={accessLogs} />}
          {activeSection === 'accesos' && currentUser.role === 'alumno' && <StudentAccess user={currentUser} logs={accessLogs} onRegisterAccess={handleAddAccessLog} />}
          {activeSection === 'gestion' && <IncidentManagement incidents={incidents} onResolve={handleUpdateIncidentStatus} />}
          {activeSection === 'reportar' && <ReportIncident onReport={handleAddIncident} userName={currentUser.name} />}
        </div>
      </main>

      {activeEmergency && (
        <EmergencyModal 
            incident={activeEmergency} 
            onClose={() => setActiveEmergency(null)} 
            onDispatch={(id) => handleUpdateIncidentStatus(id, 'despachado')}
        />
      )}
    </div>
  );
}
