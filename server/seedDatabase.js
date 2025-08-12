import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';

const db = new sqlite3.Database('./database.sqlite');

// Eleanor Vance's data
const eleanorData = {
  name: 'Eleanor Vance',
  relationship: 'Mother',
  avatarUrl: '',
  ailments: [
    { name: 'Arthritis', notes: 'Affects hands and knees primarily.' },
    { name: 'Hypertension', notes: 'Monitored daily.' },
    { name: 'Type 2 Diabetes', notes: 'Managed with diet and medication.' },
  ],
  medications: [
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
    { name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain' },
  ],
  appointments: [
    { date: '2024-08-15', time: '10:00 AM', doctor: 'Dr. Chen', purpose: 'Cardiology Follow-up', location: 'City Heart Clinic' },
    { date: '2024-09-02', time: '02:30 PM', doctor: 'Dr. Patel', purpose: 'Endocrinology Check-up', location: 'General Hospital' },
  ],
  contacts: [
    { name: 'Dr. Chen (Cardiologist)', type: 'Doctor', phone: '555-0101' },
    { name: 'Dr. Patel (Endocrinologist)', type: 'Doctor', phone: '555-0102' },
    { name: 'Main Street Pharmacy', type: 'Pharmacist', phone: '555-0103' },
    { name: 'Sarah (Neighbor)', type: 'Emergency', phone: '555-0104' },
  ]
};

function seedDatabase() {
  console.log('Starting database seeding...');
  
  db.serialize(() => {
    // First, check if demo user already exists
    db.get('SELECT id FROM users WHERE email = ?', ['demo@mycarebay.com'], (err, existingUser) => {
      if (err) {
        console.error('Error checking for existing demo user:', err);
        return;
      }

      let demoUserId;
      if (existingUser) {
        // Use existing demo user
        demoUserId = existingUser.id;
        console.log('Using existing demo user');
      } else {
        // Create new demo user
        demoUserId = uuidv4();
        const demoUser = {
          id: demoUserId,
          email: 'demo@mycarebay.com',
          name: 'Demo User',
          plan: 'pro'
        };

        db.run('INSERT INTO users (id, email, name, plan) VALUES (?, ?, ?, ?)', 
          [demoUser.id, demoUser.email, demoUser.name, demoUser.plan],
          function(err) {
            if (err) {
              console.error('Error creating demo user:', err);
              return;
            }
            console.log('Demo user created');
          }
        );
      }

              // Create Eleanor Vance senior profile
        const seniorId = uuidv4();
        db.run('INSERT OR IGNORE INTO seniors (id, user_id, name, relationship, avatar_url) VALUES (?, ?, ?, ?, ?)',
          [seniorId, demoUserId, eleanorData.name, eleanorData.relationship, ''],
          function(err) {
            if (err) {
              console.error('Error creating senior profile:', err);
              return;
            }
            console.log('Eleanor Vance profile created/verified');

            // Insert ailments
            eleanorData.ailments.forEach(ailment => {
              db.run('INSERT OR IGNORE INTO ailments (id, senior_id, name, notes) VALUES (?, ?, ?, ?)',
                [uuidv4(), seniorId, ailment.name, ailment.notes]);
            });

            // Insert medications
            eleanorData.medications.forEach(med => {
              db.run('INSERT OR IGNORE INTO medications (id, senior_id, name, dosage, frequency) VALUES (?, ?, ?, ?, ?)',
                [uuidv4(), seniorId, med.name, med.dosage, med.frequency]);
            });

            // Insert appointments
            eleanorData.appointments.forEach(appt => {
              db.run('INSERT OR IGNORE INTO appointments (id, senior_id, date, time, doctor, purpose, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [uuidv4(), seniorId, appt.date, appt.time, appt.doctor, appt.purpose, appt.location]);
            });

            // Insert contacts
            eleanorData.contacts.forEach(contact => {
              db.run('INSERT OR IGNORE INTO contacts (id, senior_id, name, type, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
                [uuidv4(), seniorId, contact.name, contact.type, contact.phone, contact.email || '']);
            });

            console.log('Database seeding completed successfully!');
            console.log('Demo user credentials:');
            console.log('Email: demo@mycarebay.com');
            console.log('Password: password');
            console.log('Plan: Pro');
            
            db.close();
          }
        );
      }
    );
  });
}

seedDatabase();
