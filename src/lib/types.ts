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

export type IncidentCategory = 'Infraestructura' | 'Sospechoso' | 'Emergencia' | 'Acoso';
export type IncidentStatus = 'pendiente' | 'atendido';

export interface Incident {
  id: number;
  category: IncidentCategory;
  description: string;
  zone: string;
  campus: Exclude<Campus, 'Global'>;
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
  campus: Exclude<Campus, 'Global'>;
  status: 'Autorizado' | 'Denegado';
}
