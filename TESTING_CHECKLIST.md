# MyCareBay Testing Checklist

## Pre-Deployment Testing Steps

### 1. **Database Setup** ✅
- [ ] Run the migration script in Supabase SQL Editor
- [ ] Verify all tables are created (users, seniors, ailments, medications, appointments, contacts)
- [ ] Confirm demo data is inserted correctly

### 2. **Install Dependencies** ✅
```bash
npm install @supabase/supabase-js dotenv
```

### 3. **Environment Setup** ✅
- [ ] Create `env.local` file with Supabase credentials
- [ ] Verify environment variables are loaded correctly

### 4. **Test Supabase Connection** ✅
```bash
npm run test:supabase
```
Expected output:
- ✅ Connection successful
- ✅ Demo user found
- ✅ Demo senior found
- ✅ API endpoints working

### 5. **Test Local Development** ✅
```bash
npm run dev:full
```
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend API runs at http://localhost:3001
- [ ] Can log in with demo@mycarebay.com (password: Demo2024!)
- [ ] Can view Eleanor Vance's profile
- [ ] All CRUD operations work (add, edit, delete seniors)

### 6. **Test Production Build** ✅
```bash
npm run build
npm run preview
```
- [ ] Build completes without errors
- [ ] Preview server works correctly
- [ ] All functionality works in production build

### 7. **Test Vercel Functions Locally** ✅
- [ ] API routes in `/api` directory work correctly
- [ ] All endpoints return proper responses
- [ ] Error handling works as expected

### 8. **Code Quality Check** ✅
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All imports are correct
- [ ] No console errors in browser

### 9. **Security Check** ✅
- [ ] Environment variables are not committed to git
- [ ] API keys are properly secured
- [ ] No sensitive data in code

### 10. **Git Status** ✅
```bash
git status
```
- [ ] Only intended files are staged
- [ ] No sensitive files are included
- [ ] Ready to commit and push

## Testing Commands

### Quick Test Suite
```bash
# 1. Test Supabase connection
npm run test:supabase

# 2. Test local development
npm run dev:full

# 3. Test production build
npm run build && npm run preview
```

### Manual Testing Checklist
- [ ] **Authentication**: Login with demo credentials
- [ ] **Dashboard**: View senior cards
- [ ] **Senior Profile**: View Eleanor Vance's complete profile
- [ ] **Add Senior**: Create a new senior profile
- [ ] **Edit Senior**: Modify existing senior information
- [ ] **Delete Senior**: Remove a senior profile
- [ ] **Care Advisor**: Test AI features (if Gemini API is configured)
- [ ] **Responsive Design**: Test on mobile and desktop

## Common Issues & Solutions

### Issue: Supabase Connection Failed
**Solution**: 
- Check `env.local` file exists
- Verify Supabase URL and key are correct
- Ensure migration script was run

### Issue: API Endpoints Not Working
**Solution**:
- Check if Express server is running
- Verify API routes are correct
- Check browser console for CORS errors

### Issue: Build Errors
**Solution**:
- Run `npm install` to ensure all dependencies
- Check TypeScript compilation
- Verify all imports are correct

### Issue: Environment Variables Not Loading
**Solution**:
- Ensure `env.local` file is in root directory
- Check variable names match exactly
- Restart development server

## Ready for Deployment Checklist

- [ ] All tests pass locally
- [ ] Supabase database is set up and working
- [ ] Environment variables are configured
- [ ] Code is committed to git
- [ ] No sensitive data in repository
- [ ] Production build works correctly

## Next Steps After Testing

1. **Commit and Push to GitHub**
```bash
git add .
git commit -m "Add Supabase integration and Vercel deployment setup"
git push origin main
```

2. **Deploy to Vercel**
- Connect repository to Vercel
- Add environment variables in Vercel dashboard
- Deploy and test live application

3. **Post-Deployment Verification**
- Test all features on live site
- Verify environment variables are working
- Check Vercel function logs for any errors

---

**Note**: Run through this checklist before every deployment to ensure a smooth release process.
