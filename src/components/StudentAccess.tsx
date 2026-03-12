'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanFace, LogIn, LogOut, CheckCircle2, Clock, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import { User, AccessLog } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface StudentAccessProps {
  user: User;
  logs: AccessLog[];
}

export default function StudentAccess({ user, logs }: StudentAccessProps) {
  const db = useFirestore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [accessType, setAccessType] = useState<'Entrada' | 'Salida' | null>(null);
  const hasFired = useRef(false);

  const studentLogs = logs.filter(l => l.userId === user.id);
  const lastAccess = studentLogs[0];
  const isInside = lastAccess?.type === 'Entrada';

  // Monitor scan progress to trigger database write only once
  useEffect(() => {
    if (isScanning && scanProgress >= 100 && !hasFired.current) {
      hasFired.current = true;
      const type = accessType!;
      
      const timer = setTimeout(() => {
        if (db) {
          const campusId = user.campus === 'Global' ? 'Campus Metropolitano' : user.campus;
          const colRef = collection(db, 'schools', campusId, 'accessLogs');
          
          addDocumentNonBlocking(colRef, {
            userId: user.id,
            userName: user.name,
            userRole: user.roleDisplay,
            gate: 'Acceso Principal A',
            type: type,
            campus: campusId,
            status: 'Autorizado',
            timestamp: serverTimestamp(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
        setIsScanning(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isScanning, scanProgress, accessType, db, user]);

  const startAccessScan = (type: 'Entrada' | 'Salida') => {
    hasFired.current = false;
    setAccessType(type);
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 p-8 border-none shadow-xl bg-primary text-white relative overflow-hidden rounded-3xl">
            <div className="relative z-10">
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Estatus en Campus</p>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isInside ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        {isInside ? <ShieldCheck className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">
                            {isInside ? 'DENTRO DEL PLANTEL' : 'FUERA DEL PLANTEL'}
                        </h3>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{user.campus}</p>
                    </div>
                </div>
            </div>
        </Card>

        <Card className="w-full md:w-80 p-8 border-none shadow-xl bg-white flex flex-col justify-center items-center text-center rounded-3xl">
            <UserCheck className="w-10 h-10 text-primary mb-4" />
            <h4 className="font-black text-primary uppercase text-xs tracking-widest mb-1">ISSU-ID ACTIVO</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Identidad validada por red satelital.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button 
            disabled={isScanning || isInside}
            onClick={() => startAccessScan('Entrada')}
            className={`h-40 rounded-[2.5rem] flex-col gap-4 shadow-2xl transition-all border-b-8 ${isInside ? 'opacity-50' : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-900/20'}`}
        >
            <LogIn className="w-10 h-10" />
            <span className="font-black text-xl uppercase tracking-tighter">REGISTRAR ENTRADA</span>
        </Button>

        <Button 
            disabled={isScanning || !isInside}
            onClick={() => startAccessScan('Salida')}
            className={`h-40 rounded-[2.5rem] flex-col gap-4 shadow-2xl transition-all border-b-8 ${!isInside ? 'opacity-50' : 'bg-slate-800 hover:bg-slate-900 border-black/20'}`}
        >
            <LogOut className="w-10 h-10" />
            <span className="font-black text-xl uppercase tracking-tighter">REGISTRAR SALIDA</span>
        </Button>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 backdrop-blur-md p-6">
            <div className="max-w-md w-full text-center text-white">
                <div className="relative w-48 h-48 mx-auto mb-10">
                    <div className="absolute inset-0 rounded-[3rem] border-4 border-white/20 overflow-hidden flex items-center justify-center">
                        <ScanFace className="w-24 h-24 text-white/20" />
                    </div>
                    <div className="face-scan-line"></div>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Validando {accessType}</h2>
                <Progress value={scanProgress} className="h-2 bg-white/10" />
            </div>
        </div>
      )}

      <Card className="p-8 border-none shadow-xl bg-white rounded-3xl">
          <h4 className="font-black text-primary uppercase tracking-widest mb-6 border-b pb-4">Historial Personal de Acceso</h4>
          <div className="space-y-4">
              {studentLogs.length > 0 ? studentLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.type === 'Entrada' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                              {log.type === 'Entrada' ? <LogIn className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
                          </div>
                          <div>
                              <p className="font-black text-primary uppercase text-xs mb-1">{log.type}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{log.gate}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-black text-primary text-sm mb-1">{log.time}</p>
                          <span className="text-[9px] font-black text-emerald-600 uppercase">Validado</span>
                      </div>
                  </div>
              )) : (
                  <p className="text-center text-slate-400 py-4 text-xs font-bold uppercase tracking-widest">Sin registros recientes</p>
              )}
          </div>
      </Card>
    </div>
  );
}
