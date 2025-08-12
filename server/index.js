import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      plan TEXT DEFAULT 'free',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seniors table
    db.run(`CREATE TABLE IF NOT EXISTS seniors (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      relationship TEXT NOT NULL,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Ailments table
    db.run(`CREATE TABLE IF NOT EXISTS ailments (
      id TEXT PRIMARY KEY,
      senior_id TEXT NOT NULL,
      name TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors (id) ON DELETE CASCADE
    )`);

    // Medications table
    db.run(`CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY,
      senior_id TEXT NOT NULL,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      frequency TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors (id) ON DELETE CASCADE
    )`);

    // Appointments table
    db.run(`CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      senior_id TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT,
      doctor TEXT NOT NULL,
      purpose TEXT,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors (id) ON DELETE CASCADE
    )`);

    // Contacts table
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      senior_id TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (senior_id) REFERENCES seniors (id) ON DELETE CASCADE
    )`);
  });
}

// API Routes

// Get all seniors for a user
app.get('/api/seniors/:userId', (req, res) => {
  const { userId } = req.params;
  
  // First, get all seniors for the user
  db.all('SELECT * FROM seniors WHERE user_id = ?', [userId], (err, seniors) => {
    if (err) {
      console.error('Error fetching seniors:', err);
      return res.status(500).json({ error: 'Failed to fetch seniors' });
    }

    if (seniors.length === 0) {
      return res.json([]);
    }

    // Get all related data for all seniors
    const seniorIds = seniors.map(s => s.id);
    const placeholders = seniorIds.map(() => '?').join(',');
    
    // Get ailments
    db.all(`SELECT * FROM ailments WHERE senior_id IN (${placeholders})`, seniorIds, (err, ailments) => {
      if (err) {
        console.error('Error fetching ailments:', err);
        return res.status(500).json({ error: 'Failed to fetch ailments' });
      }

      // Get medications
      db.all(`SELECT * FROM medications WHERE senior_id IN (${placeholders})`, seniorIds, (err, medications) => {
        if (err) {
          console.error('Error fetching medications:', err);
          return res.status(500).json({ error: 'Failed to fetch medications' });
        }

        // Get appointments
        db.all(`SELECT * FROM appointments WHERE senior_id IN (${placeholders})`, seniorIds, (err, appointments) => {
          if (err) {
            console.error('Error fetching appointments:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
          }

          // Get contacts
          db.all(`SELECT * FROM contacts WHERE senior_id IN (${placeholders})`, seniorIds, (err, contacts) => {
            if (err) {
              console.error('Error fetching contacts:', err);
              return res.status(500).json({ error: 'Failed to fetch contacts' });
            }

            // Group related data by senior_id
            const ailmentsBySenior = {};
            const medicationsBySenior = {};
            const appointmentsBySenior = {};
            const contactsBySenior = {};

            ailments.forEach(ailment => {
              if (!ailmentsBySenior[ailment.senior_id]) {
                ailmentsBySenior[ailment.senior_id] = [];
              }
              ailmentsBySenior[ailment.senior_id].push(ailment);
            });

            medications.forEach(med => {
              if (!medicationsBySenior[med.senior_id]) {
                medicationsBySenior[med.senior_id] = [];
              }
              medicationsBySenior[med.senior_id].push(med);
            });

            appointments.forEach(appt => {
              if (!appointmentsBySenior[appt.senior_id]) {
                appointmentsBySenior[appt.senior_id] = [];
              }
              appointmentsBySenior[appt.senior_id].push(appt);
            });

            contacts.forEach(contact => {
              if (!contactsBySenior[contact.senior_id]) {
                contactsBySenior[contact.senior_id] = [];
              }
              contactsBySenior[contact.senior_id].push(contact);
            });

            // Combine all data
            const result = seniors.map(senior => ({
              ...senior,
              ailments: ailmentsBySenior[senior.id] || [],
              medications: medicationsBySenior[senior.id] || [],
              appointments: appointmentsBySenior[senior.id] || [],
              contacts: contactsBySenior[senior.id] || []
            }));

            res.json(result);
          });
        });
      });
    });
  });
});

// Create or update a senior
app.post('/api/seniors', (req, res) => {
  const { userId, senior } = req.body;
  
  if (!userId || !senior.name || !senior.relationship) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isUpdate = senior.id && senior.id !== 'new';
  const seniorId = isUpdate ? senior.id : uuidv4();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    try {
      if (isUpdate) {
        // Update existing senior
        db.run(`
          UPDATE seniors 
          SET name = ?, relationship = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND user_id = ?
        `, [senior.name, senior.relationship, seniorId, userId]);

        // Clear existing related data
        db.run('DELETE FROM ailments WHERE senior_id = ?', [seniorId]);
        db.run('DELETE FROM medications WHERE senior_id = ?', [seniorId]);
        db.run('DELETE FROM appointments WHERE senior_id = ?', [seniorId]);
        db.run('DELETE FROM contacts WHERE senior_id = ?', [seniorId]);
      } else {
        // Create new senior
        db.run(`
          INSERT INTO seniors (id, user_id, name, relationship, avatar_url)
          VALUES (?, ?, ?, ?, ?)
        `, [seniorId, userId, senior.name, senior.relationship, '']);
      }

      // Insert ailments
      if (senior.ailments && senior.ailments.length > 0) {
        const ailmentStmt = db.prepare('INSERT INTO ailments (id, senior_id, name, notes) VALUES (?, ?, ?, ?)');
        senior.ailments.forEach(ailment => {
          ailmentStmt.run(uuidv4(), seniorId, ailment.name, ailment.notes || '');
        });
        ailmentStmt.finalize();
      }

      // Insert medications
      if (senior.medications && senior.medications.length > 0) {
        const medStmt = db.prepare('INSERT INTO medications (id, senior_id, name, dosage, frequency) VALUES (?, ?, ?, ?, ?)');
        senior.medications.forEach(med => {
          medStmt.run(uuidv4(), seniorId, med.name, med.dosage, med.frequency || '');
        });
        medStmt.finalize();
      }

      // Insert appointments
      if (senior.appointments && senior.appointments.length > 0) {
        const apptStmt = db.prepare('INSERT INTO appointments (id, senior_id, date, time, doctor, purpose, location) VALUES (?, ?, ?, ?, ?, ?, ?)');
        senior.appointments.forEach(appt => {
          apptStmt.run(uuidv4(), seniorId, appt.date, appt.time || '', appt.doctor, appt.purpose || '', appt.location || '');
        });
        apptStmt.finalize();
      }

      // Insert contacts
      if (senior.contacts && senior.contacts.length > 0) {
        const contactStmt = db.prepare('INSERT INTO contacts (id, senior_id, name, type, phone, email) VALUES (?, ?, ?, ?, ?, ?)');
        senior.contacts.forEach(contact => {
          contactStmt.run(uuidv4(), seniorId, contact.name, contact.type, contact.phone, contact.email || '');
        });
        contactStmt.finalize();
      }

      db.run('COMMIT', (err) => {
        if (err) {
          console.error('Error committing transaction:', err);
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Failed to save senior' });
        }
        
        res.json({ 
          success: true, 
          seniorId,
          message: isUpdate ? 'Senior updated successfully' : 'Senior created successfully'
        });
      });

    } catch (error) {
      console.error('Error in transaction:', error);
      db.run('ROLLBACK');
      res.status(500).json({ error: 'Failed to save senior' });
    }
  });
});

// Delete a senior
app.delete('/api/seniors/:seniorId', (req, res) => {
  const { seniorId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  db.run('DELETE FROM seniors WHERE id = ? AND user_id = ?', [seniorId, userId], function(err) {
    if (err) {
      console.error('Error deleting senior:', err);
      return res.status(500).json({ error: 'Failed to delete senior' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Senior not found' });
    }

    res.json({ success: true, message: 'Senior deleted successfully' });
  });
});

// User authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, name, plan } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Authentication failed' });
    }

    if (user) {
      // User exists, return existing user
      res.json(user);
    } else {
      // Create new user
      const userId = uuidv4();
      db.run('INSERT INTO users (id, email, name, plan) VALUES (?, ?, ?, ?)', 
        [userId, email, name, plan || 'free'], 
        function(err) {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          res.json({ id: userId, email, name, plan: plan || 'free' });
        }
      );
    }
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
