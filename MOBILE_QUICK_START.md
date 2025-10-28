# YK Buddy Mobile App - Quick Start Guide

**Get the mobile app running in 15 minutes!**

---

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- iOS Simulator (Mac) OR Android Emulator OR Physical device
- Expo Go app on your phone (optional, for quick testing)

---

## Step 1: Install Dependencies

```bash
# From project root
cd /workspaces/YK-Companion/apps/mobile

# Install dependencies
npm install

# Install Expo CLI globally (if not already installed)
npm install -g expo-cli eas-cli
```

---

## Step 2: Set Up Environment Variables

Create a `.env` file in `apps/mobile/`:

```bash
# apps/mobile/.env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_MAPBOX_TOKEN=your-mapbox-token-here
```

**Get these values from:**
- Supabase: Already configured in your web app `.env.local`
- Mapbox: https://account.mapbox.com/access-tokens/

---

## Step 3: Start Development Server

```bash
# Make sure you're in apps/mobile
cd apps/mobile

# Start Expo development server
npx expo start
```

You'll see a QR code in your terminal.

---

## Step 4: Run on Device

### Option A: Physical Device (Easiest)

1. **Install Expo Go app:**
   - iOS: [Expo Go on App Store](https://apps.apple.com/us/app/expo-go/id982107779)
   - Android: [Expo Go on Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Scan QR code:**
   - iOS: Open Camera app, scan QR code
   - Android: Open Expo Go app, tap "Scan QR Code"

3. **Wait for app to load** (~30 seconds first time)

### Option B: iOS Simulator (Mac only)

```bash
# Press 'i' in the Expo terminal, or:
npx expo start --ios
```

### Option C: Android Emulator

```bash
# Make sure Android Studio is installed and emulator is running
# Press 'a' in the Expo terminal, or:
npx expo start --android
```

---

## Step 5: Explore the App

Current scaffold includes:
- **Home** tab - Welcome screen
- **Aurora** tab - Placeholder
- **Explore** tab - Placeholder
- **Plan** tab - Placeholder
- **Profile** tab - Placeholder

**Files to modify:**
- [apps/mobile/src/app/(tabs)/home.tsx](apps/mobile/src/app/(tabs)/home.tsx) - Home screen
- [apps/mobile/src/app/(tabs)/_layout.tsx](apps/mobile/src/app/(tabs)/_layout.tsx) - Tab configuration
- [apps/mobile/src/theme/colors.ts](apps/mobile/src/theme/colors.ts) - Colors

---

## Development Tips

### Hot Reload

- Shake your device to open developer menu
- Press `r` in terminal to reload
- Press `m` to toggle menu
- Changes auto-reload (Fast Refresh)

### Debugging

```bash
# Open React Native debugger
Press 'j' in Expo terminal
# Opens Chrome DevTools
```

### Clear Cache

```bash
# If you encounter issues
npx expo start -c
# OR
rm -rf node_modules && npm install
```

---

## Common Commands

```bash
# Start development server
npx expo start

# Start on iOS
npx expo start --ios

# Start on Android
npx expo start --android

# Run on web (experimental)
npx expo start --web

# Clear cache
npx expo start -c

# Type check
npm run type-check

# Lint
npm run lint
```

---

## Folder Structure

```
apps/mobile/
├── src/
│   ├── app/               # Expo Router screens
│   │   ├── (tabs)/       # Tab navigation
│   │   │   ├── index.tsx # Home screen
│   │   │   ├── aurora.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── plan.tsx
│   │   │   └── profile.tsx
│   │   ├── _layout.tsx   # Root layout
│   │   └── index.tsx     # Entry point
│   └── theme/            # Theme configuration
│       └── colors.ts
├── assets/               # Images, fonts, etc.
├── app.json             # Expo configuration
├── package.json
└── tsconfig.json
```

---

## Next Steps

Once you have the app running:

1. **Read the full plan:** [MOBILE_APP_PLAN.md](MOBILE_APP_PLAN.md)
2. **Set up Supabase client:** Create `src/lib/supabase.ts`
3. **Create auth screens:** `src/app/(auth)/login.tsx`
4. **Build first feature:** Garage sales list view

---

## Troubleshooting

### "Cannot find module"
```bash
cd apps/mobile
rm -rf node_modules
npm install
```

### "Metro bundler error"
```bash
npx expo start -c
```

### "Simulator not found" (iOS)
Make sure Xcode is installed:
```bash
xcode-select --install
```

### "Emulator not found" (Android)
Install Android Studio and set up an AVD (Android Virtual Device)

### Port already in use
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

---

## Resources

- **Expo Docs:** https://docs.expo.dev/
- **Expo Router:** https://docs.expo.dev/router/introduction/
- **React Native Docs:** https://reactnative.dev/
- **Full Mobile Plan:** [MOBILE_APP_PLAN.md](MOBILE_APP_PLAN.md)

---

**Having issues?** Check the [Expo troubleshooting guide](https://docs.expo.dev/troubleshooting/overview/)

**Ready to build features?** See [MOBILE_APP_PLAN.md](MOBILE_APP_PLAN.md) for the complete development roadmap.
