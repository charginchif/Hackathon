import { Incident, AccessLog, Campus } from './types';

export const CAMPUSES: Campus[] = [
  'UNE Campus Central',
  'UNE Campus Américas',
  'UNE Campus Tlaquepaque'
];

export const mockIncidents: Incident[] = [
  {
    id: 1,
    category: 'Infraestructura',
    description: 'Falla en transformador, área de estacionamiento sin luz.',
    zone: 'Puerta Sur',
    campus: 'UNE Campus Central',
    status: 'pendiente',
    user: 'Guardia Nocturno',
    time: '10:15 AM',
    coords: { top: '75%', left: '45%' }
  },
  {
    id: 2,
    category: 'Sospechoso',
    description: 'Persona ajena a la institución merodeando en perímetro.',
    zone: 'Calle Lateral Poniente',
    campus: 'UNE Campus Américas',
    status: 'atendido',
    user: 'Monitorista C5',
    time: '08:30 AM',
    coords: { top: '50%', left: '20%' }
  },
  {
    id: 3,
    category: 'Emergencia',
    description: 'Alumno con golpe de calor en áreas deportivas.',
    zone: 'Canchas UNE',
    campus: 'UNE Campus Tlaquepaque',
    status: 'pendiente',
    user: 'Prefecto',
    time: '12:45 PM',
    coords: { top: '30%', left: '70%' }
  }
];

export const mockAccessLogs: AccessLog[] = [
  { id: '1', time: '11:45 AM', person: 'Mariana López', role: 'Alumno', gate: 'Puerta Principal', campus: 'UNE Campus Central', status: 'Autorizado' },
  { id: '2', time: '11:30 AM', person: 'Carlos G.', role: 'Proveedor', gate: 'Acceso B', campus: 'UNE Campus Américas', status: 'Autorizado' },
  { id: '3', time: '11:15 AM', person: 'Desconocido', role: 'Sin Registro', gate: 'Puerta Sur', campus: 'UNE Campus Central', status: 'Denegado' },
  { id: '4', time: '11:00 AM', person: 'Prof. Roberto', role: 'Docente', gate: 'Acceso Peatonal', campus: 'UNE Campus Tlaquepaque', status: 'Autorizado' }
];

export const ROLES_CONFIG = {
  alumno: {
    name: 'Estudiante UNE',
    roleDisplay: 'Comunidad Universitaria',
    nav: [
      { id: 'dashboard', icon: 'Home', text: 'Mi Campus' },
      { id: 'reportar', icon: 'Megaphone', text: 'Nueva Alerta' }
    ],
    defaultSection: 'dashboard'
  },
  autoridad: {
    name: 'Dir. Seguridad UNE',
    roleDisplay: 'Autoridad Institucional',
    nav: [
      { id: 'dashboard', icon: 'PieChart', text: 'KPIs Globales' },
      { id: 'mapa', icon: 'Map', text: 'Mapa Perimetral' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Biometría de Acceso' },
      { id: 'gestion', icon: 'ClipboardList', text: 'Centro de Mando' }
    ],
    defaultSection: 'dashboard'
  }
};
