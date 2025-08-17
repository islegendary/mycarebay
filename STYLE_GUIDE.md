# Style Guide - MyCareBay

Essential coding standards and conventions for consistent, maintainable code.

## TypeScript Standards

### Type Definitions

```typescript
// ✅ Good - Explicit interfaces in types.ts
interface Senior {
  id: string;
  name: string;
  age: number | null;
  ailments: string[];
}

// ❌ Avoid 'any' types
const data: any = getData(); // Bad
```

### Function Signatures

```typescript
// ✅ Always include parameter and return types
async function getCareAdvice(
  seniorProfile: Senior,
  question: string
): Promise<string> {
  // Implementation
}
```

## React Component Standards

### Component Structure
```typescript
import React, { useState } from 'react';
import { Senior } from '../types';

interface SeniorCardProps {
  senior: Senior;
  onEdit: (senior: Senior) => void;
  onDelete: (id: string) => void;
}

export const SeniorCard: React.FC<SeniorCardProps> = ({
  senior,
  onEdit,
  onDelete,
}) => {
  const [loading, setLoading] = useState(false);

  const handleEdit = () => onEdit(senior);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Component content */}
    </div>
  );
};
```

### Event Handlers
```typescript
// ✅ Properly typed events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle submission
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setData(prev => ({ ...prev, [name]: value }));
};
```

## Styling with Tailwind

### Responsive Design
```tsx
// ✅ Mobile-first approach
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3
">
```

### Color Consistency
- **Primary**: `blue-600`, `blue-700`
- **Secondary**: `gray-200`, `gray-800`
- **Success**: `green-600`
- **Error**: `red-600`

### Button Patterns
```tsx
// Primary button
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
  Primary Action
</button>

// Secondary button  
<button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
  Secondary Action
</button>
```

## File Organization

### Directory Structure
```
src/
├── components/     # UI components
├── services/       # API services  
├── utils/         # Helper functions
├── types.ts       # Type definitions
└── constants.ts   # App constants
```

### Import Order
```typescript
// React imports
import React, { useState } from 'react';

// Third-party libraries
import { format } from 'date-fns';

// Internal services
import { getCareAdvice } from '../services/geminiService';

// Internal components
import { SeniorCard } from './SeniorCard';

// Types and utils
import { Senior } from '../types';
```

## API Design

### Service Structure
```typescript
class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export const apiService = {
  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message, response.status);
    }

    return response.json();
  },
};
```

### Error Handling
```typescript
// ✅ Consistent error handling
try {
  const result = await apiService.getSeniors();
  setSeniors(result);
} catch (error) {
  const message = error instanceof ApiError 
    ? error.message 
    : 'An unexpected error occurred';
  setError(message);
}
```

## Database Conventions

### Table Structure
```sql
CREATE TABLE seniors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER CHECK (age > 0 AND age < 150),
  ailments TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Query Patterns
```typescript
export async function getSeniorsByUser(userId: string): Promise<Senior[]> {
  const { data, error } = await supabase
    .from('seniors')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch seniors: ${error.message}`);
  return data || [];
}
```

## Performance Guidelines

### React Optimization
```typescript
// ✅ Memoize expensive calculations
const sortedSeniors = useMemo(() => 
  seniors.sort((a, b) => a.name.localeCompare(b.name)), 
  [seniors]
);

// ✅ Memoize callbacks
const handleUpdate = useCallback((senior: Senior) => {
  setSeniors(prev => prev.map(s => s.id === senior.id ? senior : s));
}, []);
```

## Security Best Practices

### Input Validation
```typescript
const validateSeniorData = (data: Partial<Senior>): string[] => {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (data.age && (data.age < 1 || data.age > 150)) {
    errors.push('Age must be between 1 and 150');
  }
  
  return errors;
};
```

### Environment Variables
```typescript
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'GEMINI_API_KEY'];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Code Review Checklist

### Before Submitting
- [ ] TypeScript errors resolved
- [ ] Component props typed
- [ ] Error handling implemented
- [ ] Responsive design tested
- [ ] Loading states included

### Review Criteria
- [ ] Code follows established patterns
- [ ] Performance considerations addressed
- [ ] Security best practices followed
- [ ] Documentation updated if needed

---

Follow these standards for all contributions to maintain code quality and consistency.
