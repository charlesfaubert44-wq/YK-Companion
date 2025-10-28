# Weather Feature Setup Guide

The YK Buddy header banner displays real-time weather data for Yellowknife using the OpenWeatherMap API.

## Current Status

❌ **Weather API Not Configured** - The banner is currently showing fallback seasonal temperatures.

## Quick Setup (5 minutes)

### Step 1: Get a Free API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" (it's free!)
3. Create an account
4. Go to your [API Keys page](https://home.openweathermap.org/api_keys)
5. Copy your API key (starts with something like `a1b2c3d4e5f6...`)

### Step 2: Add the API Key to Your Project

1. Open `apps/web/.env.local`
2. Add this line (replace with your actual API key):
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your-api-key-here
   ```
3. Save the file
4. Restart your development server:
   ```bash
   npm run dev
   ```

### Step 3: Verify It's Working

1. Open the app in your browser
2. Look at the top-left of the header banner
3. You should see:
   - Current Yellowknife temperature (e.g., "-15°C")
   - Weather emoji (☀️, ❄️, ☁️, etc.)
   - On hover: feels-like temp, humidity, wind speed

## Features

### Interactive Weather Display

- **Real-time temperature** for Yellowknife, NT
- **Weather conditions** with emoji icons
- **Hover to expand** - shows humidity, wind speed, feels-like temperature
- **Auto-refresh** every 10 minutes
- **Fallback data** - uses seasonal averages if API fails

### What The Banner Shows

- Top-left corner: Temperature widget with current conditions
- Center: "YK BUDDY" logo with aurora effects
- Bottom: Random Yellowknife slogan
- Hover effects: Aurora animations intensify, weather details expand

## Troubleshooting

### Weather Not Showing?

1. **Check your API key** - Make sure it's in `.env.local`
2. **Wait a few minutes** - New OpenWeatherMap keys can take 10-15 minutes to activate
3. **Check browser console** - Look for error messages
4. **Restart dev server** - Environment variables need a restart to load

### Still Seeing "-28°C"?

That's the fallback temperature for winter. It means:
- The API key is not set, or
- The API request failed, or
- You're in the initial loading state

Check your browser's developer console (F12) for error messages.

## API Limits

- **Free tier**: 1,000 API calls per day
- **Our usage**: ~144 calls per day (every 10 minutes)
- **Cost**: $0 (well within free tier limits)

## Optional: Production Setup

For Vercel deployment, add the environment variable in your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `NEXT_PUBLIC_OPENWEATHER_API_KEY` with your API key
4. Redeploy

---

**Questions?** Check the OpenWeatherMap [documentation](https://openweathermap.org/api) or the console for errors.
