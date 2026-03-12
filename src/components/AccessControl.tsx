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
    log.person.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-headline">Bitácora Global de Accesos</h3>
          <p className="text-sm text-slate-500">Monitoreo centralizado de flujos perimetrales ISSU.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Buscar persona/ID..." 
              className="pl-9 bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white border-b hover:bg-transparent">
              <TableHead className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Hora</TableHead>
              <TableHead className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Tipo</TableHead>
              <TableHead className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Persona</TableHead>
              <TableHead className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Rol</TableHead>
              <TableHead className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Ubicación</TableHead>
              <TableHead className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-slate-100 text-sm">
            {filteredLogs.map(log => (
              <TableRow key={log.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 opacity-50" /> {log.time}
                  </div>
                </TableCell>
                <TableCell>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase ${log.type === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                        {log.type === 'Entrada' ? <LogIn className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                        {log.type}
                    </div>
                </TableCell>
                <TableCell className="font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 opacity-50" /> {log.person}
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">{log.role}</TableCell>
                <TableCell className="text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 opacity-50" /> {log.gate}
                  </div>
                </TableCell>
                <TableCell>
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
