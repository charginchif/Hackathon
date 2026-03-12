'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanFace, LogIn, LogOut, CheckCircle2, Clock, MapPin, UserCheck, ShieldCheck } from 'lucide-react';
import { User, Campus, AccessLog } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface StudentAccessProps {
  user: User;
  onRegisterAccess: (log: AccessLog) => void;
  logs: AccessLog[];
}

export default function StudentAccess({ user, onRegisterAccess, logs }: StudentAccessProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [accessType, setAccessType] = useState<'Entrada' | 'Salida' | null>(null);

  const studentLogs = logs.filter(l => l.person === user.name).sort((a, b) => b.id.localeCompare(a.id));
  const lastAccess = studentLogs[0];
  const isInside = lastAccess?.type === 'Entrada';

  const startAccessScan = (type: 'Entrada' | 'Salida') => {
    setAccessType(type);
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newLog: AccessLog = {
              id: Date.now().toString(),
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              person: user.name,
              role: user.roleDisplay,
              gate: 'Acceso Principal A',
              type: type,
              campus: user.campus as Exclude<Campus, 'Global'>,
              status: 'Autorizado'
            };
            onRegisterAccess(newLog);
            setIsScanning(false);
          }, 800);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 p-8 border-none shadow-xl bg-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
            <div className="relative z-10">
                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">Estatus de Permanencia</p>
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isInside ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                        {isInside ? <ShieldCheck className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">
                            {isInside ? 'DENTRO DEL PLANTEL' : 'FUERA DEL PLANTEL'}
                        </h3>
                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                            {user.campus}
                        </p>
                    </div>
                </div>
                {lastAccess && (
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span className="text-[10px] font-black uppercase">Último registro: {lastAccess.time}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2 py-1 bg-white/10 rounded-lg">
                            {lastAccess.type}
                        </span>
                    </div>
                )}
            </div>
        </Card>

        <Card className="w-full md:w-80 p-8 border-none shadow-xl bg-white flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 text-primary rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8" />
            </div>
            <h4 className="font-black text-primary uppercase text-sm tracking-widest mb-2">Protocolo ISSU-ID</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                Su identidad es validada en cada acceso mediante red satelital.
            </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Button 
            disabled={isScanning || isInside}
            onClick={() => startAccessScan('Entrada')}
            className={`h-40 rounded-[2.5rem] flex-col gap-4 shadow-2xl transition-all border-b-8 ${isInside ? 'opacity-50 grayscale' : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-900/20 active:translate-y-1'}`}
        >
            <LogIn className="w-12 h-12" />
            <div className="text-center">
                <span className="block font-black text-xl uppercase tracking-tighter">REGISTRAR ENTRADA</span>
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Validación Biométrica Requerida</span>
            </div>
        </Button>

        <Button 
            disabled={isScanning || !isInside}
            onClick={() => startAccessScan('Salida')}
            className={`h-40 rounded-[2.5rem] flex-col gap-4 shadow-2xl transition-all border-b-8 ${!isInside ? 'opacity-50 grayscale' : 'bg-slate-800 hover:bg-slate-900 border-black/20 active:translate-y-1'}`}
        >
            <LogOut className="w-12 h-12" />
            <div className="text-center">
                <span className="block font-black text-xl uppercase tracking-tighter">REGISTRAR SALIDA</span>
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Protocolo de Egreso Seguro</span>
            </div>
        </Button>
      </div>

      {isScanning && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-primary/95 backdrop-blur-md p-6">
            <div className="max-w-md w-full text-center text-white">
                <div className="relative w-48 h-48 mx-auto mb-10">
                    <div className="absolute inset-0 rounded-[3rem] border-4 border-white/20 overflow-hidden">
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <ScanFace className="w-24 h-24 text-white/20" />
                        </div>
                    </div>
                    <div className="face-scan-line"></div>
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Validando {accessType}</h2>
                <p className="text-white/50 text-xs font-bold uppercase tracking-[0.3em] mb-8">Sincronizando con C5 ISSU...</p>
                <Progress value={scanProgress} className="h-2 bg-white/10" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest">{scanProgress}% Completado</p>
            </div>
        </Card>
      )}

      <Card className="p-8 border-none shadow-xl bg-white">
          <h4 className="font-black text-primary uppercase tracking-widest mb-6 border-b pb-4">Historial Reciente de Acceso</h4>
          <div className="space-y-4">
              {studentLogs.length > 0 ? studentLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.type === 'Entrada' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-600'}`}>
                              {log.type === 'Entrada' ? <LogIn className="w-5 h-5" /> : <LogOut className="w-5 h-5" />}
                          </div>
                          <div>
                              <p className="font-black text-primary uppercase text-xs leading-none mb-1">{log.type}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{log.gate}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="font-black text-primary text-sm leading-none mb-1">{log.time}</p>
                          <div className="flex items-center gap-1 justify-end">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-[9px] font-black text-emerald-600 uppercase">Validado</span>
                          </div>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-10">
                      <p className="text-slate-400 font-bold uppercase text-xs">Sin registros previos en esta terminal</p>
                  </div>
              )}
          </div>
      </Card>
    </div>
  );
}
