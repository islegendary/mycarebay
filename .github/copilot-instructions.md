# Copilot Instructions for MyCareBay

## Project Overview

MyCareBay is a comprehensive senior care management platform providing AI-powered care advice and facility checklists. Built with React 19 + TypeScript + Vite, Express.js/Vercel serverless functions, Supabase (PostgreSQL), and Google Gemini AI.

## Architecture

**Frontend**: React components in `components/` with TypeScript, Tailwind CSS  
**Backend**: Local Express (`server/index.js`) + Vercel serverless functions (`api/`)  
**Database**: Supabase PostgreSQL, schema in `supabase-migration.sql`  
**AI**: Google Gemini via `services/geminiService.ts`  
**Types**: Centralized in `types.ts`

## Core Workflows

```bash
npm install              # Install dependencies
npm run dev:full         # Start frontend + backend
npm run test:supabase    # Test database connection
npm run build            # Production build
vercel --prod            # Deploy to production
```

## Key Patterns

### AI Integration

- Use `getCareAdvice()` and `generateFacilityChecklist()` from `geminiService.ts`
- Always check for API key presence and provide fallbacks
- AI responses are personalized using senior profile data

### API Structure

- Local development: Express routes in `server/index.js`
- Production: Vercel serverless functions in `api/`
- Route parity between both environments is critical
- All endpoints prefixed with `/api`

### Component Standards

- TypeScript interfaces for all props
- Loading/error states for async operations
- Markdown rendering for AI-generated content
- Responsive design with Tailwind CSS

### Database Operations

- All access via Supabase client
- UUID primary keys, proper foreign key relationships
- Row Level Security (RLS) for data protection
- Use parameterized queries to prevent injection

## Environment Requirements

**Required Variables:**

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `GEMINI_API_KEY` - Google AI API key
- `NODE_ENV` - Environment (development/production)

## Common Tasks

**Add AI Feature**: Extend `geminiService.ts`, create/update component  
**Add API Endpoint**: Create matching files in both `server/` and `api/`  
**Database Changes**: Update `supabase-migration.sql` and test locally  
**New Component**: Follow TypeScript patterns in existing components

## Testing & Deployment

- Manual testing procedures in `TESTING_CHECKLIST.md`
- Deployment steps in `DEPLOYMENT_CHECKLIST.md`
- Code standards in `STYLE_GUIDE.md`
- Local testing: `npm run test:supabase`
- Production deployment: Push to `main` branch triggers auto-deploy

## Error Handling

- User-facing: Friendly error messages
- Development: Console logging for debugging
- API failures: Graceful degradation with fallback content
- Missing API keys: Clear instructions for setup

## Security Notes

- JWT authentication via Supabase
- Environment variables for all secrets
- Input validation on all user data
- RLS policies enforce data access controls

---

For detailed setup and architecture, see `README.md`. For specific procedures, reference the appropriate checklist documentation.
