# Vercel Deployment Guide for MyCareBay

This guide provides step-by-step instructions for deploying MyCareBay to Vercel, including database setup, environment configuration, and troubleshooting.

## 🚀 Prerequisites

Before deploying, ensure you have:
- [GitHub account](https://github.com)
- [Vercel account](https://vercel.com)
- [Supabase account](https://supabase.com)
- [Google Gemini API key](https://makersuite.google.com/app/apikey)

## 📋 Pre-Deployment Checklist

### 1. Database Setup (Supabase)

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migration**
   ```bash
   # Copy the migration script to your Supabase SQL editor
   # File: supabase-migration.sql
   ```

3. **Verify Database Connection**
   ```bash
   npm run test:supabase
   ```

### 2. Environment Variables

Create a `.env.local` file with:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### 3. Local Testing

Ensure everything works locally:
```bash
npm run dev:full
```

## 🔧 Vercel Deployment Steps

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**
   - Go to GitHub and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/mycarebay.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Environment Variables

Set these in your Vercel project settings:

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `GEMINI_API_KEY` | Your Google Gemini API key | `AIzaSyC6YNSdCuGNFPiJfJDJkm1POXTxZqPVO6I` |
| `NODE_ENV` | Environment | `production` |

### Step 4: Deploy

1. **Deploy**
   - Click "Deploy" in Vercel
   - Wait for the build to complete

2. **Verify Deployment**
   - Check that all pages load correctly
   - Test the AI features
   - Verify database connections

## 📁 Project Structure for Vercel

```
mycarebay/
├── api/                    # Serverless functions
│   ├── auth/
│   │   └── login.js       # Authentication endpoint
│   └── seniors/
│       ├── index.js       # GET/POST seniors
│       ├── [userId].js    # Get seniors by user
│       └── [seniorId].js  # Update/delete senior
├── components/             # React components
├── services/              # API services
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies and scripts
```

## ⚙️ Vercel Configuration

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common causes:
# - Missing environment variables
# - TypeScript errors
# - Missing dependencies
```

#### 2. API Errors
```bash
# Check serverless function logs
# Verify environment variables are set
# Test API endpoints locally first
```

#### 3. Database Connection Issues
```bash
# Verify Supabase credentials
# Check network access
# Test with: npm run test:supabase
```

#### 4. AI Features Not Working
```bash
# Verify GEMINI_API_KEY is set
# Check API key permissions
# Test locally first
```

### Debugging Steps

1. **Check Vercel Logs**
   - Go to your project in Vercel dashboard
   - Click on "Functions" tab
   - Check for errors in serverless functions

2. **Test Environment Variables**
   ```bash
   # Add console.log to your API functions
   console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
   ```

3. **Verify Database**
   ```bash
   # Test Supabase connection
   npm run test:supabase
   ```

## 🔄 Continuous Deployment

### Automatic Deployments
- Vercel automatically deploys on push to `main` branch
- Preview deployments for pull requests
- Easy rollback to previous versions

### Manual Deployments
```bash
# Deploy from CLI
npm i -g vercel
vercel --prod
```

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Track page views and user interactions
- Monitor API response times

### Error Tracking
- Check Vercel function logs regularly
- Monitor for 500 errors
- Set up alerts for critical issues

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use Vercel's environment variable system
- Rotate API keys regularly

### API Security
- Validate all inputs in serverless functions
- Implement proper error handling
- Use HTTPS for all requests

### Database Security
- Use Supabase Row Level Security (RLS)
- Limit database access to necessary operations
- Regular security audits

## 🚀 Post-Deployment

### Testing Checklist
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Senior profiles can be created/edited
- [ ] AI features respond properly
- [ ] Database operations work
- [ ] Mobile responsiveness
- [ ] Loading states display correctly

### Performance Optimization
- Enable Vercel Edge Functions for better performance
- Optimize images and assets
- Use CDN for static content
- Monitor Core Web Vitals

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Project-Specific Issues
- Check this documentation
- Review `TESTING_CHECKLIST.md`
- Open GitHub issues for bugs

## 🔄 Updates and Maintenance

### Regular Maintenance
- Keep dependencies updated
- Monitor for security vulnerabilities
- Review and update environment variables
- Backup database regularly

### Deployment Updates
```bash
# Standard update process
git add .
git commit -m "Update description"
git push origin main
# Vercel automatically deploys
```

---

**Note**: This deployment guide is specific to MyCareBay. For general Vercel deployment questions, refer to the [official Vercel documentation](https://vercel.com/docs).
