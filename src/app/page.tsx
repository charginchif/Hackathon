'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, User as UserIcon, Mail, Lock, Loader2, Zap, Menu, ShieldCheck, AlertTriangle, Network, Navigation, Building2, Cctv, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ROLES_CONFIG, MOCK_USERS } from '@/lib/mocks';
import { User, Incident, AccessLog, Campus } from '@/lib/types';
import Dashboard from '@/components/Dashboard';
import PerimeterMap from '@/components/PerimeterMap';
import AccessControl from '@/components/AccessControl';
import IncidentManagement from '@/components/IncidentManagement';
import ReportIncident from '@/components/ReportIncident';
import Sidebar from '@/components/Sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import EmergencyModal from '@/components/EmergencyModal';
import StudentAccess from '@/components/StudentAccess';

import { useFirestore, useCollection, useMemoFirebase, useAuth, useUser } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function Home() {
  const db = useFirestore();
  const auth = useAuth();
  const { user: fbUser } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [activeCampus, setActiveCampus] = useState<Campus>('Campus Metropolitano');
  const [activeEmergency, setActiveEmergency] = useState<Incident | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Firebase Data Subscriptions
  const incidentsRef = useMemoFirebase(() => {
    if (!db || !activeCampus || !currentUser || !fbUser) return null;
    const campusId = activeCampus === 'Global' ? 'Campus Metropolitano' : activeCampus;
    return query(collection(db, 'schools', campusId, 'incidents'), orderBy('timestamp', 'desc'));
  }, [db, activeCampus, !!currentUser, !!fbUser]);

  const accessLogsRef = useMemoFirebase(() => {
    if (!db || !activeCampus || !currentUser || !fbUser) return null;
    const campusId = activeCampus === 'Global' ? 'Campus Metropolitano' : activeCampus;
    return query(collection(db, 'schools', campusId, 'accessLogs'), orderBy('timestamp', 'desc'));
  }, [db, activeCampus, !!currentUser, !!fbUser]);

  const { data: incidentsData } = useCollection<Incident>(incidentsRef);
  const incidents = incidentsData || [];

  const { data: accessLogsData } = useCollection<AccessLog>(accessLogsRef);
  const accessLogs = accessLogsData || [];

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
        return prev + 10;
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
        setLoginError('Credenciales no válidas para Comunidad Alerta.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLoginSuccess = async (user: User) => {
    try {
        const cred = await signInAnonymously(auth);
        const fbUid = cred.user.uid;

        if (db) {
            const userRef = doc(db, 'users', fbUid);
            await setDoc(userRef, { 
                id: fbUid,
                name: user.name,
                role: user.role,
                campus: user.campus,
                email: user.email || `${fbUid}@issu.edu.mx`,
                lastLogin: serverTimestamp() 
            }, { merge: true });

            if (user.role === 'autoridad') {
                const adminAuthRef = doc(db, 'globalAdmins', fbUid);
                await setDoc(adminAuthRef, { active: true });
            } else if (user.role === 'alumno') {
                const campusId = user.campus === 'Global' ? 'Campus Metropolitano' : user.campus;
                const studentAuthRef = doc(db, 'schoolStudents', campusId, 'students', fbUid);
                await setDoc(studentAuthRef, { active: true });
            }
        }

        setCurrentUser(user);
        if (user.role === 'alumno') {
          setActiveCampus(user.campus);
        } else {
          setActiveCampus('Campus Metropolitano');
        }
        setActiveSection(ROLES_CONFIG[user.role].defaultSection);
        setIsScanning(false);
    } catch (err) {
        setLoginError('Error de enlace con el servidor de Comunidad Alerta.');
        console.error(err);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsScanning(false);
    setScanProgress(0);
    setLoginEmail('');
    setLoginPass('');
    setLoginError('');
  };

  const handleSOS = () => {
    if (!db || !currentUser || !fbUser) return;
    const campusId = currentUser.campus === 'Global' ? 'Campus Metropolitano' : currentUser.campus;
    const colRef = collection(db, 'schools', campusId, 'incidents');
    
    addDocumentNonBlocking(colRef, {
      category: 'SOS',
      description: 'ALERTA SOS: USUARIO SOLICITA AUXILIO INMEDIATO',
      zone: 'UBICACIÓN GEOLOCALIZADA',
      campus: campusId,
      schoolId: campusId,
      status: 'pendiente',
      severity: 'critica',
      userId: fbUser.uid,
      userName: currentUser.name,
      reporterUserId: fbUser.uid,
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords: { top: '50%', left: '50%' }
    });
  };

  if (!currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-primary px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="max-w-md w-full bg-background rounded-[2.5rem] shadow-2xl p-6 md:p-10 relative z-10 border border-muted/40">
          {!isScanning ? (
            <>
              <div className="text-center mb-8 md:mb-10 flex flex-col items-center">
                <div className="mb-4 md:mb-6 flex items-center justify-center w-full h-32 md:h-40 overflow-hidden relative">
                   <img src="/iconos/IconoLogo.svg" alt="Comunidad Alerta Icono" className="h-full object-contain drop-shadow-[0_8px_18px_rgba(227,121,9,0.35)]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-primary tracking-tighter mb-1 md:2 font-headline uppercase leading-none">Comunidad Alerta</h1>
                <p className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Unidos por un entorno más seguro</p>
              </div>

              <Tabs defaultValue="biometric" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 md:mb-10 bg-muted/15 p-1.5 rounded-2xl">
                  <TabsTrigger value="biometric" className="rounded-xl font-bold text-xs uppercase">Biometría</TabsTrigger>
                  <TabsTrigger value="email" className="rounded-xl font-bold text-xs uppercase">Credenciales</TabsTrigger>
                </TabsList>

                <TabsContent value="biometric">
                  <ScrollArea className="h-64 pr-4">
                    <div className="space-y-3">
                        <Button variant="outline" onClick={() => startBiometricLogin('admin_global')} className="w-full justify-between h-14 rounded-xl border-secondary/30 group bg-background hover:bg-secondary hover:text-secondary-foreground">
                        <div className="flex items-center gap-3">
                          <img src="/iconos/ICONOS-12.svg" alt="Admin" className="w-5 h-5 object-contain" />
                            <div className="text-left">
                                <p className="text-xs font-black text-primary leading-none group-hover:text-secondary-foreground">Admin Global C5</p>
                            <p className="text-[9px] text-muted uppercase group-hover:text-secondary-foreground/85">Supervisión Comunidad Alerta</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:text-secondary-foreground" />
                      </Button>
                        <Button variant="outline" onClick={() => startBiometricLogin('alumno_metro')} className="w-full justify-between h-14 rounded-xl border-muted/40 group bg-background hover:bg-secondary hover:text-secondary-foreground">
                        <div className="flex items-center gap-3">
                          <img src="/iconos/ICONOS-05.svg" alt="Alumno" className="w-5 h-5 object-contain" />
                            <div className="text-left">
                                <p className="text-xs font-black text-primary leading-none group-hover:text-secondary-foreground">Mariana López</p>
                            <p className="text-[9px] text-muted uppercase group-hover:text-secondary-foreground/85">Campus Metropolitano</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:text-secondary-foreground" />
                      </Button>
                        <Button variant="outline" onClick={() => startBiometricLogin('alumno_tec')} className="w-full justify-between h-14 rounded-xl border-muted/40 group bg-background hover:bg-secondary hover:text-secondary-foreground">
                        <div className="flex items-center gap-3">
                          <img src="/iconos/ICONOS-05.svg" alt="Alumno" className="w-5 h-5 object-contain" />
                            <div className="text-left">
                                <p className="text-xs font-black text-primary leading-none group-hover:text-secondary-foreground">Roberto García</p>
                            <p className="text-[9px] text-muted uppercase group-hover:text-secondary-foreground/85">Campus Tecnológico</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:text-secondary-foreground" />
                      </Button>
                        <Button variant="outline" onClick={() => startBiometricLogin('alumno_oriente')} className="w-full justify-between h-14 rounded-xl border-muted/40 group bg-background hover:bg-secondary hover:text-secondary-foreground">
                        <div className="flex items-center gap-3">
                          <img src="/iconos/ICONOS-05.svg" alt="Alumno" className="w-5 h-5 object-contain" />
                            <div className="text-left">
                                <p className="text-xs font-black text-primary leading-none group-hover:text-secondary-foreground">Sofía Pérez</p>
                            <p className="text-[9px] text-muted uppercase group-hover:text-secondary-foreground/85">Campus Oriente</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 group-hover:text-secondary-foreground" />
                      </Button>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <Input placeholder="usuario@comunidadalerta.org" className="pl-12 rounded-2xl h-14" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                        <Input type="password" placeholder="••••••••" className="pl-12 rounded-2xl h-14" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                    </div>
                    {loginError && <p className="text-xs text-secondary font-bold text-center">{loginError}</p>}
                    <Button type="submit" className="w-full bg-primary h-14 rounded-2xl font-black uppercase tracking-widest" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Sincronizar Terminal'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="py-8 md:py-12 flex flex-col items-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 md:10">
                <div className="absolute inset-0 rounded-[3rem] border-8 border-background overflow-hidden shadow-inner bg-muted/15 flex items-center justify-center">
                    <UserIcon className="w-24 h-24 md:w-28 md:h-28 text-muted/40" />
                </div>
                <div className="face-scan-line"></div>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-primary mb-2 uppercase tracking-tight text-center">Escaneando Biometría</h2>
              <div className="w-full bg-muted/20 h-3 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <p className="text-muted text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Identidad Comunidad Alerta v2.0</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar 
          role={currentUser.role} 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
          onLogout={logout}
          campus={currentUser.campus}
        />
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-background h-20 md:h-24 border-b border-muted/30 flex items-center justify-between px-4 md:px-10 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary h-10 w-10">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 border-none w-80 bg-primary">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navegación Comunidad Alerta</SheetTitle>
                    <SheetDescription>Acceso a las secciones de la plataforma</SheetDescription>
                  </SheetHeader>
                  <Sidebar 
                    role={currentUser.role} 
                    activeSection={activeSection} 
                    onSectionChange={(id) => {
                      setActiveSection(id);
                      setIsMobileMenuOpen(false);
                    }} 
                    onLogout={logout}
                    campus={currentUser.campus}
                  />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-lg md:text-2xl font-black text-primary font-headline tracking-tighter uppercase leading-none flex items-center gap-2">
                <img src="/iconos/ICONOS-09.svg" alt="Seccion" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                {ROLES_CONFIG[currentUser.role].nav.find(n => n.id === activeSection)?.text || 'Operaciones'}
              </h2>
              <div className="flex items-center gap-2 mt-0.5 md:mt-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[8px] md:text-[10px] font-black text-muted uppercase tracking-widest">Enlace Activo</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            {currentUser.role === 'alumno' && (
                <Button 
                    onClick={handleSOS}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black px-4 md:px-8 py-4 md:py-6 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl animate-pulse flex gap-2 md:gap-3 border-b-2 md:border-b-4 border-b-muted/40 text-[10px] md:text-sm h-auto"
                >
                  <Zap className="w-4 h-4 md:w-6 md:h-6 fill-current" /> SOS
                </Button>
            )}

            {currentUser.role === 'autoridad' && (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Central de Mando:</span>
                <Select value={activeCampus as string} onValueChange={(v: Campus) => setActiveCampus(v)}>
                  <SelectTrigger className="w-[200px] lg:w-[260px] bg-background border-muted/40 font-black text-primary rounded-2xl h-10 md:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-muted/40">
                    <SelectItem value="Campus Metropolitano" className="font-bold text-xs uppercase">Campus Metropolitano</SelectItem>
                    <SelectItem value="Campus Tecnológico" className="font-bold text-xs uppercase">Campus Tecnológico</SelectItem>
                    <SelectItem value="Campus Oriente" className="font-bold text-xs uppercase">Campus Oriente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center gap-2 md:gap-4 pl-3 md:pl-8 border-l border-muted/30">
              <div className="text-right hidden sm:block">
                <p className="text-xs md:text-sm font-black text-primary leading-tight uppercase tracking-tighter">{currentUser.name}</p>
                <p className="text-[7px] md:text-[9px] text-secondary font-black uppercase tracking-widest">{currentUser.roleDisplay}</p>
              </div>
              <div className="w-10 h-10 md:w-14 md:h-14 bg-primary text-primary-foreground rounded-lg md:rounded-[1.25rem] flex items-center justify-center font-bold shadow-md md:shadow-xl border-2 md:border-4 border-background overflow-hidden">
                <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth bg-background">
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
          {activeSection === 'accesos' && currentUser.role === 'alumno' && <StudentAccess user={currentUser} logs={accessLogs} />}
          {activeSection === 'gestion' && (
            <IncidentManagement 
                incidents={incidents} 
                onResolve={(id, status) => {
                    const campusId = activeCampus === 'Global' ? 'Campus Metropolitano' : activeCampus;
                    const docRef = doc(db!, 'schools', campusId, 'incidents', id.toString());
                    updateDocumentNonBlocking(docRef, { status });
                }} 
            />
          )}
          {activeSection === 'reportar' && (
            <ReportIncident 
                onReport={(newInc) => {
                    if (!fbUser) return;
                    const campusId = currentUser.campus === 'Global' ? 'Campus Metropolitano' : currentUser.campus;
                    const colRef = collection(db!, 'schools', campusId, 'incidents');
                    addDocumentNonBlocking(colRef, { 
                      ...newInc, 
                      schoolId: campusId, 
                      reporterUserId: fbUser.uid,
                      timestamp: serverTimestamp() 
                    });
                }} 
                user={currentUser} 
            />
          )}
        </div>
      </main>

      {activeEmergency && (
        <EmergencyModal 
            incident={activeEmergency} 
            onClose={() => setActiveEmergency(null)} 
            onDispatch={(id) => {
                const campusId = activeCampus === 'Global' ? 'Campus Metropolitano' : activeCampus;
                const docRef = doc(db!, 'schools', campusId, 'incidents', id.toString());
                updateDocumentNonBlocking(docRef, { status: 'despachado' });
            }}
        />
      )}
    </div>
  );
}
