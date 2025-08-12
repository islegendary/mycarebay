# Deployment Guide

## Environment Setup

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key (for AI features)

### Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your API key:
   ```bash
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   PORT=3001
   ```

### Local Development
```bash
# Install dependencies
npm install

# Start both frontend and backend servers
npm run dev:full

# Or start them separately:
npm run server    # Backend on port 3001
npm run dev       # Frontend on port 5173

# Seed the database with demo data
npm run seed
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### 1. Railway.app (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway add
railway deploy
```

Add environment variables in Railway dashboard:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: production

### 2. Render.com
1. Connect your GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm run server`
4. Add environment variables in dashboard

### 3. Vercel (Frontend) + Railway (Backend)
Deploy frontend to Vercel and backend to Railway separately.

## Database Notes
- SQLite database is created automatically
- Database file is git-ignored for security
- Use seeding script to populate initial data
- For production, consider PostgreSQL for better concurrency

## Security Checklist
- ✅ API keys stored in environment variables
- ✅ Database files excluded from git
- ✅ CORS properly configured
- ✅ Input validation on all endpoints
- ✅ No sensitive data in repository
