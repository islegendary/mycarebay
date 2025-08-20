import { Senior } from '@/types';

export const INITIAL_SENIORS: Senior[] = [
  {
    id: 'senior-1',
    name: 'Eleanor Vance',
    relationship: 'Mother',
    ailments: [
      { id: 'ail-1', name: 'Arthritis', notes: 'Affects hands and knees primarily.' },
      { id: 'ail-2', name: 'Hypertension', notes: 'Monitored daily.' },
      { id: 'ail-3', name: 'Type 2 Diabetes', notes: 'Managed with diet and medication.' },
    ],
    medications: [
      { id: 'med-1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
      { id: 'med-2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { id: 'med-3', name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain' },
    ],
    appointments: [
      { id: 'appt-1', date: '2024-08-15', time: '10:00 AM', doctor: 'Dr. Chen', purpose: 'Cardiology Follow-up', location: 'City Heart Clinic' },
      { id: 'appt-2', date: '2024-09-02', time: '02:30 PM', doctor: 'Dr. Patel', purpose: 'Endocrinology Check-up', location: 'General Hospital' },
    ],
    contacts: [
      { id: 'con-1', name: 'Dr. Chen (Cardiologist)', type: 'Doctor', phone: '555-0101' },
      { id: 'con-2', name: 'Dr. Patel (Endocrinologist)', type: 'Doctor', phone: '555-0102' },
      { id: 'con-3', name: 'Main Street Pharmacy', type: 'Pharmacist', phone: '555-0103' },
      { id: 'con-4', name: 'Sarah (Neighbor)', type: 'Emergency', phone: '555-0104' },
    ]
  }
];