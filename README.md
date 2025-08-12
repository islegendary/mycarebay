# MyCareBay - Senior Care Management Platform Demo

MyCareBay is a comprehensive senior care management platform that helps families centralize their loved one's information and provides AI-powered insights to make confident care decisions.

## Features

### 🏠 Centralized Dashboard
- Manage multiple senior profiles with comprehensive information
- Track ailments, medications, appointments, and important contacts
- Secure, user-friendly interface for easy access to critical information

### 🤖 AI Care Advisor
- Ask complex caregiving questions and get reliable answers
- AI-powered insights grounded in reputable web sources
- Personalized recommendations for senior care scenarios

### ✅ Actionable Checklists
- Generate tailored checklists for facility visits
- Ensure you ask the right questions when evaluating care options
- Customizable checklists based on specific needs and situations

### 📱 Multi-Plan Support
- **Free Plan**: Manage 1 senior profile with basic features
- **Plus Plan**: AI Care Advisor Q&A for proactive planning
- **Pro Plan**: Up to 4 senior profiles with advanced AI features

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express.js, SQLite
- **Styling**: Tailwind CSS with custom design system
- **AI Integration**: Google Gemini API (configurable)
- **Database**: SQLite with relational schema

## Recent Fixes & Improvements

### ✅ Database Query Optimization
- **Fixed**: Eliminated data duplication issues that caused 15,000+ console errors
- **Improved**: Replaced problematic cartesian product queries with efficient separate queries
- **Enhanced**: Proper data grouping and null safety in React components

### ✅ Demo Data Persistence
- **Fixed**: Seeded senior data now properly persists with demo user account
- **Improved**: Seeding script uses existing demo user instead of creating duplicates
- **Enhanced**: Complete medical profile available immediately after login

### ✅ Initials Avatar System
- **Replaced**: Image-based avatars with elegant initials-based avatars
- **Added**: Consistent color generation based on senior names
- **Enhanced**: Professional appearance with proper typography and styling

### ✅ Error Handling
- **Fixed**: React key conflicts resolved with proper data structure
- **Improved**: Comprehensive error handling throughout the application
- **Enhanced**: User-friendly error messages and loading states

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mycarebay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   npm run dev:full
   ```

This will start both the backend server (port 3001) and frontend development server (port 5173).

4. **Seed the database with demo data (optional)**
   ```bash
   npm run seed
   ```

### Demo Credentials
After seeding the database, you can log in with:
- **Email**: demo@mycarebay.com
- **Password**: password
- **Plan**: Pro

**Demo Data Includes:**
- Eleanor Vance (Mother) with complete medical profile
- 3 health conditions: Arthritis, Hypertension, Type 2 Diabetes
- 3 medications: Lisinopril, Metformin, Ibuprofen
- 2 upcoming appointments: Cardiology and Endocrinology check-ups
- 4 important contacts: Doctors, pharmacy, and emergency contact

## Project Structure

```
mycarebay/
├── components/          # React components
│   ├── AddSeniorModal.tsx
│   ├── AuthModal.tsx
│   ├── CareAdvisor.tsx
│   ├── Dashboard.tsx
│   ├── Header.tsx
│   ├── InitialsAvatar.tsx # Reusable initials avatar component
│   ├── LandingPage.tsx
│   ├── SeniorCard.tsx
│   ├── SeniorProfile.tsx
│   └── ...
├── utils/              # Utility functions
│   └── initials.ts     # Initials generation and color utilities
├── server/             # Backend API
│   ├── index.js        # Express server
│   └── seedDatabase.js # Database seeding script
├── services/           # API services
│   ├── apiService.ts   # Frontend API client
│   └── geminiService.ts # AI integration
├── types.ts           # TypeScript type definitions
├── constants.ts       # Application constants
└── index.css          # Global styles and design system
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login/signup

### Senior Management
- `GET /api/seniors/:userId` - Get all seniors for a user
- `POST /api/seniors` - Create or update a senior
- `DELETE /api/seniors/:seniorId` - Delete a senior

## Database Schema

The application uses SQLite with the following main tables:
- `users` - User accounts and plan information
- `seniors` - Senior profiles
- `ailments` - Health conditions and notes
- `medications` - Prescription and dosage information
- `appointments` - Medical appointments and schedules
- `contacts` - Important contacts (doctors, emergency contacts, etc.)

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Google Gemini API (optional - for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Server configuration
PORT=3001
```

### AI Integration
To enable AI features, obtain a Google Gemini API key and add it to your environment variables. The AI features include:
- Care advice and recommendations
- Facility visit checklists
- Health information summaries

## Development

### Available Scripts
- `npm run dev` - Start frontend development server (port 5173)
- `npm run server` - Start backend API server (port 3001)
- `npm run dev:full` - Start both frontend and backend servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run seed` - Seed database with demo data (Eleanor Vance profile)

### Styling System
The application uses a centralized styling system with CSS custom properties defined in `index.css`. See `STYLE_GUIDE.md` for detailed documentation.

## Features in Detail

### Senior Profile Management
- **Basic Information**: Name, relationship, avatar
- **Health Conditions**: Track ailments with detailed notes
- **Medications**: Dosage, frequency, and administration details
- **Appointments**: Medical visits with doctor, purpose, and location
- **Contacts**: Important phone numbers and email addresses

### AI-Powered Features
- **Care Advisor**: Ask questions about senior care and get informed answers
- **Facility Checklists**: Generate customized checklists for care facility visits
- **Health Summaries**: AI-generated summaries of health information (coming soon)

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Changes are saved immediately to the database
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during data operations

## Troubleshooting

### Common Issues

**Server Port Already in Use (EADDRINUSE)**
```bash
# Kill existing Node.js processes
taskkill /F /IM node.exe  # Windows
pkill -f node             # Linux/Mac

# Or use a different port
PORT=3002 npm run server
```

**Database Issues**
```bash
# Reset database and reseed
rm database.sqlite
npm run seed
```

**Demo Data Not Showing**
- Ensure you're logged in with `demo@mycarebay.com`
- Run `npm run seed` to populate demo data
- Check that the server is running on port 3001

### Performance Notes
- The application has been optimized to eliminate data duplication
- API responses are now clean and efficient
- React components include proper null safety checks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository or contact the development team.

---

**MyCareBay** - Making senior care management easier, one family at a time.
