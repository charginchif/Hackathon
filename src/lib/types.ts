
export type Role = 'alumno' | 'autoridad';
export type Campus = 'Campus Metropolitano' | 'Campus Tecnológico' | 'Campus Oriente' | 'Global';

export interface User {
  id: string;
  name: string;
  role: Role;
  roleDisplay: string;
  campus: Campus;
  email?: string;
}

export type IncidentCategory = 'Infraestructura' | 'Sospechoso' | 'Emergencia' | 'Acoso' | 'SOS' | 'Falla Sistema';
export type IncidentStatus = 'pendiente' | 'atendido' | 'despachado';
export type IncidentSeverity = 'baja' | 'media' | 'alta' | 'critica';

export interface MapMarker {
  id: string;
  type: 'entrada' | 'salida' | 'falla' | 'estudiante' | 'incidente' | 'cctv' | 'iluminacion' | 'edificio' | 'calle' | 'parking';
  label: string;
  coords: {
    top: string;
    left: string;
  };
  severity?: IncidentSeverity;
}

export interface Incident {
  id: string | number;
  category: IncidentCategory;
  description: string;
  zone: string;
  campus: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  userId: string;
  userName: string;
  time: string;
  timestamp?: any;
  coords: {
    top: string;
    left: string;
  };
}

export interface AccessLog {
  id: string;
  time: string;
  userId: string;
  userName: string;
  userRole: string;
  gate: string;
  type: 'Entrada' | 'Salida';
  campus: string;
  status: 'Autorizado' | 'Denegado';
  timestamp?: any;
}

export interface ZoneOverlay {
  id: string;
  name: string;
  type: 'danger-low' | 'danger-mid' | 'danger-high' | 'safe';
  coords: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}
