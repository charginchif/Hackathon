'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, ChevronRight, Bell, User as UserIcon, ScanFace, Mail, Lock, Landmark, Loader2, Zap } from 'lucide-react';
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

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [activeCampus, setActiveCampus] = useState<Campus>('UNE Campus Central');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [accessLogs] = useState<AccessLog[]>(mockAccessLogs);
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
        setLoginError('Credenciales inválidas. Por favor intente de nuevo.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'alumno') {
      setActiveCampus(user.campus);
    } else {
      setActiveCampus('UNE Campus Central');
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
      <div className="h-screen w-full flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative z-10 border border-secondary/20">
          {!isScanning ? (
            <>
              <div className="text-center mb-8">
                <div className="mb-4 inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl text-secondary shadow-lg">
                  <ShieldCheck className="w-12 h-12" />
                </div>
                <h1 className="text-2xl font-black text-primary tracking-tight mb-1 font-headline uppercase">RETO 2026: Escuelas Seguras</h1>
                <p className="text-slate-500 text-sm font-medium">Universidad de Especialidades (UNE)</p>
              </div>

              <Tabs defaultValue="biometric" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-xl">
                  <TabsTrigger value="biometric" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Biometría</TabsTrigger>
                  <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Credenciales</TabsTrigger>
                </TabsList>

                <TabsContent value="biometric" className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                    <div className="flex items-center gap-3 text-primary mb-2">
                      <ScanFace className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Acceso FaceID Simulado</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Seleccione un perfil para simular el reconocimiento biométrico automático del sistema UNE.</p>
                  </div>

                  <div className="grid gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => startBiometricLogin('alumno_central')}
                      className="justify-between h-14 border-slate-200 hover:border-secondary hover:bg-secondary/5 rounded-xl group"
                    >
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-primary leading-none">Alumno Campus Central</p>
                          <p className="text-[10px] text-slate-400">Mariana López</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Button>

                    <Button 
                      variant="outline" 
                      onClick={() => startBiometricLogin('admin_global')}
                      className="justify-between h-14 border-primary/20 hover:border-primary hover:bg-primary/5 rounded-xl group"
                    >
                      <div className="flex items-center gap-3">
                        <Landmark className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                        <div className="text-left">
                          <p className="text-xs font-bold text-primary leading-none">Autoridad Institucional</p>
                          <p className="text-[10px] text-slate-400">Dir. Seguridad Global</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">Correo Institucional</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="usuario@une.edu.mx" 
                          className="pl-10 rounded-xl h-12"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pass" className="text-xs font-bold text-slate-500 uppercase">Contraseña</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                          id="pass" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 rounded-xl h-12"
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    {loginError && <p className="text-[11px] text-red-500 font-bold bg-red-50 p-2 rounded-lg text-center">{loginError}</p>}
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 h-12 rounded-xl font-bold shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Acceder al Sistema'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="py-10 flex flex-col items-center">
              <div className="relative w-48 h-48 mb-8">
                <div className="absolute inset-0 rounded-3xl border-4 border-slate-100 overflow-hidden">
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                    <UserIcon className="w-24 h-24 text-slate-200" />
                  </div>
                </div>
                <div className="face-scan-line"></div>
                <div className={`absolute inset-0 border-4 border-secondary rounded-3xl transition-opacity duration-300 ${scanProgress > 90 ? 'opacity-100' : 'opacity-0 animate-pulse'}`}></div>
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2 font-headline">Reconocimiento Facial</h2>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-secondary transition-all duration-100 ease-out"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Analizando biometría...</p>
              {scanProgress >= 100 && (
                <div className="mt-4 text-emerald-500 flex items-center gap-2 font-bold animate-bounce">
                  <ShieldCheck className="w-5 h-5" /> Acceso Autorizado
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
        <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex flex-col">
            <h2 className="text-xl font-extrabold text-primary font-headline tracking-tight uppercase">
              {ROLES_CONFIG[currentUser.role].nav.find(n => n.id === activeSection)?.text || 'Vista General'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Red Segura UNE - Enlace Activo</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {currentUser.role === 'alumno' && (
                <Button 
                    onClick={handleSOS}
                    className="bg-red-600 hover:bg-red-700 text-white font-black px-6 py-4 rounded-xl shadow-xl animate-pulse flex gap-2 border-4 border-red-200"
                >
                    <Zap className="w-5 h-5 fill-white" /> BOTÓN SOS
                </Button>
            )}

            {currentUser.role === 'autoridad' && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">PLANTEL:</span>
                <Select value={activeCampus as string} onValueChange={(v: Campus) => setActiveCampus(v)}>
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
            )}

            <button className="relative text-slate-400 hover:text-primary transition group p-2 rounded-full hover:bg-slate-50">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-sm"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold text-primary leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-secondary font-bold uppercase tracking-tight">{currentUser.roleDisplay}</p>
              </div>
              <div className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center font-bold shadow-lg border-2 border-slate-100 overflow-hidden">
                <UserIcon className="w-7 h-7" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          {activeSection === 'dashboard' && (
            <Dashboard 
              role={currentUser.role} 
              campus={activeCampus as Campus} 
              incidents={incidents} 
              onNavigate={setActiveSection} 
            />
          )}
          {activeSection === 'mapa' && <PerimeterMap campus={activeCampus} incidents={incidents} />}
          {activeSection === 'accesos' && <AccessControl logs={accessLogs} />}
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