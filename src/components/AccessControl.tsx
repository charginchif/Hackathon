
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Clock, User, LogIn, LogOut, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { AccessLog } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface AccessControlProps {
  logs: AccessLog[];
}

export default function AccessControl({ logs }: AccessControlProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden border-none shadow-xl rounded-3xl bg-white">
      <div className="p-8 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-xl font-black text-primary uppercase tracking-tight">Bitácora Global de Accesos</h3>
          <p className="text-sm text-slate-500 font-medium">Supervisión de flujos perimetrales en tiempo real.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar por nombre o ID..." 
              className="pl-9 bg-white border-slate-200 h-11 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b hover:bg-transparent">
              <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest p-6">Sincronización</TableHead>
              <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest p-6">Tipo</TableHead>
              <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest p-6">Usuario ISSU</TableHead>
              <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest p-6">Perfil</TableHead>
              <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest p-6">Punto de Acceso</TableHead>
              <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-widest p-6">Estatus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase">
                    <Clock className="w-3 h-3" /> {log.time}
                  </div>
                </TableCell>
                <TableCell className="p-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase ${log.type === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                        {log.type === 'Entrada' ? <LogIn className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                        {log.type}
                    </div>
                </TableCell>
                <TableCell className="p-6">
                  <div className="flex flex-col">
                    <span className="font-black text-primary text-sm uppercase leading-none mb-1">{log.userName}</span>
                    <span className="text-[10px] font-bold text-slate-400">ID: {log.userId}</span>
                  </div>
                </TableCell>
                <TableCell className="p-6">
                    <span className="text-[10px] font-black text-secondary uppercase bg-secondary/5 px-2 py-1 rounded-md">{log.userRole}</span>
                </TableCell>
                <TableCell className="p-6">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                    <MapPin className="w-3 h-3" /> {log.gate}
                  </div>
                </TableCell>
                <TableCell className="p-6">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${log.status === 'Autorizado' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {log.status === 'Autorizado' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {log.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
