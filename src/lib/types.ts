export type Role = 'alumno' | 'autoridad';
export type Campus = 'UNE Campus Central' | 'UNE Campus Américas' | 'UNE Campus Tlaquepaque' | 'Global';

export interface User {
  id: string;
  name: string;
  role: Role;
  roleDisplay: string;
  campus: Campus;
  email?: string;
}

export type IncidentCategory = 'Infraestructura' | 'Sospechoso' | 'Emergencia' | 'Acoso' | 'SOS';
export type IncidentStatus = 'pendiente' | 'atendido' | 'despachado';
export type IncidentSeverity = 'baja' | 'media' | 'alta' | 'critica';

export interface Incident {
  id: number;
  category: IncidentCategory;
  description: string;
  zone: string;
  campus: Exclude<Campus, 'Global'>;
  status: IncidentStatus;
  severity: IncidentSeverity;
  user: string;
  time: string;
  coords: {
    top: string;
    left: string;
  };
}

export interface AccessLog {
  id: string;
  time: string;
  person: string;
  role: string;
  gate: string;
  campus: Exclude<Campus, 'Global'>;
  status: 'Autorizado' | 'Denegado';
}

export interface ZoneOverlay {
  id: string;
  name: string;
  type: 'danger' | 'safe';
  coords: {
    top: string;
    left: string;
    width: string;
    height: string;
  };
}