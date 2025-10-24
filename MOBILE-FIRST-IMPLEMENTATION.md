# TRUE NORTH TRIPS - Mobile-First Implementation Plan

## ✅ Current Status
- Expo app already configured
- Package.json ready with all dependencies
- App.json updated with TRUE NORTH TRIPS branding

## 📱 Mobile App Structure (React Native/Expo)

### File Structure to Create:
```
apps/mobile/
├── src/
│   ├── app/
│   │   ├── _layout.tsx              (Tab navigation)
│   │   ├── index.tsx                 (Home - redirects to (tabs))
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx          (Bottom tabs layout)
│   │   │   ├── home.tsx             (Home screen)
│   │   │   ├── explore.tsx          (Explore activities)
│   │   │   ├── plan.tsx             (Trip planner)
│   │   │   ├── aurora.tsx           (Aurora forecast)
│   │   │   └── profile.tsx          (User profile)
│   │   ├── quiz.tsx                 (Traveler quiz)
│   │   ├── calculator.tsx           (Cost calculator)
│   │   └── onboarding.tsx           (First-time user)
│   ├── components/
│   │   ├── AuroraCard.tsx
│   │   ├── ActivityCard.tsx
│   │   ├── TripCard.tsx
│   │   └── BottomSheet.tsx
│   ├── theme/
│   │   └── colors.ts                (Aurora color palette)
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   ├── useAuroraForecast.ts
│   │   └── useNotifications.ts
│   └── services/
│       ├── api.ts
│       └── storage.ts
```

### Bottom Tab Navigation Icons:
```
Home:    🏠 (Overview, quick actions)
Explore: 🎯 (Activities, places)
Plan:    📅 (Itinerary, calendar)
Aurora:  🌌 (Forecast, alerts)
Profile: 👤 (Settings, saved trips)
```

### Color Palette (theme/colors.ts):
```typescript
export const colors = {
  aurora: {
    green: '#00ff88',
    blue: '#4d94ff',
    purple: '#a366ff',
    pink: '#ff66cc',
  },
  background: {
    primary: '#0a1128',
    secondary: '#151b2e',
    card: '#1f2937',
  },
  text: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    accent: '#00ff88',
  },
};
```

## 🌐 Web Landing Page Structure

### Convert apps/web to Marketing Site:
```
apps/web/src/app/
├── page.tsx                    (Landing - desktop optimized)
├── features/page.tsx           (Feature showcase)
├── download/page.tsx           (App download links)
├── about/page.tsx              (About TRUE NORTH TRIPS)
└── components/
    ├── Hero.tsx                (Desktop hero with phone mockup)
    ├── FeatureSection.tsx      (3 columns with icons)
    ├── ScreenshotCarousel.tsx  (Mobile app screenshots)
    ├── AppDownloadCTA.tsx      (iOS/Android buttons + QR code)
    └── Footer.tsx              (Links, social, contact)
```

### Landing Page Sections:
1. **Hero** - "Plan Yellowknife trips on the go"
2. **Features** - Aurora alerts, Trip planning, Cost calculator
3. **Screenshots** - Carousel of mobile screens
4. **How it Works** - 3-step process
5. **Download CTA** - App store buttons + QR code
6. **Footer** - Links, privacy, contact

## 🚀 Quick Start Commands

### Run Mobile App (Development):
```bash
cd apps/mobile
npm install
npx expo start
```
Then:
- Press 'i' for iOS Simulator
- Press 'a' for Android Emulator  
- Scan QR code with Expo Go app on physical device

### Run Landing Page:
```bash
cd apps/web
npm install
npm run dev
```

### Build Mobile App for Production:
```bash
cd apps/mobile

# iOS Build (requires Apple Developer account)
npx eas build --platform ios

# Android Build  
npx eas build --platform android

# Both platforms
npx eas build --platform all
```

## 📱 Mobile App Features to Implement

### Phase 1 - Core Features (Week 1-2):
- [ ] Bottom tab navigation
- [ ] Home screen with quick actions
- [ ] Aurora forecast screen
- [ ] Activity browser (Explore)
- [ ] Basic trip planner

### Phase 2 - Enhanced Features (Week 3-4):
- [ ] Push notifications for aurora alerts
- [ ] Offline mode (cached data)
- [ ] GPS-based recommendations
- [ ] Camera integration (share photos)
- [ ] Calendar integration
- [ ] Cost calculator

### Phase 3 - Advanced Features (Week 5-6):
- [ ] User accounts & sync
- [ ] Saved trips
- [ ] Share itineraries
- [ ] Weather integration
- [ ] Emergency contacts
- [ ] Offline maps

## 🎨 Design Guidelines

### Mobile App (Touch-Optimized):
- Minimum button size: 44x44pt
- Font sizes: 16px+ for body text
- Single column layouts
- Bottom navigation (thumb-friendly)
- Pull-to-refresh
- Swipe gestures
- Native feel (iOS/Android patterns)

### Landing Page (Desktop-First):
- Hero with phone mockup showcase
- Feature grid (3-4 columns)
- Large CTA buttons
- QR code for instant download
- Responsive but optimized for desktop

## 📊 User Flows

### Mobile User (Primary):
1. Install app from store/PWA
2. Optional onboarding (3 screens)
3. Choose user type (Visiting/Living/Moving)
4. Bottom tab navigation
5. Set up aurora alerts
6. Plan trip
7. Get notifications

### Desktop User (Secondary):
1. Land on truenorthtrips.com
2. See features & screenshots
3. Scan QR code / click download
4. Opens on mobile
5. Install app

## 🔧 Technical Setup

### Install Dependencies:
```bash
# Mobile app
cd apps/mobile
npm install

# Landing page
cd apps/web
npm install
```

### Environment Variables:
```bash
# apps/mobile/.env
API_URL=https://api.truenorthtrips.com
AURORA_API_KEY=your_key_here
GOOGLE_MAPS_KEY=your_key_here

# apps/web/.env
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/...
NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/...
```

## 📝 Next Steps

1. **Immediate** (Today):
   - Create tab navigation layout
   - Build Home screen
   - Build Aurora screen
   - Create landing page hero

2. **This Week**:
   - Complete all 5 tab screens
   - Add aurora API integration
   - Create landing page content
   - Test on iOS/Android

3. **Next Week**:
   - Push notifications setup
   - User onboarding flow
   - Offline mode
   - App store submission prep

4. **Week 3-4**:
   - Submit to App Store & Play Store
   - Launch marketing campaign
   - Monitor analytics
   - Iterate based on feedback

## 📱 Testing

### Physical Device Testing:
```bash
cd apps/mobile
npx expo start

# Then scan QR code with:
# iOS: Camera app or Expo Go
# Android: Expo Go app
```

### Emulator Testing:
```bash
# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator  
npx expo start --android
```

## 🚀 Deployment

### Mobile App:
- **iOS**: Submit via App Store Connect
- **Android**: Submit via Google Play Console
- **Timeline**: 2-7 days review process

### Landing Page:
- **Vercel**: `cd apps/web && npx vercel --prod`
- **Custom Domain**: Configure DNS to point to Vercel

## 📈 Success Metrics

- Mobile app installs
- Daily active users
- Trip plans created
- Aurora alerts sent
- User retention rate
- App store ratings

---

**Status**: Ready to implement
**Est. Timeline**: 4-6 weeks to full launch
**Next Action**: Create tab navigation and screens
