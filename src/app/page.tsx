
'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, ChevronRight, Bell, User as UserIcon, ScanFace, Mail, Lock, Landmark, Loader2, Zap, LayoutDashboard, Map as MapIcon, Megaphone, CheckCircle2, Siren } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROLES_CONFIG, CAMPUSES, MOCK_USERS } from '@/lib/mocks';
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

import { useFirestore, useCollection, useMemoFirebase, useAuth } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function Home() {
  const db = useFirestore();
  const auth = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [activeCampus, setActiveCampus] = useState<Campus>('Campus Metropolitano');
  const [activeEmergency, setActiveEmergency] = useState<Incident | null>(null);
  
  // Firebase Data Subscriptions - Only run if user is logged in
  const incidentsRef = useMemoFirebase(() => {
    if (!db || !activeCampus || !currentUser) return null;
    const campusId = activeCampus === 'Global' ? 'Campus Metropolitano' : activeCampus;
    return query(collection(db, 'schools', campusId, 'incidents'), orderBy('timestamp', 'desc'));
  }, [db, activeCampus, !!currentUser]);

  const accessLogsRef = useMemoFirebase(() => {
    if (!db || !activeCampus || !currentUser) return null;
    const campusId = activeCampus === 'Global' ? 'Campus Metropolitano' : activeCampus;
    return query(collection(db, 'schools', campusId, 'accessLogs'), orderBy('timestamp', 'desc'));
  }, [db, activeCampus, !!currentUser]);

  const { data: incidents = [] } = useCollection<Incident>(incidentsRef);
  const { data: accessLogs = [] } = useCollection<AccessLog>(accessLogsRef);

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
      const emergency = incidents?.find(i => i.category === 'SOS' && i.status === 'pendiente');
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
        setLoginError('Credenciales ISSU no válidas.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLoginSuccess = (user: User) => {
    // Sign in to Firebase Auth to satisfy Security Rules context
    signInAnonymously(auth).then(() => {
        setCurrentUser(user);
        if (user.role === 'alumno') {
          setActiveCampus(user.campus);
        } else {
          setActiveCampus('Campus Metropolitano');
        }
        setActiveSection(ROLES_CONFIG[user.role].defaultSection);
        setIsScanning(false);

        // Sync user to Firestore
        if (db) {
            const userRef = doc(db, 'users', user.id);
            setDoc(userRef, { 
                id: user.id,
                name: user.name,
                role: user.role,
                campus: user.campus,
                email: user.email,
                lastLogin: serverTimestamp() 
            }, { merge: true });
        }
    }).catch(err => {
        setLoginError('Error de enlace con el servidor central.');
        console.error(err);
    });
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
    if (!db || !currentUser) return;
    const campusId = currentUser.campus === 'Global' ? 'Campus Metropolitano' : currentUser.campus;
    const colRef = collection(db, 'schools', campusId, 'incidents');
    
    addDocumentNonBlocking(colRef, {
      category: 'SOS',
      description: 'ALERTA SOS: USUARIO SOLICITA AUXILIO INMEDIATO',
      zone: 'UBICACIÓN GEOLOCALIZADA',
      campus: campusId,
      status: 'pendiente',
      severity: 'critica',
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: serverTimestamp(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      coords: { top: '50%', left: '50%' }
    });
  };

  if (!currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-indigo-950 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
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
                  <TabsTrigger value="biometric" className="rounded-xl font-bold text-xs uppercase">Biometría</TabsTrigger>
                  <TabsTrigger value="email" className="rounded-xl font-bold text-xs uppercase">Credenciales</TabsTrigger>
                </TabsList>

                <TabsContent value="biometric" className="space-y-4">
                  <Button variant="outline" onClick={() => startBiometricLogin('alumno_metro')} className="w-full justify-between h-16 rounded-2xl border-slate-200 group">
                    <div className="flex items-center gap-4">
                        <UserCheck className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                        <div className="text-left">
                            <p className="text-sm font-black text-primary leading-none">Alumno Metropolitano</p>
                            <p className="text-[10px] text-slate-400">ISSU Campus Metro</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={() => startBiometricLogin('admin_global')} className="w-full justify-between h-16 rounded-2xl border-secondary/20 group">
                    <div className="flex items-center gap-4">
                        <Landmark className="w-6 h-6 text-slate-400 group-hover:text-secondary" />
                        <div className="text-left">
                            <p className="text-sm font-black text-primary leading-none">Admin Global</p>
                            <p className="text-[10px] text-slate-400">Centro de Mando C5</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </TabsContent>

                <TabsContent value="email">
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input placeholder="usuario@issu.edu.mx" className="pl-12 rounded-2xl h-14" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input type="password" placeholder="••••••••" className="pl-12 rounded-2xl h-14" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                    </div>
                    {loginError && <p className="text-xs text-red-500 font-bold text-center">{loginError}</p>}
                    <Button type="submit" className="w-full bg-primary h-14 rounded-2xl font-black uppercase tracking-widest" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Sincronizar Terminal'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center">
              <div className="relative w-56 h-56 mb-10">
                <div className="absolute inset-0 rounded-[3rem] border-8 border-slate-50 overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center">
                    <UserIcon className="w-28 h-28 text-slate-200" />
                </div>
                <div className="face-scan-line"></div>
              </div>
              <h2 className="text-2xl font-black text-primary mb-2 uppercase tracking-tight">Escaneando Biometría</h2>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-primary transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Protocolo de Identidad ISSU v2.0</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-background text-slate-800">
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

            <div className="flex items-center gap-4 pl-8 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-primary leading-tight uppercase tracking-tighter">{currentUser.name}</p>
                <p className="text-[9px] text-secondary font-black uppercase tracking-widest">{currentUser.roleDisplay}</p>
              </div>
              <div className="w-14 h-14 bg-indigo-900 text-secondary rounded-[1.25rem] flex items-center justify-center font-bold shadow-xl border-4 border-slate-50 overflow-hidden">
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
              incidents={incidents as Incident[]} 
              onNavigate={setActiveSection} 
            />
          )}
          {activeSection === 'mapa' && <PerimeterMap campus={activeCampus} incidents={incidents as Incident[]} />}
          {activeSection === 'accesos' && currentUser.role === 'autoridad' && <AccessControl logs={accessLogs as AccessLog[]} />}
          {activeSection === 'accesos' && currentUser.role === 'alumno' && <StudentAccess user={currentUser} logs={accessLogs as AccessLog[]} />}
          {activeSection === 'gestion' && (
            <IncidentManagement 
                incidents={incidents as Incident[]} 
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
                    const campusId = currentUser.campus === 'Global' ? 'Campus Metropolitano' : currentUser.campus;
                    const colRef = collection(db!, 'schools', campusId, 'incidents');
                    addDocumentNonBlocking(colRef, { ...newInc, timestamp: serverTimestamp() });
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
