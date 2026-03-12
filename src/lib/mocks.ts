
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
    roleDisplay: 'Directora Comunidad Alerta',
    campus: 'Global',
    email: 'e.vance@issu.edu.mx',
    password: 'admin'
  },
  'alumno_metro': {
    id: 'ISS-7821',
    name: 'Mariana López',
    role: 'alumno',
    roleDisplay: 'Miembro Comunidad Alerta',
    campus: 'Campus Metropolitano',
    email: 'm.lopez@issu.edu.mx',
    password: 'password123'
  },
  'alumno_tec': {
    id: 'ISS-9902',
    name: 'Roberto García',
    role: 'alumno',
    roleDisplay: 'Miembro Comunidad Alerta',
    campus: 'Campus Tecnológico',
    email: 'r.garcia@issu.edu.mx',
    password: 'password123'
  },
  'alumno_oriente': {
    id: 'ISS-4410',
    name: 'Sofía Pérez',
    role: 'alumno',
    roleDisplay: 'Miembro Comunidad Alerta',
    campus: 'Campus Oriente',
    email: 's.perez@issu.edu.mx',
    password: 'password123'
  }
};

export const campusMarkers: Record<string, MapMarker[]> = {
  'Campus Metropolitano': [
    { id: 'm1', type: 'entrada', label: 'Acceso Av. Principal', coords: { top: '8%', left: '48%' } },
    { id: 'm2', type: 'calle', label: 'Avenida de la Seguridad', coords: { top: '25%', left: '50%' } },
    { id: 'm3', type: 'edificio', label: 'Edificio A: Rectoría', coords: { top: '35%', left: '25%' } },
    { id: 'm4', type: 'edificio', label: 'Laboratorios de Innovación', coords: { top: '35%', left: '75%' } },
    { id: 'm5', type: 'cctv', label: 'Cámara Domo C-01', coords: { top: '15%', left: '20%' } },
    { id: 'm6', type: 'cctv', label: 'Cámara Domo C-02', coords: { top: '15%', left: '80%' } },
    { id: 'm7', type: 'parking', label: 'Estacionamiento Norte', coords: { top: '65%', left: '15%' } },
    { id: 'm8', type: 'iluminacion', label: 'Torre de Luz L-10', coords: { top: '80%', left: '85%' } },
    { id: 'm9', type: 'calle', label: 'Callejón Táctico', coords: { top: '60%', left: '50%' } },
    { id: 'm10', type: 'salida', label: 'Salida de Emergencia Sur', coords: { top: '92%', left: '50%' } },
  ],
  'Campus Tecnológico': [
    { id: 't1', type: 'entrada', label: 'Puerta Ing. Civil', coords: { top: '15%', left: '25%' } },
    { id: 't2', type: 'calle', label: 'Paseo de la Tecnología', coords: { top: '40%', left: '50%' } },
    { id: 't3', type: 'edificio', label: 'Taller Mecánico Central', coords: { top: '60%', left: '20%' } },
    { id: 't4', type: 'cctv', label: 'CCTV-Perimetral T-05', coords: { top: '80%', left: '80%' } },
    { id: 't5', type: 'parking', label: 'Área Carga/Descarga', coords: { top: '30%', left: '80%' } },
  ],
  'Campus Oriente': [
    { id: 'o1', type: 'entrada', label: 'Acceso Oriente', coords: { top: '85%', left: '15%' } },
    { id: 'o2', type: 'calle', label: 'Avenida Sol Oriente', coords: { top: '50%', left: '30%' } },
    { id: 'o3', type: 'edificio', label: 'Módulo de Prefectura', coords: { top: '30%', left: '60%' } },
    { id: 'o4', type: 'cctv', label: 'Cámara Exterior O-01', coords: { top: '10%', left: '75%' } },
  ]
};

export const campusZones: Record<string, ZoneOverlay[]> = {
  'Campus Metropolitano': [
    { id: 'z1', name: 'ZONA DE RIESGO: Obras Civiles', type: 'danger-high', coords: { top: '10%', left: '10%', width: '25%', height: '20%' } },
    { id: 'z3', name: 'PUNTO DE REUNIÓN SEGURO', type: 'safe', coords: { top: '48%', left: '48%', width: '15%', height: '15%' } }
  ],
  'Campus Tecnológico': [
    { id: 'zt1', name: 'Santuario de Seguridad', type: 'safe', coords: { top: '25%', left: '40%', width: '20%', height: '20%' } }
  ],
  'Campus Oriente': [
    { id: 'zo1', name: 'Vigilancia Reforzada', type: 'danger-low', coords: { top: '55%', left: '25%', width: '40%', height: '30%' } }
  ]
};

export const mockAccessLogs: AccessLog[] = [];

export const ROLES_CONFIG = {
  alumno: {
    nav: [
      { id: 'dashboard', icon: 'Home', text: 'Mi Seguridad' },
      { id: 'mapa', icon: 'Map', text: 'Mapa Táctico' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Mi Acceso' },
      { id: 'reportar', icon: 'Megaphone', text: 'Reportar' }
    ],
    defaultSection: 'dashboard'
  },
  autoridad: {
    nav: [
      { id: 'dashboard', icon: 'PieChart', text: 'Dashboard C5' },
      { id: 'mapa', icon: 'Map', text: 'Perímetros' },
      { id: 'accesos', icon: 'BadgeCheck', text: 'Accesos' },
      { id: 'gestion', icon: 'ClipboardList', text: 'Centro de Mando' }
    ],
    defaultSection: 'dashboard'
  }
};
