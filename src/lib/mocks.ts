import { Incident, AccessLog, Campus, User, ZoneOverlay, MapMarker } from './types';

export const CAMPUSES: Exclude<Campus, 'Global'>[] = [
  'Campus Metropolitano',
  'Campus Tecnológico',
  'Campus Oriente'
];

export const MOCK_USERS: Record<string, User & { password?: string }> = {
  'admin_global': {
    id: 'ADMIN-01',
    name: 'Dra. Elena Vance',
    role: 'autoridad',
    roleDisplay: 'Directora de Seguridad ISSU',
    campus: 'Global',
    email: 'e.vance@issu.edu.mx',
    password: 'admin'
  },
  'alumno_metro': {
    id: 'ISS-7821',
    name: 'Mariana López',
    role: 'alumno',
    roleDisplay: 'Estudiante ISSU',
    campus: 'Campus Metropolitano',
    email: 'm.lopez@issu.edu.mx',
    password: 'password123'
  },
  'alumno_tec': {
    id: 'ISS-9902',
    name: 'Roberto García',
    role: 'alumno',
    roleDisplay: 'Estudiante ISSU',
    campus: 'Campus Tecnológico',
    email: 'r.garcia@issu.edu.mx',
    password: 'password123'
  },
  'alumno_oriente': {
    id: 'ISS-4410',
    name: 'Sofía Pérez',
    role: 'alumno',
    roleDisplay: 'Estudiante ISSU',
    campus: 'Campus Oriente',
    email: 's.perez@issu.edu.mx',
    password: 'password123'
  }
};

export const mockIncidents: Incident[] = [
  {
    id: 1,
    category: 'Infraestructura',
    description: 'Cámara perimetral fuera de servicio por cortocircuito.',
    zone: 'Puerta Norte',
    campus: 'Campus Metropolitano',
    status: 'pendiente',
    severity: 'media',
    userId: 'SYSTEM',
    userName: 'Sistema de Red',
    time: '09:00 AM',
    coords: { top: '25%', left: '45%' }
  }
];

export const campusMarkers: Record<string, MapMarker[]> = {
  'Campus Metropolitano': [
    { id: 'm1', type: 'entrada', label: 'Acceso Principal A', coords: { top: '10%', left: '50%' } },
    { id: 'm2', type: 'salida', label: 'Salida de Emergencia Sur', coords: { top: '90%', left: '40%' } },
    { id: 'm3', type: 'falla', label: 'Luminaria Fundida L-42', coords: { top: '75%', left: '15%' } },
    { id: 'm4', type: 'estudiante', label: 'Densidad Alta: Cafetería', coords: { top: '55%', left: '65%' } },
  ],
  'Campus Tecnológico': [
    { id: 't1', type: 'entrada', label: 'Puerta de Ingeniería', coords: { top: '20%', left: '30%' } },
    { id: 't2', type: 'falla', label: 'Cámara C-12 Offline', coords: { top: '45%', left: '80%' } },
  ],
  'Campus Oriente': [
    { id: 'o1', type: 'entrada', label: 'Acceso Peatonal Oriente', coords: { top: '80%', left: '20%' } },
    { id: 'o2', type: 'salida', label: 'Salida Vehicular', coords: { top: '10%', left: '70%' } },
  ]
};

export const campusZones: Record<string, ZoneOverlay[]> = {
  'Campus Metropolitano': [
    { id: 'z1', name: 'ZONA ROJA: Riesgo por Obra en Curso', type: 'danger-high', coords: { top: '15%', left: '10%', width: '25%', height: '20%' } },
    { id: 'z3', name: 'Santuario de Seguridad: Punto de Reunión', type: 'safe', coords: { top: '45%', left: '45%', width: '10%', height: '10%' } }
  ],
  'Campus Tecnológico': [
    { id: 'zt1', name: 'Punto de Encuentro Seguro', type: 'safe', coords: { top: '30%', left: '30%', width: '15%', height: '15%' } }
  ],
  'Campus Oriente': [
    { id: 'zo1', name: 'Área de Vigilancia Reforzada', type: 'danger-low', coords: { top: '60%', left: '20%', width: '30%', height: '20%' } }
  ]
};

export const mockAccessLogs: AccessLog[] = [];

export const ROLES_CONFIG = {
  alumno: {
    nav: [
      { id: 'dashboard', icon: 'Home', text: 'Mi Seguridad' },
      { id: 'mapa', icon: 'Map', text: 'Navegación Segura' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Registro Acceso' },
      { id: 'reportar', icon: 'Megaphone', text: 'Reportar Incidente' }
    ],
    defaultSection: 'dashboard'
  },
  autoridad: {
    nav: [
      { id: 'dashboard', icon: 'PieChart', text: 'Dashboard C5' },
      { id: 'mapa', icon: 'Map', text: 'Perímetros' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Control Biométrico' },
      { id: 'gestion', icon: 'ClipboardList', text: 'Centro de Mando' }
    ],
    defaultSection: 'dashboard'
  }
};
