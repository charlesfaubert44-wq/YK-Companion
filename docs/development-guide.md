# Development Guide

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yk-trip-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb yk_trip_planner

   # Create a user (if needed)
   createuser yk_user -P
   ```

4. **Configure environment variables**
   ```bash
   # Copy example files
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env

   # Edit .env files with your configuration
   ```

5. **Run database migrations**
   ```bash
   cd apps/api
   npm run migrate
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## Development Workflow

### Running the Development Servers

**Run all apps:**
```bash
npm run dev
```

**Run individual apps:**
```bash
npm run dev:web      # Web app at http://localhost:3000
npm run dev:api      # API at http://localhost:3001
npm run dev:mobile   # Mobile app with Expo
```

### Project Structure

```
yk-trip-planner/
├── apps/
│   ├── web/                    # Next.js web app
│   │   ├── src/
│   │   │   ├── app/           # Next.js app router pages
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utility functions
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   └── styles/        # CSS files
│   │   └── public/            # Static assets
│   │
│   ├── mobile/                # React Native app
│   │   ├── src/
│   │   │   ├── app/           # Expo Router screens
│   │   │   ├── components/    # React Native components
│   │   │   ├── navigation/    # Navigation config
│   │   │   ├── services/      # API services
│   │   │   └── hooks/         # Custom hooks
│   │   └── assets/            # Images, fonts, etc.
│   │
│   └── api/                   # Express API server
│       ├── src/
│       │   ├── controllers/   # Request handlers
│       │   ├── models/        # Database models
│       │   ├── routes/        # API routes
│       │   ├── middleware/    # Express middleware
│       │   ├── services/      # Business logic
│       │   ├── utils/         # Utility functions
│       │   └── config/        # Configuration
│       └── tests/             # API tests
│
└── packages/
    ├── types/                 # Shared TypeScript types
    ├── shared/                # Shared utilities
    └── ui-components/         # Shared UI components (future)
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

### TypeScript

All code should be written in TypeScript with strict mode enabled.

**Best practices:**
- Always define types/interfaces for function parameters and return values
- Avoid using `any` type
- Use shared types from `@yk-trip-planner/types` package
- Enable strict null checks

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Database Migrations

We use [migration tool TBD] for database migrations.

**Create a new migration:**
```bash
cd apps/api
npm run migrate:create -- add_user_preferences
```

**Run migrations:**
```bash
npm run migrate
```

**Rollback migrations:**
```bash
npm run migrate:rollback
```

## Working with Shared Packages

### Using Shared Types

```typescript
import { Activity, Season, User } from '@yk-trip-planner/types';

function getSeasonalActivities(season: Season): Activity[] {
  // ...
}
```

### Using Shared Utilities

```typescript
import { getCurrentSeason, formatCurrency } from '@yk-trip-planner/shared';

const season = getCurrentSeason();
const price = formatCurrency(150);
```

### Building Shared Packages

After making changes to shared packages, rebuild them:

```bash
cd packages/types
npm run build

cd ../shared
npm run build
```

## API Development

### Creating a New Endpoint

1. **Define the route** in `apps/api/src/routes/`
2. **Create controller** in `apps/api/src/controllers/`
3. **Add business logic** in `apps/api/src/services/`
4. **Write tests** in `apps/api/tests/`

Example:

```typescript
// routes/activities.ts
import { Router } from 'express';
import { getActivities, getActivity } from '../controllers/activities';

const router = Router();

router.get('/', getActivities);
router.get('/:id', getActivity);

export default router;
```

```typescript
// controllers/activities.ts
import { Request, Response } from 'express';
import { ActivityService } from '../services/activity.service';

export async function getActivities(req: Request, res: Response) {
  try {
    const activities = await ActivityService.findAll(req.query);
    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
```

### Authentication Middleware

Protect routes with authentication:

```typescript
import { authenticateToken } from '../middleware/auth';

router.post('/bookings', authenticateToken, createBooking);
```

## Frontend Development

### Creating a New Page (Web)

In Next.js 14 with App Router:

```typescript
// apps/web/src/app/activities/page.tsx
export default function ActivitiesPage() {
  return (
    <div>
      <h1>Activities</h1>
    </div>
  );
}
```

### Creating a New Component

```typescript
// apps/web/src/components/ActivityCard.tsx
import { Activity } from '@yk-trip-planner/types';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  return (
    <div className="card">
      <h3>{activity.name}</h3>
      <p>{activity.description}</p>
    </div>
  );
}
```

### API Calls

Use the API client:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function getActivities() {
  const response = await api.get('/api/v1/activities');
  return response.data;
}
```

## Mobile Development

### Running on Device/Emulator

```bash
# Start Expo
npm run dev:mobile

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Creating a New Screen

```typescript
// apps/mobile/src/app/activities.tsx
import { View, Text } from 'react-native';

export default function ActivitiesScreen() {
  return (
    <View>
      <Text>Activities</Text>
    </View>
  );
}
```

## Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/activity-filters
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add activity filtering functionality"
   ```

   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

3. **Push to remote**
   ```bash
   git push origin feature/activity-filters
   ```

4. **Create Pull Request**

## Debugging

### API Debugging

Use the built-in Node.js debugger or add console logs:

```typescript
console.log('Debug info:', data);
```

### Web Debugging

Use browser DevTools and React Developer Tools.

### Mobile Debugging

Use React Native Debugger or Expo DevTools:

```bash
# Open DevTools
Press 'd' in Expo CLI
```

## Environment Variables

### API (.env)
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/yk_trip_planner
JWT_SECRET=your-secret-key
```

### Web (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your-token
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3002 npm run dev:web
```

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database exists

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
