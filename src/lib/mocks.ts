import { Incident, AccessLog, Campus, User, ZoneOverlay, MapMarker } from './types';

export const CAMPUSES: Exclude<Campus, 'Global'>[] = [
  'Campus Metropolitano',
  'Campus Tecnológico',
  'Campus Oriente'
];

export const MOCK_USERS: Record<string, User & { password?: string }> = {
  'alumno_metro': {
    id: 'ISS-7821',
    name: 'Mariana López',
    role: 'alumno',
    roleDisplay: 'Estudiante ISSU',
    campus: 'Campus Metropolitano',
    email: 'm.lopez@issu.edu.mx',
    password: 'password123'
  },
  'admin_global': {
    id: 'ADMIN-01',
    name: 'Dra. Elena Vance',
    role: 'autoridad',
    roleDisplay: 'Directora de Seguridad ISSU',
    campus: 'Global',
    email: 'e.vance@issu.edu.mx',
    password: 'admin'
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
    user: 'Sistema de Red',
    time: '09:00 AM',
    coords: { top: '25%', left: '45%' }
  },
  {
    id: 2,
    category: 'SOS',
    description: 'BOTÓN DE PÁNICO: SOLICITUD DE APOYO MÉDICO',
    zone: 'Laboratorio 3',
    campus: 'Campus Metropolitano',
    status: 'pendiente',
    severity: 'critica',
    user: 'Javier Solís',
    time: '11:45 AM',
    coords: { top: '40%', left: '55%' }
  }
];

export const campusMarkers: Record<string, MapMarker[]> = {
  'Campus Metropolitano': [
    { id: 'm1', type: 'entrada', label: 'Acceso Principal A', coords: { top: '10%', left: '50%' } },
    { id: 'm2', type: 'salida', label: 'Salida de Emergencia Sur', coords: { top: '90%', left: '40%' } },
    { id: 'm3', type: 'falla', label: 'Luminaria Fundida L-42', coords: { top: '75%', left: '15%' } },
    { id: 'm4', type: 'estudiante', label: 'Densidad Alta: Cafetería', coords: { top: '55%', left: '65%' } },
    { id: 'm5', type: 'entrada', label: 'Acceso Peatonal B', coords: { top: '30%', left: '85%' } },
  ]
};

export const campusZones: Record<string, ZoneOverlay[]> = {
  'Campus Metropolitano': [
    { id: 'z1', name: 'ZONA ROJA: Riesgo por Obra en Curso', type: 'danger-high', coords: { top: '15%', left: '10%', width: '25%', height: '20%' } },
    { id: 'z2', name: 'ZONA AMARILLA: Precaución - Iluminación Parcial', type: 'danger-low', coords: { top: '65%', left: '70%', width: '20%', height: '20%' } },
    { id: 'z3', name: 'Santuario de Seguridad: Punto de Reunión', type: 'safe', coords: { top: '45%', left: '45%', width: '10%', height: '10%' } }
  ]
};

export const mockAccessLogs: AccessLog[] = [
  { id: '1', time: '08:00 AM', person: 'Mariana López', role: 'Alumno', gate: 'Acceso Principal A', campus: 'Campus Metropolitano', status: 'Autorizado' },
  { id: '2', time: '08:15 AM', person: 'Elena Vance', role: 'Autoridad', gate: 'Acceso Principal A', campus: 'Campus Metropolitano', status: 'Autorizado' }
];

export const ROLES_CONFIG = {
  alumno: {
    nav: [
      { id: 'dashboard', icon: 'Home', text: 'Mi Seguridad' },
      { id: 'mapa', icon: 'Map', text: 'Navegación Segura' },
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
