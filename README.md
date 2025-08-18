# MyCareBay

A comprehensive senior care management platform that empowers families with AI-powered care insights and personalized facility checklists to make informed decisions about their loved ones' care needs.

## What is MyCareBay?

MyCareBay helps families navigate senior care by providing:
- **AI Care Advisor**: Personalized care recommendations based on health profiles
- **Smart Facility Checklists**: Custom inspection lists tailored to specific needs
- **Senior Profile Management**: Secure storage and management of health information
- **Care Planning Tools**: Evidence-based guidance for care decisions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Google Gemini AI API key

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/mycarebay.git
cd mycarebay
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local with your credentials

# Initialize database
npm run test:supabase

# Start development
npm run dev:full
```

Visit <http://localhost:5173> to see the app running.

## 🏗️ Tech Stack

**Frontend**: React 19 + TypeScript + Vite + Tailwind CSS  
**Backend**: Express.js (local) / Vercel Serverless (production)  
**Database**: Supabase (PostgreSQL)  
**AI**: Google Gemini API  
**Deployment**: Vercel

## 📁 Project Structure

```
mycarebay/
├── src/
│   ├── components/     # React UI components
│   ├── services/       # API clients and AI integration
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript definitions
│   ├── constants/      # App constants and initial data
│   ├── styles/         # Global styles and CSS
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Vite entry point
├── api/                # Vercel serverless functions (production)
├── server/             # Local Express development server (dev only)
├── public/             # Static assets
└── supabase-migration.sql
```

## 🔧 Development Commands

```bash
npm run dev:full        # Start both frontend and backend
npm run dev             # Frontend only (Vite dev server)
npm run server          # Backend only (Express server)
npm run build           # Build for production
npm run test:supabase   # Test database connection
```

## 📊 Key Features

### AI-Powered Care Advice
Get personalized care recommendations based on detailed senior profiles including health conditions, medications, and care needs.

### Dynamic Facility Checklists
Generate customized inspection checklists for care facilities, tailored to specific ailments and requirements.

### Secure Profile Management
Store and manage senior health information with proper authentication and data protection.

## 🚀 Deployment

### Local Development
```bash
npm run dev:full
```
Access at <http://localhost:5173> (frontend) and <http://localhost:3001> (API)

### Production (Vercel)
1. Connect repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to `main` branch

**Required Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` 
- `GEMINI_API_KEY`
- `NODE_ENV=production`

## 🔒 Environment Setup

Create `.env.local`:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
```

## 🧪 API Endpoints

**Health**: `GET /api/health`  
**Authentication**: `POST /api/auth/login`  
**Seniors**: `GET/POST/DELETE /api/seniors/*`  

All endpoints work identically in local development and production.

## 🔍 Troubleshooting

**Build Issues**: Ensure `@vitejs/plugin-react` is installed  
**Database Issues**: Run `npm run test:supabase` to verify connection  
**API 404s**: Check that Express server is running on port 3001  
**UUID Errors**: Verify senior ID format in requests

## 📚 Documentation

- `STYLE_GUIDE.md` - Coding standards and conventions
- `TESTING_CHECKLIST.md` - Manual and automated testing procedures  
- `DEPLOYMENT_CHECKLIST.md` - Production deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow the style guide and run tests
4. Submit a pull request

## 📄 License

MIT License - see `LICENSE` file for details.

---

**Need Help?** Check the troubleshooting section or open an issue in the repository.
