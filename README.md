# MyCareBay

A comprehensive care management platform for seniors, built with React 19, TypeScript, Vite, and Supabase.

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js / Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel
- **Performance**: Code splitting, lazy loading, error boundaries

## 🎯 Key Features

### Core Functionality
- **Senior Management**: Add, edit, and manage senior profiles
- **Health Tracking**: Monitor ailments, medications, and appointments
- **Contact Management**: Store and organize emergency contacts
- **AI-Powered Care Advice**: Get personalized care recommendations
- **Responsive Design**: Works seamlessly on all devices

### Performance & Reliability
- **Error Boundaries**: Graceful error handling to prevent app crashes
- **Code Splitting**: Optimized bundle loading for better performance
- **Performance Monitoring**: Track component load times and user experience
- **Error Logging**: Centralized error tracking and reporting

## 📁 Project Structure

```
src/
├── components/          # React components with lazy loading
├── services/           # API services and error handling
├── hooks/              # Custom hooks including performance monitoring
├── types/              # TypeScript type definitions
├── constants/          # App constants and demo data
├── styles/             # Global styles
└── App.tsx            # Main app with error boundaries
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key (optional)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd mycarebay

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API (optional - for AI features)
# Use VITE_ prefix for client-side access
VITE_GEMINI_API_KEY=your_gemini_api_key_here
# Fallback for server-side access
GEMINI_API_KEY=your_gemini_api_key_here

# Development Configuration
NODE_ENV=development
```

### Database Setup

The application uses Supabase with the following table structure:

- **users**: User accounts and authentication
- **seniors**: Senior profiles and relationships
- **ailments**: Health conditions and notes
- **medications**: Prescription and dosage information
- **appointments**: Medical appointments and schedules
- **contacts**: Emergency and medical contacts
- **error_logs**: Application error tracking
- **performance_logs**: Performance monitoring data

All tables use UUID primary keys and proper foreign key relationships.

### Development

```bash
# Start development server
npm run dev

# Start backend server (in separate terminal)
npm run server

# Build for production
npm run build

# Type checking
npm run type-check
```

## 🌐 API Endpoints

### Core Endpoints
- `POST /api/auth/login` - User authentication
- `GET /api/seniors/user` - Get user's seniors
- `POST /api/seniors` - Create/update senior
- `DELETE /api/seniors/delete` - Delete senior

### Monitoring Endpoints
- `POST /api/error-log` - Log application errors
- `POST /api/performance-log` - Log performance metrics

### AI Endpoints
- `POST /api/ai/care-advice` - Get AI care recommendations
- `POST /api/ai/facility-checklist` - Generate facility checklists

## 📚 Documentation

- [Performance & Error Handling](./PERFORMANCE_AND_ERROR_HANDLING.md) - Detailed guide on error boundaries and performance monitoring
- [Testing Summary](./TESTING_SUMMARY.md) - Testing results and verification
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md) - Production deployment guide
- [Testing Checklist](./TESTING_CHECKLIST.md) - Comprehensive testing procedures
- [Style Guide](./STYLE_GUIDE.md) - Code style and conventions

## 🚀 Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your Vercel project settings:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` (if using AI features)
- `GEMINI_API_KEY` (server-side fallback)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the documentation files
- Review the testing checklists
- Open an issue on GitHub

---

**MyCareBay** - Making senior care management simple and efficient. 💙
