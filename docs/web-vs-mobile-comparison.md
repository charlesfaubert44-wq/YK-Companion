# YK Buddy: Web vs Mobile Comparison

**Understanding the differences between the web and mobile implementations**

---

## Technology Stack

| Aspect | Web App | Mobile App |
|--------|---------|------------|
| **Framework** | Next.js 14 | Expo 50 (React Native) |
| **Language** | TypeScript | TypeScript |
| **Routing** | Next.js App Router | Expo Router |
| **Styling** | Tailwind CSS | StyleSheet / React Native |
| **State Management** | Zustand, React Context | Zustand, React Context |
| **Data Fetching** | React Query | React Query |
| **Maps** | Mapbox GL JS | React Native Maps |
| **Backend** | Supabase (SSR) | Supabase (client-side) |
| **Storage** | localStorage | AsyncStorage |
| **Auth** | Supabase Auth (SSR) | Supabase Auth (client) |
| **Build** | Vercel | EAS Build |
| **Deployment** | Vercel (instant) | App Store + Play Store |

---

## Component Comparison

### Example: Button Component

**Web (Tailwind CSS):**
```tsx
// apps/web/src/components/ui/Button.tsx
export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-emerald-500 hover:bg-emerald-600 text-white
                 px-6 py-3 rounded-lg font-semibold
                 transition-colors duration-200"
    >
      {children}
    </button>
  );
}
```

**Mobile (React Native):**
```tsx
// apps/mobile/src/components/ui/Button.tsx
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export function Button({ children, onPress }: ButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
```

---

## Navigation Comparison

### Web (Next.js App Router)

**File Structure:**
```
apps/web/src/app/
├── page.tsx                 # / (home)
├── about/page.tsx          # /about
├── visiting/page.tsx       # /visiting
├── living/
│   ├── page.tsx           # /living
│   └── garage-sales/
│       └── page.tsx       # /living/garage-sales
```

**Navigation:**
```tsx
import Link from 'next/link';

<Link href="/visiting" className="...">
  Visit Yellowknife
</Link>
```

### Mobile (Expo Router)

**File Structure:**
```
apps/mobile/src/app/
├── (tabs)/
│   ├── index.tsx           # Home tab
│   ├── visiting.tsx        # Visiting tab
│   ├── living.tsx          # Living tab
│   └── _layout.tsx         # Tab configuration
├── garage-sales/
│   ├── index.tsx           # /garage-sales
│   └── [id].tsx            # /garage-sales/:id
```

**Navigation:**
```tsx
import { Link, useRouter } from 'expo-router';

// Declarative
<Link href="/visiting">Visit Yellowknife</Link>

// Imperative
const router = useRouter();
router.push('/visiting');
```

---

## Data Fetching Comparison

### Web (Server Components + Client Components)

**Server Component (default):**
```tsx
// apps/web/src/app/garage-sales/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function GarageSalesPage() {
  const supabase = createClient();

  // Fetch on server - no loading state needed
  const { data: sales } = await supabase
    .from('garage_sales')
    .select('*');

  return <GarageSalesList sales={sales} />;
}
```

**Client Component (interactive):**
```tsx
'use client';

import { useQuery } from '@tanstack/react-query';

export function GarageSalesClient() {
  const { data, isLoading } = useQuery({
    queryKey: ['garage-sales'],
    queryFn: fetchGarageSales,
  });

  if (isLoading) return <Spinner />;
  return <GarageSalesList sales={data} />;
}
```

### Mobile (Always Client-Side)

```tsx
// apps/mobile/src/app/garage-sales/index.tsx
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList } from 'react-native';

export default function GarageSalesScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['garage-sales'],
    queryFn: fetchGarageSales,
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#10B981" />;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <GarageSaleItem sale={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

---

## Styling Comparison

### Web (Tailwind CSS)

```tsx
// Utility-first CSS classes
<div className="container mx-auto px-4">
  <h1 className="text-4xl font-bold text-emerald-500 mb-4">
    Welcome to YK Buddy
  </h1>
  <p className="text-gray-600 leading-relaxed">
    Your Yellowknife companion
  </p>
</div>
```

### Mobile (StyleSheet)

```tsx
import { View, Text, StyleSheet } from 'react-native';

<View style={styles.container}>
  <Text style={styles.title}>
    Welcome to YK Buddy
  </Text>
  <Text style={styles.subtitle}>
    Your Yellowknife companion
  </Text>
</View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
});
```

---

## Layout Comparison

### Web (Flexbox + CSS Grid)

```tsx
// Two-column layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="col-span-1">Column 1</div>
  <div className="col-span-1">Column 2</div>
</div>

// Flexbox
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>
```

### Mobile (Flexbox only)

```tsx
import { View, StyleSheet } from 'react-native';

// Two columns (side by side)
<View style={styles.row}>
  <View style={styles.column}>Column 1</View>
  <View style={styles.column}>Column 2</View>
</View>

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
});

// Flexbox (default is column on mobile)
<View style={styles.container}>
  <View>Top</View>
  <View>Bottom</View>
</View>

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column', // default
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
```

---

## Forms Comparison

### Web

```tsx
'use client';

import { useForm } from 'react-hook-form';

export function LoginForm() {
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register('email')}
        className="border rounded-lg px-4 py-2"
        placeholder="Email"
      />
      <input
        type="password"
        {...register('password')}
        className="border rounded-lg px-4 py-2"
        placeholder="Password"
      />
      <button type="submit" className="...">
        Log In
      </button>
    </form>
  );
}
```

### Mobile

```tsx
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity onPress={() => onSubmit(email, password)}>
        <Text>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

## Images Comparison

### Web

```tsx
import Image from 'next/image';

// Next.js optimized image
<Image
  src="/aurora.jpg"
  alt="Northern Lights"
  width={800}
  height={600}
  priority
  className="rounded-lg"
/>

// Regular img tag
<img
  src="/logo.png"
  alt="YK Buddy"
  className="w-32 h-32"
/>
```

### Mobile

```tsx
import { Image } from 'react-native';

// Local image (required at build time)
<Image
  source={require('../assets/aurora.jpg')}
  style={{ width: 800, height: 600, borderRadius: 8 }}
  resizeMode="cover"
/>

// Remote image
<Image
  source={{ uri: 'https://example.com/aurora.jpg' }}
  style={{ width: 800, height: 600 }}
/>
```

---

## Animations Comparison

### Web (CSS Transitions + Framer Motion)

```tsx
// CSS Transitions (Tailwind)
<div className="transition-all duration-300 hover:scale-110">
  Hover me
</div>

// Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

### Mobile (React Native Animated)

```tsx
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export function FadeIn({ children }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
}
```

---

## Maps Comparison

### Web (Mapbox GL JS)

```tsx
'use client';

import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export function GarageSaleMap({ sales }) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: -114.3718,
        latitude: 62.4540,
        zoom: 12
      }}
      style={{ width: '100%', height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {sales.map(sale => (
        <Marker
          key={sale.id}
          longitude={sale.longitude}
          latitude={sale.latitude}
        />
      ))}
    </Map>
  );
}
```

### Mobile (React Native Maps)

```tsx
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

export function GarageSaleMap({ sales }) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 62.4540,
        longitude: -114.3718,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {sales.map(sale => (
        <Marker
          key={sale.id}
          coordinate={{
            latitude: sale.latitude,
            longitude: sale.longitude,
          }}
          title={sale.title}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
});
```

---

## Storage Comparison

### Web (localStorage)

```tsx
// Store data
localStorage.setItem('language', 'en');
localStorage.setItem('user', JSON.stringify(user));

// Retrieve data
const language = localStorage.getItem('language');
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Remove data
localStorage.removeItem('language');
localStorage.clear();
```

### Mobile (AsyncStorage)

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data (async)
await AsyncStorage.setItem('language', 'en');
await AsyncStorage.setItem('user', JSON.stringify(user));

// Retrieve data (async)
const language = await AsyncStorage.getItem('language');
const user = JSON.parse(await AsyncStorage.getItem('user') || '{}');

// Remove data
await AsyncStorage.removeItem('language');
await AsyncStorage.clear();
```

---

## Platform-Specific Features

### Web Only

1. **SEO** - Meta tags, sitemaps, robots.txt
2. **SSR/SSG** - Server-side rendering for performance
3. **CSS Frameworks** - Tailwind, CSS-in-JS
4. **Admin Dashboard** - Complex admin tools
5. **Browser APIs** - Web APIs not available on mobile
6. **Shareable URLs** - Easy to share links
7. **No Installation** - Instant access

**Example:**
```tsx
// apps/web/src/app/layout.tsx
export const metadata = {
  title: 'YK Buddy - Your Yellowknife Companion',
  description: 'Because Nobody Should Face -40° Alone',
  openGraph: {
    images: ['/og-image.jpg'],
  },
};
```

### Mobile Only

1. **Push Notifications** - Alert users anywhere
2. **Offline Mode** - Works without internet
3. **Native GPS** - Always-on location tracking
4. **Camera Access** - Native photo capture
5. **Biometric Auth** - Face ID / Touch ID
6. **App Shortcuts** - Quick actions from home screen
7. **Background Tasks** - Run code when app is closed
8. **App Store Presence** - Discoverability

**Example:**
```tsx
// apps/mobile/src/lib/notifications.ts
import * as Notifications from 'expo-notifications';

export async function scheduleNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Aurora Alert! 🌌",
      body: "High KP index detected - great viewing tonight!",
    },
    trigger: { seconds: 2 },
  });
}
```

---

## Deployment Comparison

### Web (Vercel)

**Process:**
1. Push to GitHub
2. Vercel auto-deploys
3. Live in ~2 minutes
4. Instant rollbacks

**Cost:** FREE (Hobby plan)

**Updates:** Instant, no user action needed

### Mobile (App Stores)

**Process:**
1. Build production app (EAS Build)
2. Submit to App Store + Play Store
3. Wait for review (1-7 days)
4. Approved and live
5. Users download update

**Cost:**
- iOS: $99/year
- Android: $25 one-time

**Updates:**
- Major: Submit to stores (1-7 day wait)
- Minor: OTA with Expo Updates (instant)

---

## Key Differences Summary

| Aspect | Web | Mobile |
|--------|-----|--------|
| **Distribution** | URL | App stores |
| **Installation** | None | Required |
| **Updates** | Instant | Delayed |
| **Offline** | Limited | Full support |
| **Performance** | Network dependent | Native performance |
| **Notifications** | Browser only | System-level |
| **UX Patterns** | Mouse/keyboard | Touch gestures |
| **Screen Sizes** | Responsive design | Device-specific |
| **Platform APIs** | Web APIs | Native APIs |
| **Discovery** | SEO, URLs | App stores, search |

---

## When to Use Each

### Use Web When:
- Need instant updates
- SEO is important
- Building admin tools
- Desktop experience matters
- Don't want app store hassle
- Targeting broad audience

### Use Mobile When:
- Need push notifications
- Offline mode is critical
- Camera/GPS integration needed
- Better user engagement desired
- App store presence valuable
- Native UX expected

### Use Both When:
- You want maximum reach
- Budget allows
- Features complement each other
- Different use cases for each platform

---

## YK Buddy Strategy

**Current:** Web app (live)
**Planned:** Mobile apps (iOS + Android)

**Why Both?**
1. **Web** - Good for discovery, SEO, admin, desktop users
2. **Mobile** - Better engagement, push notifications, offline mode
3. **Shared Backend** - Same Supabase database
4. **Shared Code** - TypeScript types, business logic, translations
5. **Different Strengths** - Each platform excels at different things

**Result:** Best of both worlds! 🎉

---

For implementation details, see:
- [MOBILE_APP_PLAN.md](../MOBILE_APP_PLAN.md) - Full mobile plan
- [MOBILE_QUICK_START.md](../MOBILE_QUICK_START.md) - Get started quickly
- [mobile-implementation-checklist.md](./mobile-implementation-checklist.md) - Track progress
