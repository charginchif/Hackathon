export type Role = 'alumno' | 'autoridad';

export interface User {
  id: string;
  name: string;
  role: Role;
  roleDisplay: string;
}

export type IncidentCategory = 'Infraestructura' | 'Sospechoso' | 'Emergencia' | 'Acoso';
export type IncidentStatus = 'pendiente' | 'atendido';

export interface Incident {
  id: number;
  category: IncidentCategory;
  description: string;
  zone: string;
  status: IncidentStatus;
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
  status: 'Autorizado' | 'Denegado';
}