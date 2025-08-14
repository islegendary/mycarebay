# MyCareBay - AI-Powered Senior Care Assistant

MyCareBay is a comprehensive web application designed to help caregivers and families manage senior care with AI-powered assistance. The platform provides personalized care advice, facility checklists, and senior profile management.

## 🚀 Features

### Core Features
- **Senior Profile Management**: Create and manage detailed profiles for seniors with ailments, medications, and care notes
- **AI-Powered Care Advisor**: Get instant, personalized care advice using Google Gemini AI
- **Facility Checklist Generator**: Generate customized checklists for long-term care facility visits
- **Personalized Recommendations**: AI suggestions based on senior's specific conditions and needs

### AI Features
- **Real-time Care Advice**: Ask questions and get instant AI-powered responses
- **Facility Assessment**: Generate personalized facility visit checklists
- **Condition-Specific Guidance**: Tailored advice based on senior's ailments
- **Source Attribution**: All AI responses include verified sources

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI with easy navigation
- **Personalization**: Customized experience based on senior profiles
- **Real-time Updates**: Instant feedback and loading states

## 🛠️ Technology Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Hooks** for state management

### Backend
- **Node.js** with Express.js
- **Supabase** (PostgreSQL) for database
- **Google Gemini AI** for intelligent responses

### Deployment
- **Vercel** for hosting and serverless functions
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

### Latest Features
- ✅ AI-powered Care Advisor with personalized advice
- ✅ Facility checklist generator
- ✅ Senior profile management
- ✅ Supabase database integration
- ✅ Vercel deployment ready
- ✅ Responsive design
- ✅ TypeScript implementation

### Technical Improvements
- ✅ Migrated from SQLite to Supabase
- ✅ Added serverless functions for Vercel
- ✅ Improved error handling
- ✅ Enhanced UI/UX
- ✅ Added loading states and animations
