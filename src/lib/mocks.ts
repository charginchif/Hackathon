import { Incident, AccessLog, Campus, User, ZoneOverlay } from './types';

export const CAMPUSES: Exclude<Campus, 'Global'>[] = [
  'UNE Campus Central',
  'UNE Campus Américas',
  'UNE Campus Tlaquepaque'
];

export const MOCK_USERS: Record<string, User & { password?: string }> = {
  'alumno_central': {
    id: 'U-7821',
    name: 'Mariana López',
    role: 'alumno',
    roleDisplay: 'Estudiante UNE',
    campus: 'UNE Campus Central',
    email: 'm.lopez@une.edu.mx',
    password: 'password123'
  },
  'alumno_americas': {
    id: 'U-9042',
    name: 'Roberto Gómez',
    role: 'alumno',
    roleDisplay: 'Estudiante UNE',
    campus: 'UNE Campus Américas',
    email: 'r.gomez@une.edu.mx',
    password: 'password123'
  },
  'admin_global': {
    id: 'A-101',
    name: 'Ing. Alejandro Silva',
    role: 'autoridad',
    roleDisplay: 'Director de Seguridad Institucional',
    campus: 'Global',
    email: 'a.silva@une.edu.mx',
    password: 'admin'
  }
};

export const mockIncidents: Incident[] = [
  {
    id: 1,
    category: 'Infraestructura',
    description: 'Falla en transformador, área de estacionamiento sin luz.',
    zone: 'Puerta Sur',
    campus: 'UNE Campus Central',
    status: 'pendiente',
    severity: 'media',
    user: 'Guardia Nocturno',
    time: '10:15 AM',
    coords: { top: '75%', left: '45%' }
  },
  {
    id: 2,
    category: 'SOS',
    description: 'ALERTA DE PÁNICO ACTIVADA: EMERGENCIA EN CURSO',
    zone: 'Edificio de Laboratorios',
    campus: 'UNE Campus Central',
    status: 'pendiente',
    severity: 'critica',
    user: 'Mariana López',
    time: '11:20 AM',
    coords: { top: '40%', left: '55%' }
  },
  {
    id: 3,
    category: 'Sospechoso',
    description: 'Persona ajena merodeando en perímetro.',
    zone: 'Calle Lateral Poniente',
    campus: 'UNE Campus Américas',
    status: 'atendido',
    severity: 'baja',
    user: 'Monitorista C5',
    time: '08:30 AM',
    coords: { top: '50%', left: '20%' }
  }
];

export const campusZones: Record<string, ZoneOverlay[]> = {
  'UNE Campus Central': [
    { id: 'z1', name: 'Zona de Alto Riesgo - Estacionamiento Sur', type: 'danger', coords: { top: '70%', left: '40%', width: '15%', height: '15%' } },
    { id: 'z2', name: 'Zona Segura - Explanada Principal', type: 'safe', coords: { top: '45%', left: '45%', width: '10%', height: '10%' } },
    { id: 'z3', name: 'Ruta de Evacuación Norte', type: 'safe', coords: { top: '20%', left: '48%', width: '4%', height: '20%' } }
  ]
};

export const mockAccessLogs: AccessLog[] = [
  { id: '1', time: '11:45 AM', person: 'Mariana López', role: 'Alumno', gate: 'Puerta Principal', campus: 'UNE Campus Central', status: 'Autorizado' },
  { id: '2', time: '11:30 AM', person: 'Carlos G.', role: 'Proveedor', gate: 'Acceso B', campus: 'UNE Campus Américas', status: 'Autorizado' }
];

export const ROLES_CONFIG = {
  alumno: {
    nav: [
      { id: 'dashboard', icon: 'Home', text: 'Mi Campus' },
      { id: 'mapa', icon: 'Map', text: 'Mapa Seguro' },
      { id: 'reportar', icon: 'Megaphone', text: 'Nueva Alerta' }
    ],
    defaultSection: 'dashboard'
  },
  autoridad: {
    nav: [
      { id: 'dashboard', icon: 'PieChart', text: 'KPIs Globales' },
      { id: 'mapa', icon: 'Map', text: 'Mapa Perimetral' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Biometría de Acceso' },
      { id: 'gestion', icon: 'ClipboardList', text: 'Centro de Mando' }
    ],
    defaultSection: 'dashboard'
  }
};