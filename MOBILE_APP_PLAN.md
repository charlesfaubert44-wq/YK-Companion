# YK Buddy Mobile App - Development Plan

**Project:** YK Buddy (YK Companion) iOS & Android Apps
**Target:** Apple App Store & Google Play Store
**Framework:** Expo + React Native
**Current Status:** Scaffold exists, needs full implementation
**Last Updated:** October 2025

---

## Executive Summary

Transform the existing YK Buddy web platform into native mobile apps for iOS and Android, leveraging the existing Expo scaffold and monorepo structure. The mobile apps will provide the same core features as the web platform with mobile-optimized UX and native capabilities.

**Key Advantages:**
- ✅ Expo scaffold already in place
- ✅ Shared Supabase backend
- ✅ Monorepo structure ready
- ✅ All business logic exists in web app
- ✅ Can deploy to both App Store and Google Play simultaneously

---

## 1. Technical Architecture

### Current Technology Stack

```
┌─────────────────────────────────────────────────────────┐
│                    MONOREPO ROOT                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │  apps/web   │  │ apps/mobile │  │  packages/   │    │
│  │  Next.js 14 │  │   Expo 50   │  │   - types    │    │
│  │  (existing) │  │  (scaffold) │  │   - shared   │    │
│  │             │  │             │  │   - ui       │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘    │
│         │                │                 │            │
│         └────────────────┴─────────────────┘            │
│                          │                              │
│                    ┌─────▼──────┐                       │
│                    │  Supabase  │                       │
│                    │ PostgreSQL │                       │
│                    │    Auth    │                       │
│                    │   Storage  │                       │
│                    └────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

### Mobile App Stack

**Framework:** Expo 50 (React Native)
- **Expo Router** - File-based navigation
- **Expo Location** - GPS & location services
- **Expo Notifications** - Push notifications (aurora alerts)
- **Expo Updates** - OTA updates without app store approval
- **EAS Build** - Cloud-based native builds

**Core Libraries:**
- `@supabase/supabase-js` - Backend integration
- `react-native-maps` - Interactive maps (garage sales)
- `@tanstack/react-query` - Data fetching/caching
- `zustand` - State management
- `date-fns` - Date manipulation
- `axios` - HTTP client

**Development:**
- TypeScript
- Jest - Testing
- ESLint - Linting
- Expo Dev Client - Custom development builds

---

## 2. Monorepo Structure

### Recommended Directory Structure

```
YK-Companion/
├── apps/
│   ├── web/                          # Existing Next.js app
│   │   ├── src/
│   │   └── package.json
│   │
│   └── mobile/                       # Mobile app (EXPAND THIS)
│       ├── src/
│       │   ├── app/                  # Expo Router screens
│       │   │   ├── (tabs)/          # Tab navigation
│       │   │   │   ├── index.tsx    # Home
│       │   │   │   ├── visiting.tsx # Visiting pathway
│       │   │   │   ├── living.tsx   # Living pathway
│       │   │   │   ├── moving.tsx   # Moving pathway
│       │   │   │   └── profile.tsx  # User profile
│       │   │   ├── (auth)/          # Auth screens
│       │   │   │   ├── login.tsx
│       │   │   │   └── signup.tsx
│       │   │   ├── garage-sales/    # Garage sale screens
│       │   │   │   ├── index.tsx    # List view
│       │   │   │   ├── map.tsx      # Map view
│       │   │   │   └── [id].tsx     # Detail view
│       │   │   ├── aurora/          # Aurora screens
│       │   │   │   ├── forecast.tsx
│       │   │   │   └── alerts.tsx
│       │   │   ├── calculator/      # Cost of living
│       │   │   │   └── index.tsx
│       │   │   ├── _layout.tsx      # Root layout
│       │   │   └── index.tsx        # Entry point
│       │   │
│       │   ├── components/          # React Native components
│       │   │   ├── ui/              # Shared UI components
│       │   │   │   ├── Button.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Input.tsx
│       │   │   │   └── AuroraBackground.tsx
│       │   │   ├── pathway/         # Pathway cards
│       │   │   ├── garage-sales/    # GS components
│       │   │   ├── sponsors/        # Premium spotlight
│       │   │   └── weather/         # Weather widget
│       │   │
│       │   ├── hooks/               # Custom hooks
│       │   │   ├── useAuth.ts
│       │   │   ├── useLocation.ts
│       │   │   ├── useGarageSales.ts
│       │   │   └── useLanguage.ts
│       │   │
│       │   ├── lib/                 # Libraries & utilities
│       │   │   ├── supabase.ts      # Supabase client
│       │   │   ├── notifications.ts # Push notifications
│       │   │   └── storage.ts       # AsyncStorage wrapper
│       │   │
│       │   ├── contexts/            # React contexts
│       │   │   ├── AuthContext.tsx
│       │   │   └── LanguageContext.tsx
│       │   │
│       │   ├── services/            # API services
│       │   │   ├── aurora.ts
│       │   │   ├── garageSales.ts
│       │   │   └── sponsors.ts
│       │   │
│       │   ├── types/               # TypeScript types
│       │   ├── constants/           # Constants
│       │   ├── utils/               # Utilities
│       │   └── theme/               # Theme config
│       │       ├── colors.ts
│       │       ├── spacing.ts
│       │       └── typography.ts
│       │
│       ├── assets/                  # Images, fonts, etc.
│       │   ├── images/
│       │   ├── icons/
│       │   └── fonts/
│       │
│       ├── app.json                 # Expo config
│       ├── eas.json                 # EAS Build config
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── types/                       # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── database.ts         # Supabase types
│   │   │   ├── api.ts              # API types
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── shared/                      # Shared business logic
│   │   ├── src/
│   │   │   ├── utils/              # Pure functions
│   │   │   ├── validation/         # Zod schemas
│   │   │   ├── constants/          # Shared constants
│   │   │   └── i18n/               # Translation strings
│   │   │       ├── en.json
│   │   │       ├── fr.json
│   │   │       ├── zh.json
│   │   │       └── [8 more langs]
│   │   └── package.json
│   │
│   └── ui/                          # Shared UI (optional)
│       ├── src/
│       │   ├── hooks/
│       │   └── utils/
│       └── package.json
│
└── supabase/                        # Database migrations
    └── migrations/
```

---

## 3. Feature Mapping: Web → Mobile

### Core Features Adaptation

| Web Feature | Mobile Implementation | Native Enhancement | Priority |
|------------|----------------------|-------------------|----------|
| **Multilingual (9 langs)** | Same using shared i18n package | System language detection | P0 |
| **Premium Spotlight** | Native component with animations | - | P0 |
| **Three Pathways** | Tab navigation | - | P0 |
| **Garage Sale Map** | React Native Maps | GPS location, directions | P1 |
| **Cost Calculator** | Same logic, mobile UI | - | P1 |
| **User Auth** | Supabase Auth | Biometric login (FaceID/Touch) | P0 |
| **Weather Widget** | Native component | - | P2 |
| **Aurora Info** | Dedicated screen | Push notifications | P1 |
| **Admin Dashboard** | Web-only (admin use case) | - | P3 |

### Mobile-Specific Features

**New features that make sense only on mobile:**

1. **Push Notifications**
   - Aurora alerts (high KP index)
   - New garage sales nearby
   - Premium sponsor offers

2. **Offline Mode**
   - Cache garage sale data
   - Offline maps
   - Saved favorites

3. **Native Camera Integration**
   - Share aurora photos
   - Upload to community feed

4. **GPS & Location Services**
   - "Near me" garage sales
   - Distance calculations
   - Turn-by-turn directions

5. **Share Sheet Integration**
   - Share events with friends
   - Export itineraries

6. **App Shortcuts**
   - Quick actions (3D Touch/Long press)
   - Widget support (future)

---

## 4. Shared Code Strategy

### What to Share Between Web & Mobile

#### ✅ Should Share (Create in `packages/`)

**1. TypeScript Types** (`packages/types`)
```typescript
// Database types from Supabase
export interface GarageSale {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  start_date: string;
  end_date: string;
}

export interface PremiumSponsor {
  id: string;
  name: string;
  tagline: string;
  link: string;
  position: 'home_top' | 'visiting' | 'living' | 'moving';
}
```

**2. Business Logic** (`packages/shared`)
```typescript
// Pure functions, no platform-specific code
export const calculateRouteDistance = (sales: GarageSale[]) => {...}
export const calculateSpotlightPrice = (days: number, position: string) => {...}
export const validateEmail = (email: string) => {...}
```

**3. Translations** (`packages/shared/i18n`)
```json
// en.json
{
  "home": {
    "title": "Welcome to YK Buddy",
    "slogan": "Because Nobody Should Face -40° Alone"
  },
  "visiting": {...},
  "living": {...}
}
```

**4. Constants & Configuration**
```typescript
export const AURORA_COLORS = {
  green: '#10B981',
  blue: '#3B82F6',
  purple: '#8B5CF6',
};

export const PRICING_MULTIPLIERS = {
  home_top: 1.5,
  visiting: 1.2,
  living: 1.0,
};
```

**5. Validation Schemas** (Zod)
```typescript
export const garageSaleSchema = z.object({
  title: z.string().min(3),
  address: z.string().min(5),
  // ...
});
```

#### ❌ Should NOT Share (Platform-Specific)

**Web-Only:**
- Next.js routing
- SSR/SSG logic
- Tailwind CSS classes
- DOM manipulation
- Admin dashboard

**Mobile-Only:**
- React Native components
- Native modules (camera, GPS)
- Push notification handlers
- AsyncStorage
- Expo-specific code

---

## 5. Development Roadmap

### Phase 0: Foundation (Week 1-2)

**Goal:** Set up shared packages and core infrastructure

- [ ] Create `packages/types` with all TypeScript types
- [ ] Create `packages/shared` with business logic
- [ ] Extract translations to `packages/shared/i18n`
- [ ] Set up Supabase client for React Native
- [ ] Configure Expo environment variables
- [ ] Set up AsyncStorage for offline data

**Deliverable:** Shared code compiling, mobile app connects to Supabase

---

### Phase 1: Core App (Week 3-6)

**Goal:** Basic app with authentication and pathways

#### Week 3: Authentication
- [ ] Login screen
- [ ] Signup screen
- [ ] Password reset
- [ ] Auth context/provider
- [ ] Protected routes
- [ ] User profile screen

#### Week 4: Navigation & Home
- [ ] Tab navigation setup
- [ ] Home screen with pathways
- [ ] Language selector
- [ ] Premium Spotlight component (mobile version)
- [ ] Northern-themed styling

#### Week 5: Pathway Screens
- [ ] Visiting pathway screen
- [ ] Living pathway screen
- [ ] Moving pathway screen
- [ ] Weather widget
- [ ] About screen

#### Week 6: Testing & Polish
- [ ] Error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Basic testing

**Deliverable:** Working app with auth and basic navigation

---

### Phase 2: Key Features (Week 7-10)

**Goal:** Implement signature features

#### Week 7-8: Garage Sale Planner
- [ ] List view of garage sales
- [ ] Map view with React Native Maps
- [ ] Detail view
- [ ] GPS location integration
- [ ] "Near me" filter
- [ ] Save favorites
- [ ] Calendar view
- [ ] Route optimization

#### Week 9: Cost of Living Calculator
- [ ] Calculator screen
- [ ] Form inputs (React Native components)
- [ ] Results display
- [ ] Save calculations
- [ ] Share functionality

#### Week 10: Aurora Features
- [ ] Aurora forecast screen
- [ ] KP index display
- [ ] Viewing tips
- [ ] Setup push notification infrastructure

**Deliverable:** Core features working, ready for alpha testing

---

### Phase 3: Mobile Enhancements (Week 11-13)

**Goal:** Leverage mobile-native capabilities

#### Week 11: Notifications
- [ ] Push notification setup (Expo Notifications)
- [ ] Aurora alert notifications
- [ ] Garage sale alerts
- [ ] Notification preferences

#### Week 12: Offline & Performance
- [ ] Offline data caching (React Query)
- [ ] AsyncStorage for favorites
- [ ] Image optimization
- [ ] Performance profiling
- [ ] Reduce bundle size

#### Week 13: Native Features
- [ ] Share sheet integration
- [ ] Camera integration (optional)
- [ ] Biometric authentication
- [ ] App shortcuts
- [ ] Splash screen & icon polish

**Deliverable:** Full-featured mobile app ready for beta

---

### Phase 4: Testing & Store Prep (Week 14-16)

**Goal:** Prepare for App Store & Play Store submission

#### Week 14: Testing
- [ ] Internal testing (TestFlight/Internal Testing)
- [ ] Bug fixes
- [ ] UX improvements
- [ ] Performance optimization
- [ ] Accessibility (VoiceOver/TalkBack)

#### Week 15: Store Assets
- [ ] App screenshots (all required sizes)
- [ ] App preview videos
- [ ] App Store description (9 languages)
- [ ] Privacy policy
- [ ] Terms of service
- [ ] App icon (all sizes)
- [ ] Promotional materials

#### Week 16: Submission
- [ ] iOS App Store submission
- [ ] Google Play Store submission
- [ ] App Store Optimization (ASO)
- [ ] Beta testing program
- [ ] Feedback collection

**Deliverable:** Apps submitted to stores

---

### Phase 5: Launch & Iterate (Week 17+)

**Goal:** Launch and improve based on feedback

- [ ] Monitor store approval
- [ ] Respond to review feedback
- [ ] Public launch
- [ ] Marketing push
- [ ] Collect user feedback
- [ ] Analytics integration
- [ ] Iterate based on data

---

## 6. Technical Implementation Details

### 6.1 Supabase Integration

**Create Mobile Supabase Client:**

```typescript
// apps/mobile/src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Environment Variables:**
```bash
# apps/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

### 6.2 Navigation Structure

**Expo Router File-Based Navigation:**

```
app/
├── (tabs)/                    # Tab navigator
│   ├── _layout.tsx           # Tab configuration
│   ├── index.tsx             # Home (/)
│   ├── visiting.tsx          # Visiting pathway
│   ├── living.tsx            # Living pathway
│   ├── moving.tsx            # Moving pathway
│   └── profile.tsx           # Profile
├── (auth)/                   # Auth stack
│   ├── login.tsx             # /auth/login
│   └── signup.tsx            # /auth/signup
├── garage-sales/
│   ├── index.tsx             # List view
│   ├── map.tsx               # Map view
│   └── [id].tsx              # Detail view
├── _layout.tsx               # Root layout
└── index.tsx                 # Entry (redirect to tabs)
```

---

### 6.3 State Management

**Auth Context (shared between screens):**

```typescript
// apps/mobile/src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ... implement signIn, signUp, signOut

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

---

### 6.4 Data Fetching with React Query

```typescript
// apps/mobile/src/hooks/useGarageSales.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { GarageSale } from '@yk-companion/types';

export function useGarageSales() {
  return useQuery({
    queryKey: ['garageSales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('garage_sales')
        .select('*')
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data as GarageSale[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

---

### 6.5 Push Notifications

```typescript
// apps/mobile/src/lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00ff88',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas.projectId,
  })).data;

  return token;
}

// Send to backend for storage
export async function savePushToken(userId: string, token: string) {
  const { error } = await supabase
    .from('push_tokens')
    .upsert({ user_id: userId, token });

  if (error) console.error('Error saving push token:', error);
}

// Schedule aurora alert
export async function scheduleAuroraAlert(kpIndex: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🌌 Aurora Alert!',
      body: `High aurora activity detected (KP ${kpIndex}). Get outside!`,
      data: { type: 'aurora', kpIndex },
    },
    trigger: null, // Immediately
  });
}
```

---

### 6.6 Map Integration

```typescript
// apps/mobile/src/components/GarageSaleMap.tsx
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import type { GarageSale } from '@yk-companion/types';

interface Props {
  sales: GarageSale[];
  onSelectSale: (sale: GarageSale) => void;
}

export function GarageSaleMap({ sales, onSelectSale }: Props) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 62.4540, // Yellowknife
          longitude: -114.3718,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {sales.map((sale) => (
          <Marker
            key={sale.id}
            coordinate={{
              latitude: sale.latitude,
              longitude: sale.longitude,
            }}
            title={sale.title}
            description={sale.description}
            onPress={() => onSelectSale(sale)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});
```

---

## 7. App Store Submission Requirements

### 7.1 iOS App Store (Apple)

**Prerequisites:**
- [ ] Apple Developer Account ($99/year)
- [ ] App Store Connect access
- [ ] Privacy Policy URL
- [ ] Support URL
- [ ] Marketing URL (optional)

**Required Assets:**
- App Icon (1024×1024 PNG)
- Screenshots:
  - 6.7" iPhone (1290×2796) - 3 required
  - 6.5" iPhone (1242×2688) - 3 required
  - 5.5" iPhone (1242×2208) - 3 required
  - 12.9" iPad Pro (2048×2732) - optional
- App Preview video (optional but recommended)

**Metadata:**
- App name (30 chars max)
- Subtitle (30 chars max)
- Description (4000 chars max)
- Keywords (100 chars, comma-separated)
- Promotional text (170 chars)
- Categories (primary + secondary)
- Age rating
- Privacy policy
- Support contact

**Review Process:**
- Average: 24-48 hours
- Can be rejected for:
  - Crashes/bugs
  - Incomplete information
  - Privacy violations
  - Copycat apps
  - Inappropriate content

---

### 7.2 Google Play Store (Android)

**Prerequisites:**
- [ ] Google Play Console account ($25 one-time)
- [ ] Privacy Policy URL
- [ ] Content rating questionnaire

**Required Assets:**
- App Icon (512×512 PNG)
- Feature Graphic (1024×500 PNG)
- Screenshots:
  - Phone: 2-8 screenshots (16:9 or 9:16)
  - 7" Tablet: optional
  - 10" Tablet: optional
- Promo video (YouTube URL, optional)

**Metadata:**
- App name (50 chars max)
- Short description (80 chars)
- Full description (4000 chars)
- Categories
- Tags
- Content rating
- Privacy policy
- Contact details

**Review Process:**
- Average: 2-7 days
- Rolling review (can take longer for first submission)

---

### 7.3 Store Listing Optimization (ASO)

**App Name Ideas:**
```
- YK Buddy - Yellowknife Guide
- YK Buddy: Visit Yellowknife
- Yellowknife Companion App
- TRUE NORTH TRIPS: YK Buddy
```

**Keywords (iOS):**
```
yellowknife, aurora, northern lights, northwest territories,
canada travel, trip planner, garage sales, moving guide,
ykbuddy, aurora forecast, NWT, true north
```

**Description Template:**

```
Your friendly companion for exploring Yellowknife!

🌟 FEATURES
• Aurora forecast & viewing tips
• Interactive garage sale map
• Cost of living calculator
• 9 languages supported
• Local events & guides

🧳 PERFECT FOR
✓ Tourists visiting Yellowknife
✓ Residents finding local deals
✓ People planning to move

📍 INCLUDES
- Real-time aurora forecasts
- Garage sale route planner
- Moving cost calculator
- Multilingual support (EN, FR, CN, JP, KR, ES, DE, VN, TG)
- Offline mode

❄️ Because nobody should face -40° alone!

Download YK Buddy and discover everything Yellowknife
has to offer. Whether you're visiting for the aurora,
living here already, or planning to move - we've got you covered.
```

---

## 8. Build & Deployment

### 8.1 EAS Build Configuration

```json
// apps/mobile/eas.json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "buildType": "release"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 8.2 Build Commands

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd apps/mobile
eas build:configure

# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Preview builds (TestFlight/Internal Testing)
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production builds
eas build --profile production --platform ios
eas build --profile production --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### 8.3 OTA Updates with Expo Updates

```bash
# Publish update without app store submission
eas update --branch production --message "Bug fixes and performance improvements"

# Rollback to previous update
eas update:rollback --branch production
```

---

## 9. Cost Analysis

### Development Costs

| Item | Cost | Notes |
|------|------|-------|
| Developer time (16 weeks @ $50/hr, 40hr/wk) | $32,000 | If hiring |
| Apple Developer Account | $99/year | Required for iOS |
| Google Play Console | $25 one-time | Required for Android |
| Expo EAS Build (optional) | $29-$99/month | OR build locally for free |
| Domain (existing) | $10/year | Already owned |
| Supabase (existing) | FREE | Already set up |
| Mapbox | FREE tier | Up to 50k loads/month |
| **Total First Year** | **$32,133 - $33,321** | If hiring dev |
| **Total First Year (DIY)** | **$133 - $1,321** | Without dev costs |

### Ongoing Costs

| Item | Monthly | Yearly | Notes |
|------|---------|--------|-------|
| Apple Developer | - | $99 | Required |
| EAS (optional) | $0-$99 | $0-$1,188 | Can build locally |
| Supabase | FREE | FREE | Up to 500MB database |
| Push notifications | FREE | FREE | Expo's service |
| Hosting (Vercel) | FREE | FREE | Web app |
| **Total Minimum** | $0 | $99 | |
| **Total with EAS** | $99 | $1,287 | |

### Revenue Potential

**From Premium Sponsors:**
- 10 sponsors/month @ $380 avg = $3,800/month
- Annual: $45,600
- **Profit Year 1:** $44,279 - $45,467 (if you build it yourself)

---

## 10. Risk Analysis & Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Expo limitations | Medium | Medium | Use Expo dev client for custom native code |
| App store rejection | Medium | High | Follow guidelines strictly, test thoroughly |
| Map API costs | Low | Medium | Monitor usage, optimize requests |
| Push notification issues | Medium | Low | Implement graceful fallbacks |
| Offline sync conflicts | Medium | Medium | Use React Query with optimistic updates |
| Large app size | Low | Medium | Code splitting, optimize images |

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Low downloads | High | High | Strong ASO, local marketing, web integration |
| Maintenance burden | High | Medium | Use Expo for easier updates |
| Platform policy changes | Low | High | Stay updated on guidelines |
| Competition | Medium | Medium | Focus on Yellowknife-specific value |
| Sponsor acquisition | Medium | High | Start with web sponsors |

---

## 11. Success Metrics

### Development Milestones

- [ ] Week 4: Basic app with auth working
- [ ] Week 8: Garage sale feature complete
- [ ] Week 12: All core features implemented
- [ ] Week 16: App submitted to stores
- [ ] Week 17-18: Apps approved and live

### Launch Metrics (First 3 Months)

**Downloads:**
- Target: 500 downloads
- Stretch: 1,000 downloads

**Engagement:**
- DAU/MAU ratio: >30%
- Session length: >3 minutes avg
- Retention (Day 7): >40%

**Revenue:**
- Premium sponsors: 5-10/month
- Monthly revenue: $1,500-$3,800

**User Satisfaction:**
- App Store rating: >4.5 stars
- Play Store rating: >4.5 stars
- Reviews: >50 combined

---

## 12. Next Steps

### Immediate Actions (This Week)

1. **Decision Point:** Confirm mobile app development
2. **Set up development environment:**
   ```bash
   cd apps/mobile
   npm install
   npx expo start
   ```
3. **Create shared packages structure**
4. **Set up Supabase for React Native**
5. **Run existing scaffold on physical device**

### First Sprint (Next 2 Weeks)

1. **Extract shared types** to `packages/types`
2. **Create Supabase client** for mobile
3. **Implement authentication screens**
4. **Set up navigation structure**
5. **Create basic home screen**

### Questions to Answer

- [ ] Will you develop in-house or hire a developer?
- [ ] What's your target launch date?
- [ ] Do you want to start with iOS only, Android only, or both?
- [ ] Do you have existing Expo/React Native experience?
- [ ] Do you want to use EAS Build or build locally?

---

## 13. Resources & Documentation

### Expo Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Notifications](https://docs.expo.dev/push-notifications/overview/)

### React Native
- [React Native Docs](https://reactnative.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [React Navigation](https://reactnavigation.org/) (if not using Expo Router)

### Store Guidelines
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [Human Interface Guidelines (iOS)](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design (Android)](https://m3.material.io/)

### Tools
- [Expo Snack](https://snack.expo.dev/) - Try code in browser
- [TestFlight](https://developer.apple.com/testflight/) - iOS beta testing
- [Google Play Console](https://play.google.com/console) - Android publishing

---

## Conclusion

The YK Buddy mobile app is **well-positioned for success** because:

✅ **Technical foundation is solid** - Expo scaffold exists, backend ready
✅ **Business model proven** - Web app demonstrates value
✅ **Development path clear** - Step-by-step roadmap defined
✅ **Market opportunity** - No direct competitors in Yellowknife
✅ **Cost-effective** - ~$100-150 first year ongoing costs
✅ **Revenue potential** - $45k+ annual from sponsors

**Recommended approach:** Start with Phase 0-1 (foundation + auth), then validate with beta testers before investing in all features. Use the web app's proven features as a guide, but optimize UI/UX for mobile-first interactions.

**Timeline:** 16 weeks from start to app store submission with dedicated focus.

---

**Ready to build?**

Start here:
```bash
cd apps/mobile
npm install
npx expo start
```

Then open on your phone with Expo Go app to see the current scaffold!
