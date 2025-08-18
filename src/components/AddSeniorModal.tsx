import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Senior, Ailment, Medication, Appointment, Contact } from '@/types';

interface AddSeniorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (senior: Senior) => void;
  editingSenior?: Senior | null;
}

const AddSeniorModal: React.FC<AddSeniorModalProps> = ({ isOpen, onClose, onSave, editingSenior }) => {
  const [formData, setFormData] = useState<Partial<Senior>>({
    name: '',
    relationship: '',
    ailments: [],
    medications: [],
    appointments: [],
    contacts: []
  });

  // Ensure all related data has valid UUIDs (for backward compatibility with old data)
  const ensureValidUUIDs = (data: any[]) => {
    return data.map(item => ({
      ...item,
      id: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id)
        ? item.id
        : uuidv4()
    }));
  };

  // Update form data when editingSenior changes
  useEffect(() => {
    if (editingSenior) {
      setFormData({
        name: editingSenior.name || '',
        relationship: editingSenior.relationship || '',
        ailments: ensureValidUUIDs(editingSenior.ailments || []),
        medications: ensureValidUUIDs(editingSenior.medications || []),
        appointments: ensureValidUUIDs(editingSenior.appointments || []),
        contacts: ensureValidUUIDs(editingSenior.contacts || [])
      });
    } else {
      // Reset form when creating new senior
      setFormData({
        name: '',
        relationship: '',
        ailments: [],
        medications: [],
        appointments: [],
        contacts: []
      });
    }
  }, [editingSenior]);

  const [newAilment, setNewAilment] = useState({ name: '', notes: '' });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [newAppointment, setNewAppointment] = useState({ date: '', time: '', doctor: '', purpose: '', location: '' });
  const [newContact, setNewContact] = useState({ name: '', type: 'Doctor' as const, phone: '', email: '' });

  const isEditing = !!editingSenior;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.relationship) {
      alert('Please fill in the required fields (Name and Relationship)');
      return;
    }

    const seniorData: Senior = {
      id: editingSenior?.id || '', // Let backend generate UUID for new seniors
      name: formData.name,
      relationship: formData.relationship,
      avatarUrl: '', // No longer needed since we use initials
      ailments: formData.ailments || [],
      medications: formData.medications || [],
      appointments: formData.appointments || [],
      contacts: formData.contacts || []
    };

    onSave(seniorData);
    onClose();
  };

  const addAilment = () => {
    if (newAilment.name.trim()) {
      setFormData(prev => ({
        ...prev,
        ailments: [...(prev.ailments || []), { id: uuidv4(), ...newAilment }]
      }));
      setNewAilment({ name: '', notes: '' });
    }
  };

  const removeAilment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ailments: prev.ailments?.filter(a => a.id !== id) || []
    }));
  };

  const addMedication = () => {
    if (newMedication.name.trim() && newMedication.dosage.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...(prev.medications || []), { id: uuidv4(), ...newMedication }]
      }));
      setNewMedication({ name: '', dosage: '', frequency: '' });
    }
  };

  const removeMedication = (id: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications?.filter(m => m.id !== id) || []
    }));
  };

  const addAppointment = () => {
    if (newAppointment.date && newAppointment.doctor.trim()) {
      setFormData(prev => ({
        ...prev,
        appointments: [...(prev.appointments || []), { id: uuidv4(), ...newAppointment }]
      }));
      setNewAppointment({ date: '', time: '', doctor: '', purpose: '', location: '' });
    }
  };

  const removeAppointment = (id: string) => {
    setFormData(prev => ({
      ...prev,
      appointments: prev.appointments?.filter(a => a.id !== id) || []
    }));
  };

  const addContact = () => {
    if (newContact.name.trim() && newContact.phone.trim()) {
      setFormData(prev => ({
        ...prev,
        contacts: [...(prev.contacts || []), { id: uuidv4(), ...newContact }]
      }));
      setNewContact({ name: '', type: 'Doctor', phone: '', email: '' });
    }
  };

  const removeContact = (id: string) => {
    setFormData(prev => ({
      ...prev,
      contacts: prev.contacts?.filter(c => c.id !== id) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-brand-gray-dark">
            {isEditing ? 'Edit Senior Profile' : 'Add New Senior'}
          </h2>
          <button onClick={onClose} className="text-brand-gray-medium hover:text-brand-gray-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="form-label">Relationship *</label>
              <input
                type="text"
                className="form-input"
                value={formData.relationship}
                onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                placeholder="e.g., Mother, Father, Grandparent"
                required
              />
            </div>
          </div>

          {/* Ailments Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-brand-gray-dark mb-4">Ailments & Conditions</h3>
            <div className="space-y-4">
              {formData.ailments?.map(ailment => (
                <div key={ailment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="font-medium text-brand-gray-dark">{ailment.name}</p>
                    {ailment.notes && <p className="text-sm text-brand-gray-medium">{ailment.notes}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAilment(ailment.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ailment name"
                  value={newAilment.name}
                  onChange={(e) => setNewAilment(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Notes (optional)"
                  value={newAilment.notes}
                  onChange={(e) => setNewAilment(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <button
                type="button"
                onClick={addAilment}
                className="btn btn-secondary"
                disabled={!newAilment.name.trim()}
              >
                Add Ailment
              </button>
            </div>
          </div>

          {/* Medications Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-brand-gray-dark mb-4">Medications</h3>
            <div className="space-y-4">
              {formData.medications?.map(med => (
                <div key={med.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="font-medium text-brand-gray-dark">{med.name}</p>
                    <p className="text-sm text-brand-gray-medium">{med.dosage} - {med.frequency}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMedication(med.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Medication name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                />
              </div>
              <button
                type="button"
                onClick={addMedication}
                className="btn btn-secondary"
                disabled={!newMedication.name.trim() || !newMedication.dosage.trim()}
              >
                Add Medication
              </button>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-brand-gray-dark mb-4">Appointments</h3>
            <div className="space-y-4">
              {formData.appointments?.map(appt => (
                <div key={appt.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="font-medium text-brand-gray-dark">{appt.doctor}</p>
                    <p className="text-sm text-brand-gray-medium">{appt.purpose}</p>
                    <p className="text-sm text-brand-gray-medium">{appt.date} at {appt.time} - {appt.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAppointment(appt.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Doctor name"
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, doctor: e.target.value }))}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Purpose"
                  value={newAppointment.purpose}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, purpose: e.target.value }))}
                />
                <input
                  type="date"
                  className="form-input"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                />
                <input
                  type="time"
                  className="form-input"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                />
                <input
                  type="text"
                  className="form-input md:col-span-2"
                  placeholder="Location"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <button
                type="button"
                onClick={addAppointment}
                className="btn btn-secondary"
                disabled={!newAppointment.doctor.trim() || !newAppointment.date}
              >
                Add Appointment
              </button>
            </div>
          </div>

          {/* Contacts Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-brand-gray-dark mb-4">Important Contacts</h3>
            <div className="space-y-4">
              {formData.contacts?.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                  <div>
                    <p className="font-medium text-brand-gray-dark">{contact.name}</p>
                    <p className="text-sm text-brand-gray-medium">{contact.type} - {contact.phone}</p>
                    {contact.email && <p className="text-sm text-brand-gray-medium">{contact.email}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeContact(contact.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contact name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                />
                <select
                  className="form-input"
                  value={newContact.type}
                  onChange={(e) => setNewContact(prev => ({ ...prev, type: e.target.value as any }))}
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Specialist">Specialist</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Email (optional)"
                  value={newContact.email}
                  onChange={(e) => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <button
                type="button"
                onClick={addContact}
                className="btn btn-secondary"
                disabled={!newContact.name.trim() || !newContact.phone.trim()}
              >
                Add Contact
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSeniorModal;
