export interface Contact {
  id: string;
  name: string;
  type: 'Doctor' | 'Specialist' | 'Emergency' | 'Pharmacist' | 'Other';
  phone: string;
  email?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  purpose: string;
  location: string;
}

export interface Ailment {
  id:string;
  name: string;
  notes?: string;
}

export interface Senior {
  id: string;
  name: string;
  relationship: string;
  avatarUrl: string;
  ailments: Ailment[];
  medications: Medication[];
  appointments: Appointment[];
  contacts: Contact[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface CareAdvice {
  text: string;
  sources: GroundingSource[];
}

export interface ChecklistCategory {
  category: string;
  questions: string[];
}

export interface ChecklistResponse {
  checklist: ChecklistCategory[];
}

export type Plan = 'free' | 'plus' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: Plan;
}