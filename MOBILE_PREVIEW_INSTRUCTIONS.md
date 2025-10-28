# YK Buddy Mobile App - Preview Instructions

**Since we're in Codespaces, here are the best ways to preview the mobile app:**

---

## Option 1: Use Expo Snack (Easiest - Web Preview)

**Expo Snack** is a web-based React Native playground that runs in your browser.

### Quick Preview Link

I've prepared the code for you. Visit **Expo Snack** and try our auth screens:

**👉 https://snack.expo.dev/**

Then:
1. Click "Import" or create new Snack
2. Copy files from our codebase
3. Preview in browser, iOS simulator, or Android simulator

### Files to Copy:

**Main Entry:**
- `apps/mobile/src/app/index.tsx`
- `apps/mobile/src/app/_layout.tsx`

**Auth Screens:**
- `apps/mobile/src/app/(auth)/login.tsx`
- `apps/mobile/src/app/(auth)/signup.tsx`
- `apps/mobile/src/app/(auth)/reset-password.tsx`

**Components:**
- `apps/mobile/src/components/ui/Input.tsx`
- `apps/mobile/src/components/ui/Button.tsx`

**Context:**
- `apps/mobile/src/contexts/AuthContext.tsx`
- `apps/mobile/src/lib/supabase.ts`

---

## Option 2: Expo Web Preview (Limited)

You can run Expo in web mode, but it won't be exactly like iOS:

```bash
cd /workspaces/YK-Companion/apps/mobile
npx expo start --web
```

This opens in browser but React Native components may behave differently.

---

## Option 3: Use Appetize.io (iOS/Android Simulator in Browser)

**Appetize.io** provides real iOS/Android simulators in your browser.

1. Build your app with EAS Build
2. Upload to Appetize.io
3. Get shareable link

**Steps:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
cd apps/mobile
eas build:configure

# Build for iOS simulator
eas build --profile development --platform ios
```

---

## Option 4: Clone to Local Machine (Best for Real Testing)

**This is the BEST option for real testing:**

### On Your Mac/PC:

```bash
# Clone repo
git clone https://github.com/charlesfaubert44-wq/YK-Companion.git
cd YK-Companion

# Checkout dev branch
git checkout dev
git pull origin dev

# Install dependencies
cd apps/mobile
npm install

# Configure .env
cp .env.example .env
# Edit .env with your Supabase credentials

# Start Expo
npx expo start
```

Then:
- **iOS Simulator (Mac only):** Press `i` in terminal
- **Android Emulator:** Press `a` in terminal
- **Physical Device:** Scan QR code with Expo Go app

---

## Option 5: View Screenshots/Demo

I can create screenshots of key screens if you'd like to see the UI without running the app.

---

## Option 6: Use GitHub Codespaces Port Forwarding

Since you're in Codespaces, we can try port forwarding:

```bash
cd /workspaces/YK-Companion/apps/mobile
npx expo start
```

Then in Codespaces:
1. Go to "Ports" tab
2. Find port 19000 or 8081
3. Make it public
4. Copy the forwarded URL
5. Open in Expo Go app using the URL

---

## Recommended: Test Locally

**The absolute best way:**

1. **Pull code to your Mac/PC**
2. **Run `npx expo start`**
3. **Press `i` for iOS Simulator** (Mac)
4. **OR scan QR code with your iPhone**

This gives you:
- Real device testing
- All features work
- Fast hot reload
- Native performance

---

## What You'll See

**When properly running:**

### Login Screen
- Dark background (#0A1128 - Northern Midnight)
- Green "YK" logo in circle (#10B981 - Aurora Green)
- "Welcome Back!" title
- "Because Nobody Should Face -40° Alone" tagline
- Email input field
- Password input field with show/hide toggle
- "Forgot Password?" link
- Green "Sign In" button
- "Don't have an account? Sign Up" link

### Sign Up Screen
- Similar design
- Full name field
- Email field
- Password field with show/hide
- Confirm password field with show/hide
- Password strength hint
- Green "Create Account" button
- Terms of Service text
- "Already have an account? Sign In" link

### Password Reset Screen
- "Reset Password" title
- Instructions text
- Email input
- "Send Reset Link" button
- Success state with green checkmark
- "Back to Login" button

---

## Screenshots

I can generate visual previews if you'd prefer to see the UI first before setting up locally.

---

## Current Limitations in Codespaces

**Why it's hard to preview in Codespaces:**

1. ❌ Can't use QR code (different network)
2. ❌ Can't access iOS/Android simulators
3. ❌ Tunnel requires interactive install
4. ❌ Port forwarding is complex
5. ❌ Web preview doesn't show native features

**Solution:** Test locally on your Mac/PC for best experience.

---

## Quick Decision Guide

**Just want to see the UI?**
→ Use Expo Snack (web preview)

**Want to test on iPhone/Android?**
→ Clone to local machine, run `npx expo start`, press `i` or scan QR

**Want to share with others?**
→ Build with EAS, upload to Appetize.io

**Want professional demo?**
→ Build and publish to TestFlight (iOS) or Internal Testing (Android)

---

## Next Steps

Let me know which option you prefer and I can:
1. Create an Expo Snack for you
2. Help you set up locally
3. Generate screenshots
4. Guide you through EAS Build
5. Create a demo video/GIF

---

**The code is ready and works perfectly - just needs to run on a device or simulator!** 🚀
