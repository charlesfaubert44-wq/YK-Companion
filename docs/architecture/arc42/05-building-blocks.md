# 5. Building Block View

> System decomposition into building blocks (packages, components, subsystems)

**Last Updated:** January 2025

---

## 5.1 Whitebox Overall System

### System Overview

YK Buddy is a **serverless monolith** deployed as a single Next.js application with API routes.

```
┌─────────────────────────────────────────────────┐
│              YK Buddy Platform                  │
│                                                 │
│  ┌──────────┐  ┌─────────┐  ┌──────────────┐  │
│  │   Web    │  │   API   │  │   Contexts   │  │
│  │   App    │←→│ Routes  │←→│  & State     │  │
│  │ (Next.js)│  │         │  │              │  │
│  └──────────┘  └─────────┘  └──────────────┘  │
│        ↓             ↓              ↓           │
│  ┌──────────────────────────────────────────┐  │
│  │      Shared Packages (types, utils)      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
         ↓              ↓              ↓
    Supabase        Mapbox       localStorage
  (DB + Auth)        (Maps)        (Client)
```

### Contained Building Blocks

| Building Block | Purpose | See |
|---------------|---------|-----|
| **Web App** | User interface, pages, components | [5.2](#52-web-application) |
| **API Routes** | Business logic, data operations | [5.3](#53-api-routes) |
| **Contexts & State** | Global state management | [5.4](#54-contexts-and-state-management) |
| **Shared Packages** | Reusable utilities and types | [5.5](#55-shared-packages) |
| **External Services** | Third-party dependencies | [5.6](#56-external-services) |

---

## 5.2 Web Application

**Purpose:** User interface and client-side logic

### Structure

```
apps/web/src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── visiting/           # Visiting segment
│   ├── living/             # Living segment
│   ├── moving/             # Moving segment
│   ├── admin/              # Admin dashboard
│   ├── knowledge/          # Knowledge base
│   └── api/                # API routes (see 5.3)
├── components/             # UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── EnhancedPathwayCards.tsx
│   ├── GarageSaleMap.tsx
│   └── ...
├── contexts/               # React contexts
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── SloganContext.tsx
└── lib/                    # Utilities
    ├── supabase/
    ├── api-helpers.ts
    └── ...
```

### Responsibilities

- **Rendering:** Server and client components
- **Routing:** File-based routing with App Router
- **UI:** Reusable components with Tailwind CSS
- **Client State:** React Context, Zustand
- **Data Fetching:** TanStack Query for server state

### Key Components

#### Layout Components
- `layout.tsx` - Root layout with providers
- `Header.tsx` - Navigation bar
- `Footer.tsx` - Site footer
- `Sidebar.tsx` - Admin sidebar

#### Feature Components
- `EnhancedPathwayCards.tsx` - Homepage segment cards
- `GarageSaleMap.tsx` - Interactive Mapbox map
- `PremiumSpotlight.tsx` - Sponsor placements
- `LanguageSelector.tsx` - Language switcher

#### Form Components
- `Input.tsx`, `Select.tsx`, `DatePicker.tsx`
- Form field wrappers with validation

### Interfaces

**From Web App:**
- → API Routes (HTTP/JSON)
- → Contexts (React Context API)
- → Shared Packages (ES imports)

**To Web App:**
- ← API Routes (JSON responses)
- ← Contexts (state updates)
- ← External Services (Mapbox, localStorage)

---

## 5.3 API Routes

**Purpose:** Business logic and data operations

### Structure

```
apps/web/src/app/api/
├── admin/
│   └── users/
│       ├── route.ts              # GET/POST /api/admin/users
│       └── permissions/
│           └── route.ts          # POST /api/admin/users/permissions
├── knowledge/
│   ├── route.ts                  # GET /api/knowledge
│   ├── [id]/
│   │   └── route.ts              # GET /api/knowledge/[id]
│   ├── categories/
│   │   └── route.ts              # GET /api/knowledge/categories
│   └── admin/
│       ├── review/
│       │   └── route.ts          # POST /api/knowledge/admin/review
│       └── stats/
│           └── route.ts          # GET /api/knowledge/admin/stats
└── auth/
    └── callback/
        └── route.ts              # GET /api/auth/callback
```

### Responsibilities

- **Authentication:** Verify JWT tokens
- **Authorization:** Check user permissions
- **Business Logic:** Implement domain logic
- **Data Validation:** Validate input with Zod
- **Database Operations:** Query Supabase
- **Error Handling:** Return appropriate errors

### Key Endpoints

#### Admin APIs
- `POST /api/admin/users` - Create/update users
- `POST /api/admin/users/permissions` - Grant permissions
- `GET /api/admin/users` - List users

#### Knowledge Base APIs
- `GET /api/knowledge` - List articles
- `GET /api/knowledge/[id]` - Get article details
- `GET /api/knowledge/categories` - List categories
- `POST /api/knowledge/admin/review` - Moderate articles
- `GET /api/knowledge/admin/stats` - Admin statistics

#### Authentication APIs
- `GET /api/auth/callback` - OAuth callback handler

### Pattern

```typescript
// Standard API route pattern
export async function GET(request: NextRequest) {
  try {
    // 1. Check authentication
    const adminCheck = await requirePermission('can_view_analytics');
    if (adminCheck instanceof NextResponse) return adminCheck;

    // 2. Parse/validate request
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // 3. Execute business logic
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('table')
      .select('*')
      .eq('id', id)
      .single();

    // 4. Handle errors
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5. Return response
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Interfaces

**To API Routes:**
- ← Web App (HTTP requests)
- ← External clients (future API)

**From API Routes:**
- → Supabase (PostgreSQL queries)
- → Admin Activity Log
- → Web App (JSON responses)

---

## 5.4 Contexts and State Management

**Purpose:** Global application state

### Structure

```
apps/web/src/contexts/
├── AuthContext.tsx          # Authentication state
├── LanguageContext.tsx      # i18n state
└── SloganContext.tsx        # Random slogan rotation
```

### AuthContext

**Responsibilities:**
- Manage authentication state
- Provide user object
- Check admin permissions
- Handle login/logout

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  permissions: UserPermissions | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### LanguageContext

**Responsibilities:**
- Store current language
- Provide translation function
- Persist to localStorage

```typescript
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}
```

### State Management

**Client State:** Zustand stores
```typescript
// Garage sale selection and routing
const useGarageSaleStore = create<GarageSaleState>((set) => ({
  selectedSales: [],
  route: null,
  addSale: (sale) => set((state) => ({
    selectedSales: [...state.selectedSales, sale]
  })),
  // ...
}));
```

**Server State:** TanStack Query
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['garage-sales'],
  queryFn: () => api.garageSales.list(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 5.5 Shared Packages

**Purpose:** Reusable code across packages

### Structure

```
packages/
├── types/                   # TypeScript definitions
│   └── src/
│       ├── user.ts
│       ├── garage-sale.ts
│       ├── sponsor.ts
│       └── index.ts
└── shared/                  # Utility functions
    └── src/
        ├── datetime.ts
        ├── validation.ts
        ├── arrays.ts
        ├── urls.ts
        └── index.ts
```

### packages/types

**Purpose:** Shared TypeScript interfaces and types

**Exports:**
```typescript
// User types
export interface User { ... }
export interface UserPermissions { ... }

// Garage sale types
export interface GarageSale { ... }
export interface GarageSaleFilters { ... }

// Sponsor types
export interface Sponsor { ... }
export interface PricingPlan { ... }

// Knowledge base types
export interface KnowledgeArticle { ... }
export interface Category { ... }
```

### packages/shared

**Purpose:** Utility functions and helpers

**Key Modules:**
- `datetime.ts` - Date formatting, validation
- `validation.ts` - Zod schemas, validators
- `arrays.ts` - Array utilities
- `urls.ts` - URL helpers
- `forms.ts` - Form utilities
- `query-params.ts` - Query string parsing

**Example:**
```typescript
// datetime.ts
export function formatDate(date: Date | null): string {
  if (!date) return '';
  return format(date, 'MMMM d, yyyy');
}

export function isValidDate(dateString: string): boolean {
  return isValid(parseISO(dateString));
}
```

---

## 5.6 External Services

**Purpose:** Third-party dependencies

### Supabase

**Services Used:**
- **Database:** PostgreSQL with PostGIS
- **Authentication:** JWT-based auth service
- **Storage:** File uploads (future)

**Tables:**
- `profiles` - User profiles
- `garage_sales` - Sale listings
- `premium_sponsors` - Sponsor placements
- `knowledge_base` - Articles
- `user_permissions` - Admin permissions
- `admin_activity_log` - Audit trail
- `site_settings` - Configuration

**Interface:**
```typescript
// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Query example
const { data, error } = await supabase
  .from('garage_sales')
  .select('*')
  .eq('approval_status', 'approved');
```

### Mapbox

**Services Used:**
- **Maps:** Mapbox GL JS for interactive maps
- **Geocoding:** Address → coordinates
- **Directions:** Route calculation (future)

**Interface:**
```typescript
import Map from 'react-map-gl';

<Map
  mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
  initialViewState={{
    longitude: -114.3718,
    latitude: 62.4540,
    zoom: 12
  }}
/>
```

### Vercel

**Services Used:**
- **Hosting:** Edge network, serverless functions
- **Build:** CI/CD from GitHub
- **Analytics:** Core Web Vitals tracking

---

## 5.7 Cross-Cutting Concerns

### Authentication Flow

```
1. User submits credentials
   ↓
2. Web App → API Route: POST /api/auth/login
   ↓
3. API Route → Supabase Auth: validate
   ↓
4. Supabase Auth → Database: check credentials
   ↓
5. Return JWT tokens → API Route → Web App
   ↓
6. AuthContext updates state
   ↓
7. Protected routes now accessible
```

### Data Flow: Garage Sale Creation

```
1. User fills form in Web App
   ↓
2. Web App → Mapbox: geocode address
   ↓
3. Mapbox → Web App: return lat/lng
   ↓
4. Web App → API Route: POST /api/garage-sales
   ↓
5. API Route validates auth & input
   ↓
6. API Route → Supabase: INSERT
   ↓
7. Supabase RLS: check policy
   ↓
8. Return success → API Route → Web App
   ↓
9. TanStack Query: invalidate cache
   ↓
10. UI updates with new sale
```

---

## 5.8 Deployment View

### Package Deployment

```
GitHub Repository
       ↓
   git push (main branch)
       ↓
   Vercel Webhook
       ↓
┌──────────────────┐
│  Vercel Builder  │
│                  │
│ 1. npm install   │
│ 2. Build packages│
│ 3. Build web app │
│ 4. Optimize      │
└────────┬─────────┘
         ↓
┌──────────────────┐
│   Vercel Edge    │
│   (70+ regions)  │
│                  │
│ • Static Assets  │
│ • SSR Functions  │
│ • API Routes     │
└──────────────────┘
```

---

## References

- **[← Solution Strategy](./04-solution-strategy.md)**
- **[C4 Component Diagram](../c4-model/03-component-diagram.md)**
- **[Architecture Decision Records](../adr/README.md)**

---

**Last Updated:** 2025-01-27
**Maintained By:** Development Team
**Review Cycle:** Monthly or when architecture changes
