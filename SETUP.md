# MyCareBay Setup Guide

## Quick Start for Demo

### 1. Clone and Install
```bash
git clone <repository-url>
cd mycarebay
npm install
```

### 2. Set Up Environment Variables
Copy `env.example` to `.env.local` and fill in your Supabase credentials:
```bash
cp env.example .env.local
```

### 3. Set Up Database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire contents of `supabase-migration.sql`
4. Run the migration

### 4. Start Development Server
```bash
npm run dev:full
```

### 5. Access Demo Account
- **URL**: http://localhost:5173
- **Email**: `demo@mycarebay.com`
- **Password**: `Demo2024!`

## What's Included in Demo

The demo account comes with a complete Eleanor Vance profile including:

### Health Information
- **Ailments**: Arthritis, Hypertension, Type 2 Diabetes
- **Medications**: Lisinopril, Metformin, Ibuprofen
- **Appointments**: Future appointments with Dr. Chen and Dr. Patel
- **Contacts**: Medical professionals and emergency contacts

### Features to Test
- View and edit senior profile
- Manage health information
- Schedule appointments
- Store emergency contacts
- AI-powered care advice (Pro plan feature)

## Production Deployment

For production deployment on Vercel:
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy - the demo account will be automatically available

The demo data is created once during database migration and will be available immediately after setup.
