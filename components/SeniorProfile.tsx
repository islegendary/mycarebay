import React, { useState } from 'react';
import { Senior, Ailment, Medication, Appointment, Contact } from '../types';
import AilmentInfoModal from './AilmentInfoModal';
import InfoCard from './InfoCard';
import InitialsAvatar from './InitialsAvatar';

interface SeniorProfileProps {
  senior: Senior;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SeniorProfile: React.FC<SeniorProfileProps> = ({ senior, onBack, onEdit, onDelete }) => {
  const [selectedAilment, setSelectedAilment] = useState<Ailment | null>(null);

  return (
    <div>
      <button onClick={onBack} className="flex items-center text-sm text-brand-blue hover:text-brand-blue-dark font-medium mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center">
          <InitialsAvatar name={senior.name} size="xl" />
          <div className="mt-4 md:mt-0 md:ml-6">
            <h2 className="text-4xl font-extrabold text-brand-gray-dark">{senior.name}</h2>
            <p className="text-xl text-brand-gray-medium">{senior.relationship}</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={onEdit}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
          <button
            onClick={onDelete}
            className="btn btn-secondary text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
          >
            Delete Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Ailments Section */}
          <InfoCard title="Ailments & Conditions">
            <ul className="divide-y divide-slate-200">
              {(senior.ailments || []).map(ailment => (
                <li key={ailment.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-brand-gray-dark">{ailment.name}</p>
                    {ailment.notes && <p className="text-sm text-brand-gray-medium">{ailment.notes}</p>}
                  </div>
                  <button onClick={() => setSelectedAilment(ailment)} className="text-sm font-semibold text-brand-blue hover:text-brand-blue-dark">
                    Learn More
                  </button>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Medications Section */}
          <InfoCard title="Medications">
            <ul className="divide-y divide-slate-200">
              {(senior.medications || []).map(med => (
                <li key={med.id} className="py-3">
                  <p className="font-medium text-brand-gray-dark">{med.name}</p>
                  <p className="text-sm text-brand-gray-medium">{med.dosage} - {med.frequency}</p>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
        <div className="space-y-8">
          {/* Appointments Section */}
          <InfoCard title="Upcoming Appointments">
             <ul className="divide-y divide-slate-200">
              {(senior.appointments || []).map(appt => (
                <li key={appt.id} className="py-3">
                  <p className="font-medium text-brand-gray-dark">{new Date(appt.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}</p>
                  <p className="text-sm text-brand-gray-medium">{appt.purpose} with {appt.doctor}</p>
                  <p className="text-sm text-brand-gray-medium">at {appt.location}</p>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Contacts Section */}
          <InfoCard title="Important Contacts">
             <ul className="divide-y divide-slate-200">
              {(senior.contacts || []).map(contact => (
                <li key={contact.id} className="py-3">
                  <p className="font-medium text-brand-gray-dark">{contact.name} <span className="text-xs font-semibold bg-brand-blue-light text-brand-blue-dark px-2 py-0.5 rounded-full ml-2">{contact.type}</span></p>
                  <p className="text-sm text-brand-gray-medium">{contact.phone}</p>
                  {contact.email && <p className="text-sm text-brand-gray-medium">{contact.email}</p>}
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </div>
      
      {selectedAilment && (
        <AilmentInfoModal 
          ailmentName={selectedAilment.name} 
          onClose={() => setSelectedAilment(null)}
        />
      )}
    </div>
  );
};

export default SeniorProfile;