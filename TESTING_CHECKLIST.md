# Testing Checklist - MyCareBay

Comprehensive testing procedures to ensure reliability and functionality.

## Pre-Testing Setup

### Environment Verification
```bash
# Test environment variables
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY  
echo $GEMINI_API_KEY

# Test database connection
npm run test:supabase
```

### Development Servers
```bash
# Start both servers
npm run dev:full

# Verify endpoints
curl http://localhost:3001/api/health  # Should return {"status": "OK"}
```

## API Endpoint Testing

### Health Checks
- [ ] `GET /api/health` returns status OK
- [ ] `GET /api/test` returns test message with timestamp

### Authentication
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

**Test Cases:**
- [ ] Valid credentials return success
- [ ] Invalid credentials return error
- [ ] Missing fields return validation error

### Seniors Management
```bash
# Get seniors by user
curl "http://localhost:3001/api/seniors/user?userId=USER_ID"

# Create senior
curl -X POST http://localhost:3001/api/seniors \
  -H "Content-Type: application/json" \
  -d '{"user_id": "USER_ID", "name": "Test Senior", "age": 75}'

# Delete senior (both methods)
curl -X DELETE "http://localhost:3001/api/seniors/delete?seniorId=SENIOR_ID"
curl -X DELETE "http://localhost:3001/api/seniors/SENIOR_ID"
```

**Verification:**
- [ ] CRUD operations work correctly
- [ ] Error handling for invalid data
- [ ] UUID validation functions properly

## Frontend Testing

### Dashboard Component
- [ ] Loads without console errors
- [ ] Loading states display during data fetch
- [ ] Error states show for failed requests
- [ ] Empty state displays when no seniors exist
- [ ] Senior cards display all information correctly

### Forms and Modals
- [ ] Add/Edit senior modal opens and closes correctly
- [ ] Form validation enforces required fields
- [ ] Age validation (positive numbers only)
- [ ] Array fields (ailments, medications) function properly
- [ ] Form submission works with valid data
- [ ] Error messages display for invalid data

### Senior Profile
- [ ] All information displays correctly
- [ ] Missing/null fields handled gracefully
- [ ] Edit and delete buttons function
- [ ] Care advisor section loads
- [ ] Facility checklist generation works

## AI Features Testing

### Care Advisor
- [ ] Question input accepts user text
- [ ] Submit button triggers AI request
- [ ] Loading state shows during request
- [ ] AI response displays as formatted markdown
- [ ] Empty questions show validation error
- [ ] API errors display user-friendly messages
- [ ] Missing API key shows appropriate fallback

### Facility Checklist
- [ ] Generates checklist for senior profile
- [ ] Loading state displays during generation
- [ ] Generated content is relevant to senior's needs
- [ ] Markdown formatting renders correctly
- [ ] Error handling for API failures

## Database Testing

### CRUD Operations
```sql
-- Test in Supabase SQL editor
INSERT INTO seniors (user_id, name, age, ailments)
VALUES ('test-user-id', 'Test Senior', 75, ARRAY['arthritis']);

SELECT * FROM seniors WHERE user_id = 'test-user-id';

UPDATE seniors SET age = 76 WHERE id = 'senior-id';

DELETE FROM seniors WHERE id = 'senior-id';
```

**Verify:**
- [ ] Insert operations work with valid data
- [ ] Foreign key constraints enforced
- [ ] Default values applied correctly
- [ ] Query filters and ordering function
- [ ] Update operations apply correctly
- [ ] Delete operations work with cascade rules

### Data Integrity
- [ ] Primary key uniqueness enforced
- [ ] Foreign key relationships maintained
- [ ] Check constraints validated (e.g., age > 0)
- [ ] Array fields store and retrieve correctly
- [ ] JSON fields handle complex data

## Authentication Testing

### User Flow
- [ ] User registration with email/password
- [ ] Login with correct credentials
- [ ] Invalid credentials show appropriate errors
- [ ] Session persists across page refreshes
- [ ] Logout clears session properly
- [ ] Protected routes redirect to login

### Authorization
- [ ] Users can only see their own seniors
- [ ] API endpoints verify user ownership
- [ ] Unauthorized requests return 401/403
- [ ] JWT tokens validated correctly

## Production Deployment Testing

### Vercel Functions
Test each endpoint on production URL:
- [ ] `GET /api/health`
- [ ] `POST /api/auth/login`
- [ ] `GET /api/seniors/user`
- [ ] `POST /api/seniors`
- [ ] `DELETE /api/seniors/delete`

### Environment Parity
- [ ] Production matches local behavior
- [ ] API responses identical between environments
- [ ] Database operations work consistently
- [ ] AI features function correctly

## Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome**: All functionality works, no console errors
- [ ] **Firefox**: Feature parity with Chrome, CSS renders correctly
- [ ] **Safari**: Webkit compatibility, date inputs function
- [ ] **Edge**: No Edge-specific bugs, performance acceptable

### Mobile Testing
- [ ] **iOS Safari**: iPhone/iPad compatibility, touch interactions
- [ ] **Chrome Mobile**: Android compatibility, gesture support
- [ ] **Responsive Design**: Works across screen sizes

## Performance Testing

### Frontend Metrics
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1

### Backend Performance
```bash
# Test API response times
curl -w "@curl-format.txt" -s -o /dev/null http://localhost:3001/api/health
```
- [ ] Health endpoint < 100ms
- [ ] CRUD operations < 500ms
- [ ] AI features < 10s (timeout handling)

### Build Analysis
```bash
npm run build
npx vite-bundle-analyzer dist
```
- [ ] Bundle size acceptable
- [ ] No duplicate dependencies
- [ ] Code splitting effective

## Security Testing

### Input Validation
- [ ] User input properly escaped
- [ ] SQL injection prevented through parameterized queries
- [ ] XSS protection via React's built-in escaping
- [ ] Special characters handled safely

### Authentication Security
- [ ] JWT tokens properly signed and validated
- [ ] Tokens expire appropriately
- [ ] User can only access own data
- [ ] API endpoints verify ownership

### Environment Security
- [ ] No hardcoded API keys in repository
- [ ] Production secrets different from development
- [ ] API keys have minimal required permissions

## Automated Testing

### Unit Tests (when implemented)
```bash
npm test
```
- [ ] Components render without errors
- [ ] Props passed correctly
- [ ] Event handlers function
- [ ] State updates properly

### Integration Tests
```bash
npm run test:integration
```
- [ ] Full CRUD workflows
- [ ] Authentication flows
- [ ] Error scenarios handled
- [ ] Data persistence verified

## Release Testing Checklist

### Before Deployment
- [ ] All manual tests passed
- [ ] API endpoints verified locally and staging
- [ ] Frontend components tested across browsers
- [ ] AI features functioning correctly
- [ ] Database operations verified
- [ ] Performance benchmarks met

### Post-Deployment Verification
- [ ] Health check passes in production
- [ ] Critical user flows work
- [ ] No 500 errors in logs
- [ ] Database connections stable
- [ ] Performance metrics normal

### Emergency Response
If issues are reported:
1. [ ] Reproduce issue locally
2. [ ] Check production logs
3. [ ] Verify recent deployment status
4. [ ] Test rollback if necessary
5. [ ] Document root cause and resolution

---

Regular testing ensures MyCareBay remains reliable and provides excellent user experience.
