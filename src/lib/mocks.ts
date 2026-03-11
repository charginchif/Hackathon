import { Incident, AccessLog } from './types';

export const mockIncidents: Incident[] = [
  {
    id: 1,
    category: 'Infraestructura',
    description: 'Luminaria fundida, zona muy oscura.',
    zone: 'Puerta Sur',
    status: 'pendiente',
    user: 'Padre de Familia',
    time: '10:15 AM',
    coords: { top: '80%', left: '50%' }
  },
  {
    id: 2,
    category: 'Sospechoso',
    description: 'Auto estacionado por más de 2 horas sin tripulantes.',
    zone: 'Calle Lateral Poniente',
    status: 'atendido',
    user: 'Vecino Vigilante',
    time: '08:30 AM',
    coords: { top: '50%', left: '15%' }
  }
];

export const mockAccessLogs: AccessLog[] = [
  { id: '1', time: '11:45 AM', person: 'Mariana López', role: 'Alumno', gate: 'Puerta Norte', status: 'Autorizado' },
  { id: '2', time: '11:30 AM', person: 'Carlos G.', role: 'Proveedor', gate: 'Entrada Proveedores', status: 'Autorizado' },
  { id: '3', time: '11:15 AM', person: 'Desconocido', role: 'Sin Registro', gate: 'Puerta Sur', status: 'Denegado' },
  { id: '4', time: '11:00 AM', person: 'Prof. Roberto', role: 'Docente', gate: 'Puerta Norte', status: 'Autorizado' },
  { id: '5', time: '10:45 AM', person: 'Desconocido', role: 'Sin Registro', gate: 'Puerta Norte', status: 'Denegado' }
];

export const ROLES_CONFIG = {
  alumno: {
    name: 'Juan Pérez',
    roleDisplay: 'Alumno / Comunidad',
    nav: [
      { id: 'dashboard', icon: 'Home', text: 'Mi Resumen' },
      { id: 'reportar', icon: 'Megaphone', text: 'Reportar Incidente' }
    ],
    defaultSection: 'dashboard'
  },
  autoridad: {
    name: 'Cmdte. Rodríguez',
    roleDisplay: 'Director de Seguridad',
    nav: [
      { id: 'dashboard', icon: 'PieChart', text: 'Dashboard General' },
      { id: 'mapa', icon: 'Map', text: 'Mapa Perimetral' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Control de Accesos' },
      { id: 'gestion', icon: 'ClipboardList', text: 'Gestión de Reportes' }
    ],
    defaultSection: 'dashboard'
  }
};