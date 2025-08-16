# MyCareBay - AI-Powered Senior Care Assistant

MyCareBay is a comprehensive web application designed to help caregivers and families manage senior care with AI-powered assistance. The platform provides personalized care advice, facility checklists, and senior profile management with full data persistence.

## 🚀 Features

### Core Features
- **Senior Profile Management**: Create and manage detailed profiles with ailments, medications, appointments, and contacts
- **AI-Powered Care Advisor**: Get instant, personalized care advice using Google Gemini AI
- **Facility Checklist Generator**: Generate customized checklists for long-term care facility visits
- **Data Persistence**: All senior information is securely stored and persists across sessions

### AI Features
- **Real-time Care Advice**: Ask questions and get instant AI-powered responses
- **Facility Assessment**: Generate personalized facility visit checklists
- **Condition-Specific Guidance**: Tailored advice based on senior's ailments
- **Source Attribution**: All AI responses include verified sources

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI with Tailwind CSS
- **Real-time Updates**: Instant feedback and loading states
- **Secure Authentication**: User accounts with secure data storage

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript for type safety
- **Vite** for fast development and building  
- **Tailwind CSS** for responsive styling
- **UUID** for reliable data management

### Backend
- **Vercel Serverless Functions** for scalable API
- **Supabase** (PostgreSQL) for reliable data storage
- **Google Gemini AI** for intelligent responses

### Deployment & Infrastructure
- **Vercel** for hosting and serverless functions
- **GitHub** for version control and CI/CD
- **Environment Variables** for secure configuration

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mycarebay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Run the Supabase migration script
   npm run test:supabase
   ```

5. **Start the development server**
   ```bash
   npm run dev:full
   ```

   This starts both the frontend (Vite) and backend (Express) servers concurrently.

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server
- `npm run dev:full` - Start both frontend and backend 
- `npm run build` - Build for production
- `npm run test:supabase` - Test Supabase connection
- `npm run preview` - Preview production build

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the migration script in `supabase-migration.sql`
3. Update your environment variables with Supabase credentials

### Database Schema

The application uses the following main tables:
- `users` - User authentication and profiles
- `seniors` - Senior profiles with personal information
- `ailments` - Medical conditions and ailments
- `medications` - Medication tracking

## 🚀 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

### Environment Variables for Production

Set these in your Vercel dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `NODE_ENV=production`

## 📁 Project Structure

```
mycarebay/
├── api/                    # Vercel serverless functions
│   ├── auth/
│   └── seniors/
├── components/             # React components
│   ├── CareAdvisor.tsx    # AI-powered care advice
│   ├── Dashboard.tsx      # Main dashboard
│   ├── SeniorProfile.tsx  # Senior profile view
│   └── ...
├── services/              # API and AI services
│   ├── apiService.ts      # Backend API client
│   └── geminiService.ts   # Google Gemini AI integration
├── server/                # Express backend (development)
├── utils/                 # Utility functions
├── types.ts              # TypeScript type definitions
├── vite.config.ts        # Vite configuration
├── vercel.json           # Vercel deployment config
└── README.md             # This file
```

## 🔧 Configuration

### AI Integration
The application uses Google Gemini AI for:
- Care advice generation
- Facility checklist creation
- Personalized recommendations

### Database
- **Development**: Local Express server with Supabase
- **Production**: Vercel serverless functions with Supabase

## 🧪 Testing

### Local Testing
1. Start the development server: `npm run dev:full`
2. Test Supabase connection: `npm run test:supabase`
3. Verify all features work correctly

### Testing Checklist
See `TESTING_CHECKLIST.md` for comprehensive testing procedures.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Seniors
- `GET /api/seniors/:userId` - Get seniors for user
- `POST /api/seniors` - Create new senior
- `PUT /api/seniors/:seniorId` - Update senior
- `DELETE /api/seniors/:seniorId` - Delete senior

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the testing checklist
- Open an issue on GitHub

## 🔄 Recent Updates

### Latest Features & Fixes
- ✅ **Critical Data Persistence Fix**: Resolved UUID generation issues for reliable data saving
- ✅ **Backward Compatibility**: Automatic conversion of legacy data to proper UUID format
- ✅ **Avatar Display**: Fixed initials visibility with proper Tailwind CSS implementation
- ✅ **AI-Powered Care Advisor**: Personalized advice with Google Gemini AI
- ✅ **Facility Checklist Generator**: Customized facility assessment tools
- ✅ **Complete CRUD Operations**: Add, edit, delete senior profiles with full data persistence

### Technical Improvements
- ✅ **UUID Data Integrity**: All database operations now use proper UUIDs for PostgreSQL compatibility
- ✅ **Vercel Deployment**: Optimized for serverless functions with PostCSS Tailwind setup
- ✅ **Error Handling**: Enhanced API error logging and user feedback
- ✅ **Tailwind CSS**: Full migration from CDN to PostCSS with dynamic class safelist
- ✅ **TypeScript**: Complete type safety across frontend and backend
- ✅ **Performance**: Optimized loading states and responsive design
