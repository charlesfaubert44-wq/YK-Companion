# YK Buddy Mobile App - Implementation Checklist

**Use this checklist to track your mobile app development progress.**

---

## 📋 Phase 0: Foundation (Week 1-2)

### Shared Packages Setup

- [ ] **Create `packages/types`**
  - [ ] Set up package.json
  - [ ] Create src/database.ts (Supabase types)
  - [ ] Create src/api.ts (API types)
  - [ ] Export all types from index.ts
  - [ ] Build package: `npm run build`

- [ ] **Create `packages/shared`**
  - [ ] Set up package.json
  - [ ] Create src/utils/ (pure functions)
  - [ ] Create src/constants/ (shared constants)
  - [ ] Create src/i18n/ (translation files)
  - [ ] Add all 9 language JSON files
  - [ ] Create validation schemas (Zod)
  - [ ] Export from index.ts
  - [ ] Build package: `npm run build`

- [ ] **Update package.json dependencies**
  - [ ] Web app references @yk-companion/types
  - [ ] Web app references @yk-companion/shared
  - [ ] Mobile app references @yk-companion/types
  - [ ] Mobile app references @yk-companion/shared

### Mobile Infrastructure

- [ ] **Supabase Setup**
  - [ ] Install dependencies: `@supabase/supabase-js`, `@react-native-async-storage/async-storage`
  - [ ] Create `src/lib/supabase.ts`
  - [ ] Configure AsyncStorage for session persistence
  - [ ] Add environment variables to .env
  - [ ] Test connection to Supabase
  - [ ] Add URL polyfill: `react-native-url-polyfill`

- [ ] **Core Configuration**
  - [ ] Update app.json with correct bundle IDs
  - [ ] Configure EAS (eas.json)
  - [ ] Set up environment variables (.env)
  - [ ] Configure TypeScript (tsconfig.json)
  - [ ] Set up ESLint
  - [ ] Install React Query
  - [ ] Configure React Query provider

---

## 📋 Phase 1: Core App (Week 3-6)

### Week 3: Authentication

- [ ] **Auth Context**
  - [ ] Create AuthContext.tsx
  - [ ] Implement useAuth hook
  - [ ] Add session management
  - [ ] Add auth state listeners
  - [ ] Wrap app with AuthProvider

- [ ] **Auth Screens**
  - [ ] Create (auth) folder in app/
  - [ ] Build login.tsx screen
  - [ ] Build signup.tsx screen
  - [ ] Build password-reset.tsx screen
  - [ ] Add form validation (react-hook-form + zod)
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Test auth flow

- [ ] **Protected Routes**
  - [ ] Create auth check in _layout.tsx
  - [ ] Redirect to login if not authenticated
  - [ ] Handle deep linking
  - [ ] Test protected routes

### Week 4: Navigation & Home

- [ ] **Tab Navigation**
  - [ ] Configure (tabs)/_layout.tsx
  - [ ] Add tab icons (Ionicons)
  - [ ] Set tab labels (multilingual)
  - [ ] Style tab bar
  - [ ] Test navigation flow

- [ ] **Home Screen**
  - [ ] Create home.tsx UI
  - [ ] Add pathway cards component
  - [ ] Add Premium Spotlight component
  - [ ] Add weather widget
  - [ ] Make cards tappable (navigate to pathways)
  - [ ] Add animations (optional)

- [ ] **Language Support**
  - [ ] Create LanguageContext.tsx
  - [ ] Build language selector component
  - [ ] Integrate i18n from shared package
  - [ ] Add language picker to settings/profile
  - [ ] Persist language choice (AsyncStorage)
  - [ ] Test all 9 languages

- [ ] **Premium Spotlight (Mobile)**
  - [ ] Port PremiumSpotlight component
  - [ ] Create aurora animation (React Native Animated)
  - [ ] Fetch active sponsors from Supabase
  - [ ] Add tap to open link
  - [ ] Test on both platforms

### Week 5: Pathway Screens

- [ ] **Visiting Screen**
  - [ ] Create visiting.tsx
  - [ ] Add content sections
  - [ ] Add aurora info link
  - [ ] Add trip planning checklist
  - [ ] Style for mobile

- [ ] **Living Screen**
  - [ ] Create living.tsx
  - [ ] Add garage sales link
  - [ ] Add local events section
  - [ ] Add community resources
  - [ ] Style for mobile

- [ ] **Moving Screen**
  - [ ] Create moving.tsx
  - [ ] Add calculator link
  - [ ] Add housing info section
  - [ ] Add job resources
  - [ ] Add newcomer guides
  - [ ] Style for mobile

- [ ] **About & Info Screens**
  - [ ] Create about.tsx
  - [ ] Create contact.tsx
  - [ ] Add seasonal guide
  - [ ] Add FAQ section

### Week 6: Testing & Polish

- [ ] **Error Handling**
  - [ ] Add global error boundary
  - [ ] Add network error handling
  - [ ] Add retry logic for failed requests
  - [ ] Show user-friendly error messages

- [ ] **Loading States**
  - [ ] Add skeleton loaders
  - [ ] Add spinners where appropriate
  - [ ] Add pull-to-refresh
  - [ ] Add optimistic updates

- [ ] **Empty States**
  - [ ] Design empty state components
  - [ ] Add to all list views
  - [ ] Add helpful messaging

- [ ] **Basic Testing**
  - [ ] Test on iOS
  - [ ] Test on Android
  - [ ] Test auth flow
  - [ ] Test navigation
  - [ ] Test data fetching
  - [ ] Fix critical bugs

---

## 📋 Phase 2: Key Features (Week 7-10)

### Week 7-8: Garage Sale Planner

- [ ] **Data Layer**
  - [ ] Create useGarageSales hook
  - [ ] Create useGarageSale (single) hook
  - [ ] Add React Query caching
  - [ ] Add offline support

- [ ] **List View**
  - [ ] Create garage-sales/index.tsx
  - [ ] Build list item component
  - [ ] Add sorting (by date, distance)
  - [ ] Add filtering
  - [ ] Add search
  - [ ] Add pull-to-refresh
  - [ ] Add infinite scroll (if needed)

- [ ] **Map View**
  - [ ] Install react-native-maps
  - [ ] Create garage-sales/map.tsx
  - [ ] Add markers for all sales
  - [ ] Add custom marker icons
  - [ ] Add marker clustering (optional)
  - [ ] Add current location marker
  - [ ] Add tap to view details

- [ ] **Detail View**
  - [ ] Create garage-sales/[id].tsx
  - [ ] Show full details
  - [ ] Add save to favorites button
  - [ ] Add share button
  - [ ] Add directions button
  - [ ] Add calendar add button

- [ ] **GPS Integration**
  - [ ] Request location permissions
  - [ ] Get current location
  - [ ] Calculate distances
  - [ ] Sort by "near me"
  - [ ] Add "near me" filter

- [ ] **Favorites**
  - [ ] Create favorites storage (AsyncStorage)
  - [ ] Add/remove favorites
  - [ ] Create favorites view
  - [ ] Sync favorites with Supabase (optional)

- [ ] **Route Planning**
  - [ ] Port TSP algorithm from web
  - [ ] Create route optimization UI
  - [ ] Show optimized route on map
  - [ ] Add route directions

### Week 9: Cost of Living Calculator

- [ ] **Calculator Screen**
  - [ ] Create calculator/index.tsx
  - [ ] Build form with inputs
  - [ ] Add category sections
  - [ ] Style form for mobile
  - [ ] Add input validation

- [ ] **Results Display**
  - [ ] Calculate totals
  - [ ] Show breakdown by category
  - [ ] Add comparison (if moving from elsewhere)
  - [ ] Add charts (optional - react-native-chart-kit)
  - [ ] Style results view

- [ ] **Persistence**
  - [ ] Save calculations (AsyncStorage)
  - [ ] Load saved calculations
  - [ ] Allow multiple saved calculations
  - [ ] Delete calculations

- [ ] **Share Functionality**
  - [ ] Export as PDF (optional)
  - [ ] Share via share sheet
  - [ ] Send via email (optional)

### Week 10: Aurora Features

- [ ] **Aurora Forecast Screen**
  - [ ] Create aurora/forecast.tsx
  - [ ] Fetch KP index data (API)
  - [ ] Display current KP index
  - [ ] Show 3-day forecast
  - [ ] Add viewing tips
  - [ ] Add best locations

- [ ] **Aurora Info**
  - [ ] Create aurora/info.tsx
  - [ ] Add KP index explanations
  - [ ] Add photography tips
  - [ ] Add FAQ
  - [ ] Add best times to view

- [ ] **Notification Setup**
  - [ ] Create notification infrastructure
  - [ ] Request notification permissions
  - [ ] Register push token
  - [ ] Save token to Supabase
  - [ ] Test local notifications

---

## 📋 Phase 3: Mobile Enhancements (Week 11-13)

### Week 11: Push Notifications

- [ ] **Expo Notifications Setup**
  - [ ] Configure notification channels (Android)
  - [ ] Create notification handler
  - [ ] Test local notifications
  - [ ] Test remote notifications

- [ ] **Aurora Alerts**
  - [ ] Create backend cloud function (Supabase/Vercel)
  - [ ] Trigger on high KP index
  - [ ] Send push notifications
  - [ ] Handle notification taps
  - [ ] Navigate to aurora screen

- [ ] **Garage Sale Alerts**
  - [ ] Alert on new sales nearby
  - [ ] Alert 1 day before saved sales
  - [ ] Allow user to configure alerts
  - [ ] Test alert timing

- [ ] **Notification Preferences**
  - [ ] Create settings screen
  - [ ] Add toggle for each notification type
  - [ ] Add quiet hours setting
  - [ ] Save preferences to Supabase
  - [ ] Test preference syncing

### Week 12: Offline & Performance

- [ ] **Offline Data Caching**
  - [ ] Configure React Query persistence
  - [ ] Cache garage sales data
  - [ ] Cache user favorites
  - [ ] Cache sponsor data
  - [ ] Handle stale data

- [ ] **AsyncStorage**
  - [ ] Store user preferences
  - [ ] Store auth tokens
  - [ ] Store language choice
  - [ ] Store favorites
  - [ ] Add storage limits/cleanup

- [ ] **Image Optimization**
  - [ ] Use optimized image formats (WebP)
  - [ ] Add image caching
  - [ ] Lazy load images
  - [ ] Use thumbnails where appropriate

- [ ] **Performance Profiling**
  - [ ] Use React DevTools Profiler
  - [ ] Identify slow renders
  - [ ] Add memoization where needed
  - [ ] Optimize list rendering (FlatList)
  - [ ] Reduce bundle size

- [ ] **Reduce Bundle Size**
  - [ ] Remove unused dependencies
  - [ ] Use tree shaking
  - [ ] Analyze bundle with `npx expo-doctor`
  - [ ] Target < 50MB for iOS, < 150MB Android

### Week 13: Native Features

- [ ] **Share Sheet**
  - [ ] Install react-native-share
  - [ ] Add share buttons to garage sales
  - [ ] Share calculator results
  - [ ] Share aurora forecast
  - [ ] Test on both platforms

- [ ] **Camera Integration** (optional)
  - [ ] Request camera permissions
  - [ ] Add camera screen
  - [ ] Allow photo capture
  - [ ] Upload to Supabase Storage
  - [ ] Add to community feed (future)

- [ ] **Biometric Authentication**
  - [ ] Install expo-local-authentication
  - [ ] Check device support
  - [ ] Add settings toggle
  - [ ] Implement biometric login
  - [ ] Fallback to password
  - [ ] Test Face ID / Touch ID / Fingerprint

- [ ] **App Shortcuts**
  - [ ] Configure app shortcuts (app.json)
  - [ ] Add "View Garage Sales" shortcut
  - [ ] Add "Check Aurora" shortcut
  - [ ] Add "Open Calculator" shortcut
  - [ ] Test 3D Touch / Long press

- [ ] **Splash Screen & Icon**
  - [ ] Design app icon (1024x1024)
  - [ ] Generate all icon sizes
  - [ ] Design splash screen
  - [ ] Configure splash screen (app.json)
  - [ ] Test on both platforms

---

## 📋 Phase 4: Testing & Store Prep (Week 14-16)

### Week 14: Testing

- [ ] **Internal Testing**
  - [ ] Build preview version (EAS)
  - [ ] Distribute to testers (TestFlight/Internal)
  - [ ] Create testing checklist
  - [ ] Gather feedback
  - [ ] Create bug tracker

- [ ] **Bug Fixes**
  - [ ] Fix critical bugs
  - [ ] Fix UI/UX issues
  - [ ] Fix performance issues
  - [ ] Fix crashes
  - [ ] Retest after fixes

- [ ] **UX Improvements**
  - [ ] Improve navigation flow
  - [ ] Improve form UX
  - [ ] Improve loading states
  - [ ] Add helpful tooltips
  - [ ] Add onboarding (optional)

- [ ] **Performance Optimization**
  - [ ] Reduce app start time
  - [ ] Optimize data fetching
  - [ ] Reduce memory usage
  - [ ] Fix slow animations
  - [ ] Test on low-end devices

- [ ] **Accessibility**
  - [ ] Add accessibility labels
  - [ ] Test with VoiceOver (iOS)
  - [ ] Test with TalkBack (Android)
  - [ ] Ensure proper contrast ratios
  - [ ] Test with large text sizes
  - [ ] Add alt text for images

### Week 15: Store Assets

- [ ] **App Icon**
  - [ ] Design 1024x1024 PNG
  - [ ] Generate all required sizes
  - [ ] Add to app.json
  - [ ] Test on device

- [ ] **Screenshots**
  - [ ] Capture iOS screenshots (6.7", 6.5", 5.5")
  - [ ] Capture Android screenshots
  - [ ] Add captions/overlays (optional)
  - [ ] Prepare in all required sizes
  - [ ] Localize for each language (optional)

- [ ] **App Preview Videos** (optional)
  - [ ] Record 15-30 second demo
  - [ ] Edit with captions
  - [ ] Export in required formats
  - [ ] Upload to App Store Connect / Play Console

- [ ] **Store Listings**
  - [ ] Write app name (30 chars iOS, 50 Android)
  - [ ] Write subtitle (30 chars, iOS only)
  - [ ] Write short description (80 chars, Android only)
  - [ ] Write full description (4000 chars)
  - [ ] Write promotional text (170 chars, iOS)
  - [ ] Choose keywords (100 chars, iOS)
  - [ ] Translate for all 9 languages (optional)

- [ ] **Legal Pages**
  - [ ] Create Privacy Policy
  - [ ] Create Terms of Service
  - [ ] Create Support page
  - [ ] Host on ykbuddy.com
  - [ ] Add links to app

- [ ] **Marketing Materials**
  - [ ] Feature graphic (1024x500, Android)
  - [ ] Promo images for social media
  - [ ] Press kit (optional)
  - [ ] Landing page on website

### Week 16: Submission

- [ ] **Pre-Submission Checks**
  - [ ] Test production build
  - [ ] Verify all links work
  - [ ] Verify privacy policy
  - [ ] Check for crashes
  - [ ] Verify app metadata
  - [ ] Check age rating

- [ ] **iOS App Store**
  - [ ] Build production IPA (EAS)
  - [ ] Create app in App Store Connect
  - [ ] Upload screenshots
  - [ ] Fill in metadata
  - [ ] Set pricing (free)
  - [ ] Configure age rating
  - [ ] Add privacy info
  - [ ] Submit for review
  - [ ] Monitor review status

- [ ] **Google Play Store**
  - [ ] Build production AAB (EAS)
  - [ ] Create app in Play Console
  - [ ] Upload screenshots
  - [ ] Fill in metadata
  - [ ] Set pricing (free)
  - [ ] Complete content rating questionnaire
  - [ ] Add privacy policy link
  - [ ] Create release notes
  - [ ] Submit for review
  - [ ] Monitor review status

- [ ] **App Store Optimization (ASO)**
  - [ ] Research keywords
  - [ ] Optimize app name
  - [ ] Optimize description
  - [ ] Add relevant tags (Android)
  - [ ] Monitor rankings

- [ ] **Beta Testing Program**
  - [ ] Set up TestFlight (iOS)
  - [ ] Set up Internal Testing (Android)
  - [ ] Invite beta testers
  - [ ] Collect feedback
  - [ ] Plan updates based on feedback

---

## 📋 Phase 5: Launch & Iterate (Week 17+)

### Launch Preparation

- [ ] **Monitor Approval**
  - [ ] Track iOS review status
  - [ ] Track Android review status
  - [ ] Respond to review questions promptly
  - [ ] Fix any issues found during review

- [ ] **Marketing**
  - [ ] Prepare launch announcement
  - [ ] Create social media posts
  - [ ] Update website with app links
  - [ ] Email existing users (if applicable)
  - [ ] Press release (optional)
  - [ ] Local media outreach

- [ ] **Launch Day**
  - [ ] Verify apps are live
  - [ ] Test download and install
  - [ ] Monitor for crashes
  - [ ] Respond to early reviews
  - [ ] Post launch announcement

### Post-Launch

- [ ] **Analytics**
  - [ ] Set up analytics (Expo Analytics or Firebase)
  - [ ] Track key metrics (downloads, DAU, MAU)
  - [ ] Monitor crash reports
  - [ ] Track user flows
  - [ ] Identify drop-off points

- [ ] **User Feedback**
  - [ ] Monitor app store reviews
  - [ ] Respond to reviews
  - [ ] Create feedback form in app
  - [ ] Track feature requests
  - [ ] Prioritize improvements

- [ ] **Iteration**
  - [ ] Plan first update
  - [ ] Fix critical bugs
  - [ ] Add requested features
  - [ ] Improve based on data
  - [ ] Release updates (OTA with Expo Updates)

- [ ] **Marketing Optimization**
  - [ ] A/B test screenshots
  - [ ] Optimize app description
  - [ ] Improve ASO
  - [ ] Track conversion rates
  - [ ] Adjust strategy

---

## 🎯 Success Criteria

### Phase 0
- ✅ Shared packages working
- ✅ Mobile app connects to Supabase
- ✅ TypeScript compiling

### Phase 1
- ✅ Users can sign up and log in
- ✅ Navigation works smoothly
- ✅ Premium Spotlight displays
- ✅ Language switching works

### Phase 2
- ✅ Garage sales display on map and list
- ✅ Calculator produces accurate results
- ✅ Aurora forecast is visible

### Phase 3
- ✅ Push notifications work
- ✅ App works offline
- ✅ Performance is smooth (60fps)

### Phase 4
- ✅ Zero critical bugs
- ✅ Apps submitted to stores
- ✅ All store assets ready

### Phase 5
- ✅ Apps approved and live
- ✅ 500+ downloads in first 3 months
- ✅ 4.5+ star rating

---

**Print this checklist and cross off items as you go!**

For the full development plan, see [MOBILE_APP_PLAN.md](../MOBILE_APP_PLAN.md)
