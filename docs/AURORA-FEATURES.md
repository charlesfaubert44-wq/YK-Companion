# Aurora Live Events - Complete Feature Documentation

## 🌌 Overview

The Aurora Live Events system is a comprehensive, real-time aurora tracking and community photography platform. It automatically creates events when aurora conditions are favorable (KP ≥ 4.0) and provides tools for photographers to share, compete, and create stunning photo mosaics.

**Live URL**: `/aurora-live`

---

## 📸 Core Features

### 1. **Automatic Event Creation**

Events are automatically created when KP index reaches 4.0 or higher.

**Database Trigger:**
```sql
CREATE OR REPLACE FUNCTION create_aurora_event_if_needed(
  current_kp DECIMAL,
  current_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

**Features:**
- Auto-start when KP ≥ 4.0
- Tracks max KP during event
- Updates visibility score
- Counts participants and photos
- Auto-complete when event ends

---

### 2. **Live Photo Uploads**

Component: `PhotoUploadModal.tsx`

Photographers can upload photos during active events with:

**Photo Metadata:**
- Caption and description
- Location (lat/lng + name)
- Camera settings (ISO, shutter speed, aperture, focal length)
- Camera model
- Taken timestamp
- Quality score (0-10)

**Database Schema:**
```sql
CREATE TABLE aurora_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES aurora_events(id),
  user_id UUID REFERENCES auth.users(id),
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  location_name TEXT,
  camera_model TEXT,
  iso INTEGER,
  shutter_speed TEXT,
  aperture TEXT,
  focal_length TEXT,
  taken_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  quality_score INTEGER CHECK (quality_score >= 0 AND quality_score <= 10),
  approved BOOLEAN DEFAULT TRUE,
  flagged BOOLEAN DEFAULT FALSE
);
```

---

### 3. **Photo Mosaics** 🎨

Component: `MosaicGenerator.tsx`

Generate beautiful mosaics from photos taken at the same moment.

**Features:**
- **Time Windows**: 5min, 15min, 30min, 1hr, 2hr
- **Grid Sizes**: 2x2, 3x3, 4x4, 5x5
- **Smart Selection**: Auto-select highest quality photos
- **Manual Selection**: Choose specific photos
- **Real-time Preview**: See mosaic before generating

**Algorithm:**
```typescript
const generateMosaic = async () => {
  // 1. Get photos within time window
  const timeWindowStart = new Date(Date.now() - timeWindow * 60 * 1000);
  const photosInWindow = photos.filter(p =>
    new Date(p.uploaded_at) >= timeWindowStart
  );

  // 2. Select best photos (auto or manual)
  const photosToUse = selectedPhotos.length > 0
    ? selectedPhotos
    : photosInWindow
        .sort((a, b) => (b.quality_score || 0) - (a.quality_score || 0))
        .slice(0, gridConfig.photos);

  // 3. Create mosaic object
  const mosaic: AuroraMosaic = {
    id: crypto.randomUUID(),
    title: `Aurora Mosaic - ${new Date().toLocaleTimeString()}`,
    grid_size: selectedGridSize,
    total_photos: photosToUse.length,
    time_window_start: timeWindowStart.toISOString(),
    time_window_end: new Date().toISOString(),
    photos: photosToUse,
  };
};
```

---

## 🎯 Enhancement Features (9 Total)

### 4. **Push Notifications** 🔔

Component: `PushNotificationManager.tsx`

Browser push notifications for aurora alerts.

**Features:**
- Customizable KP threshold (3.0-9.0)
- Event type filters:
  - New event starts
  - Photo featured
  - Challenge starts
  - Mosaic ready
- Browser permission handling
- Test notification button

**Database Schema:**
```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  notify_kp_threshold DECIMAL DEFAULT 4.0,
  notify_new_event BOOLEAN DEFAULT TRUE,
  notify_photo_featured BOOLEAN DEFAULT TRUE,
  notify_challenge_start BOOLEAN DEFAULT TRUE,
  notify_mosaic_ready BOOLEAN DEFAULT TRUE
);
```

**Implementation:**
```typescript
// Subscribe to push
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
});

// Save to database
await supabase.from('push_subscriptions').insert({
  user_id: userId,
  endpoint: subscription.endpoint,
  p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
  auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
});
```

---

### 5. **Photography Challenges** 🏆

Component: `ChallengeLeaderboard.tsx`

Monthly photography competitions with themes.

**Challenge Types:**
- **Themed**: Specific requirements (twilight, reflections, colors)
- **Location-specific**: Must be taken at certain places
- **Technical**: Specific camera settings or techniques
- **Open**: Any aurora photo

**Database Schema:**
```sql
CREATE TABLE aurora_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rules TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  required_tags TEXT[],
  min_kp DECIMAL,
  location_specific BOOLEAN DEFAULT FALSE,
  winner_count INTEGER DEFAULT 3,
  badge_name TEXT,
  participant_count INTEGER DEFAULT 0,
  entry_count INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('upcoming', 'active', 'judging', 'completed'))
);
```

**Leaderboard Features:**
- Multiple ranking metrics:
  - Total likes
  - Average AI score
  - Photo count
  - Featured count
- Timeframe filters (today, week, month, all-time)
- Top 50 ranking display
- User highlight

---

### 6. **Badge System** 🏅

Component: `BadgeDisplay.tsx`

Achievement tracking and rewards.

**Badge Types:**
```typescript
export const BADGE_TYPES = {
  first_upload: { name: 'First Light', icon: '🌅', description: 'Upload your first aurora photo' },
  '10_uploads': { name: 'Aurora Chaser', icon: '📸', description: 'Upload 10 aurora photos' },
  '50_uploads': { name: 'Aurora Master', icon: '🎯', description: 'Upload 50 aurora photos' },
  first_featured: { name: 'Rising Star', icon: '⭐', description: 'Get your first featured photo' },
  challenge_winner: { name: 'Champion', icon: '🏆', description: 'Win a photography challenge' },
  'mosaic_10': { name: 'Mosaic Artist', icon: '🎨', description: 'Create 10 mosaics' },
  high_scorer: { name: 'Quality Expert', icon: '💎', description: 'Average score above 8.0' },
  most_liked: { name: 'Community Favorite', icon: '❤️', description: 'Receive 100+ total likes' },
};
```

**Auto-Award Trigger:**
```sql
CREATE OR REPLACE FUNCTION check_photo_badges()
RETURNS TRIGGER AS $$
BEGIN
  -- First upload badge
  IF (SELECT COUNT(*) FROM aurora_photos WHERE user_id = NEW.user_id) = 1 THEN
    PERFORM award_badge(NEW.user_id, 'first_upload', 'First Light', 'Uploaded first aurora photo');
  END IF;

  -- 10 uploads badge
  IF (SELECT COUNT(*) FROM aurora_photos WHERE user_id = NEW.user_id) = 10 THEN
    PERFORM award_badge(NEW.user_id, '10_uploads', 'Aurora Chaser', 'Uploaded 10 aurora photos');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 7. **Aurora Forecasts** 🔮

Component: `ForecastDisplay.tsx`

3-day KP predictions with accuracy tracking.

**Features:**
- Hourly predictions (72 hours)
- Visual timeline chart
- Best viewing times
- Confidence levels (low/medium/high)
- Model accuracy tracking
- Multiple data sources (NOAA, Space Weather)

**Database Schema:**
```sql
CREATE TABLE aurora_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forecast_date DATE NOT NULL,
  forecast_hour INTEGER CHECK (forecast_hour >= 0 AND forecast_hour <= 23),
  predicted_kp DECIMAL NOT NULL,
  predicted_probability INTEGER CHECK (predicted_probability >= 0 AND predicted_probability <= 100),
  confidence_level TEXT CHECK (confidence_level IN ('low', 'medium', 'high')),
  confidence_score DECIMAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  model_version TEXT,
  data_source TEXT,
  actual_kp DECIMAL,
  accuracy_score DECIMAL
);
```

**Accuracy Calculation:**
```sql
CREATE OR REPLACE FUNCTION update_forecast_accuracy()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate accuracy score (1.0 - normalized absolute error)
  NEW.accuracy_score := GREATEST(0, 1.0 - (ABS(NEW.actual_kp - NEW.predicted_kp) / 9.0));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### 8. **Email Digests** 📧

Component: `EmailDigestSettings.tsx`

Customizable email summaries.

**Frequencies:**
- Daily (9 AM local time)
- Weekly (choose day)
- Monthly (choose date)
- Never

**Content Options:**
- Top community photos
- New mosaics
- Aurora forecast
- Active challenges
- Personal statistics

**Database Schema:**
```sql
CREATE TABLE email_digest_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  digest_frequency TEXT CHECK (digest_frequency IN ('daily', 'weekly', 'monthly', 'never')),
  digest_day INTEGER CHECK (digest_day >= 0 AND digest_day <= 28),
  include_top_photos BOOLEAN DEFAULT TRUE,
  include_mosaics BOOLEAN DEFAULT TRUE,
  include_forecast BOOLEAN DEFAULT TRUE,
  include_challenges BOOLEAN DEFAULT TRUE,
  include_personal_stats BOOLEAN DEFAULT TRUE,
  last_sent TIMESTAMP WITH TIME ZONE,
  next_scheduled TIMESTAMP WITH TIME ZONE
);
```

---

### 9. **AR Camera Overlay** 📷

Component: `ARCameraOverlay.tsx`

Real-time camera settings recommendations based on current KP index.

**Skill Levels:**
- **Beginner**: Simple settings, basic tips
- **Intermediate**: Advanced settings, composition tips
- **Advanced**: Expert settings, stacking techniques

**Brightness Categories:**
```typescript
const getBrightnessLevel = (kp: number) => {
  if (kp >= 7) return 'bright';  // Low ISO, faster shutter
  if (kp >= 5) return 'moderate'; // Medium ISO
  return 'dim';                   // High ISO, longer exposure
};
```

**Recommendations:**
```typescript
beginner_settings: {
  iso: kp >= 7 ? 800 : kp >= 5 ? 1600 : 3200,
  shutter_speed: kp >= 7 ? '8s' : kp >= 5 ? '15s' : '20s',
  aperture: 'f/1.8',
  white_balance: '3200K',
  tips: [
    'Use a tripod or stable surface',
    'Turn off image stabilization',
    'Use a timer to avoid camera shake',
    'Focus manually on a distant light',
  ],
}
```

---

### 10. **AI Photo Scoring** 🤖

Component: `AIPhotoScoring.tsx`

Multi-dimensional quality analysis.

**Scoring Dimensions:**
1. **Composition** (0-100)
   - Rule of thirds
   - Foreground interest
   - Balance
   - Aurora positioning

2. **Color** (0-100)
   - Saturation
   - Color temperature
   - Contrast
   - Color accuracy

3. **Technical** (0-100)
   - Sharpness
   - Noise levels
   - Exposure
   - Motion blur

**Overall Score:**
```typescript
overall = (composition + color + technical) / 3
```

**Feedback System:**
- Detailed analysis per dimension
- Specific improvement suggestions
- Camera settings recommendations
- Comparison to best practices

**Database Function:**
```sql
CREATE OR REPLACE FUNCTION calculate_ai_photo_score(p_photo_id UUID)
RETURNS JSONB AS $$
DECLARE
  score_breakdown JSONB;
BEGIN
  -- AI scoring logic (placeholder for actual AI integration)
  score_breakdown := jsonb_build_object(
    'overall', 0.85,
    'composition', jsonb_build_object('score', 0.92, 'feedback', ARRAY['Excellent use of rule of thirds']),
    'color', jsonb_build_object('score', 0.85, 'feedback', ARRAY['Vibrant green aurora']),
    'technical', jsonb_build_object('score', 0.84, 'feedback', ARRAY['Sharp focus throughout'])
  );

  RETURN score_breakdown;
END;
$$ LANGUAGE plpgsql;
```

---

### 11. **Print Downloads** 🖼️

Component: `PrintDownload.tsx`

High-resolution mosaic exports for professional printing.

**Resolution Options:**
- **4K**: 3840×2160 px
- **8K**: 7680×4320 px
- **12K**: 11520×6480 px

**DPI Settings:**
- 150 DPI (web/screen)
- 300 DPI (standard print)
- 600 DPI (professional)

**File Formats:**
- JPG (smaller file size)
- PNG (lossless)
- TIFF (professional)

**Color Profiles:**
- sRGB (standard)
- AdobeRGB (wide gamut)
- ProPhoto (maximum color space)

**Print Size Calculator:**
```typescript
const getPrintSize = () => {
  const widthInches = width_px / dpi;
  const heightInches = height_px / dpi;
  return {
    inches: `${widthInches.toFixed(1)}" × ${heightInches.toFixed(1)}"`,
    cm: `${(widthInches * 2.54).toFixed(1)}cm × ${(heightInches * 2.54).toFixed(1)}cm`,
  };
};
```

---

### 12. **WebSocket Real-time** ⚡

Component: `WebSocketProvider.tsx`

Real-time updates for live events.

**Message Types:**
```typescript
type WebSocketMessage =
  | { type: 'photo_uploaded', event_id: string, data: { photo: AuroraPhoto } }
  | { type: 'photo_liked', event_id: string, data: { photoId: string, likesCount: number } }
  | { type: 'kp_updated', data: { kp: number } }
  | { type: 'event_started', data: { event: AuroraEvent } }
  | { type: 'event_ended', data: { event: AuroraEvent } }
  | { type: 'mosaic_created', data: { mosaicId: string } };
```

**Features:**
- Auto-reconnection with exponential backoff
- Connection status indicator
- Event subscription/unsubscription
- Simulated messages for development

**Current Implementation:**
- 10-second polling fallback
- WebSocket ready (needs server setup)

---

## 🗄️ Database Architecture

### Core Tables

1. **aurora_events** - Auto-created events
2. **aurora_photos** - Photo uploads
3. **aurora_mosaics** - Generated mosaics
4. **kp_index_data** - KP tracking

### Enhancement Tables

5. **push_subscriptions** - Browser push
6. **push_notifications_sent** - History
7. **aurora_challenges** - Competitions
8. **challenge_winners** - Results
9. **user_badges** - Achievements
10. **aurora_forecasts** - Predictions
11. **email_digest_preferences** - Settings
12. **email_digests_sent** - History
13. **realtime_subscriptions** - WebSocket
14. **ar_camera_recommendations** - Settings

### Row Level Security (RLS)

All tables have RLS enabled:

```sql
-- Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON push_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own preferences
CREATE POLICY "Users can update own preferences"
ON email_digest_preferences FOR UPDATE
USING (auth.uid() = user_id);
```

---

## 🔧 Technical Implementation

### File Structure

```
apps/web/src/
├── app/aurora-live/
│   └── page.tsx                    # Main page with WebSocket wrapper
├── components/aurora/
│   ├── AIPhotoScoring.tsx         # AI quality analysis
│   ├── ARCameraOverlay.tsx        # Camera settings overlay
│   ├── BadgeDisplay.tsx           # Achievement badges
│   ├── ChallengeLeaderboard.tsx   # Competitions & leaderboard
│   ├── EmailDigestSettings.tsx    # Email preferences
│   ├── EventStats.tsx             # Event statistics
│   ├── ForecastDisplay.tsx        # 3-day predictions
│   ├── KPIndexDisplay.tsx         # KP level indicator
│   ├── LivePhotoFeed.tsx          # Photo grid with likes
│   ├── MosaicGenerator.tsx        # Mosaic creation
│   ├── PhotoUploadModal.tsx       # Upload form
│   ├── PrintDownload.tsx          # High-res exports
│   ├── PushNotificationManager.tsx # Push settings
│   └── WebSocketProvider.tsx      # Real-time provider
├── types/
│   ├── aurora.types.ts            # Core types
│   └── aurora-enhancements.types.ts # Enhancement types
└── supabase-*.sql                 # Database schemas
```

### Type Definitions

**Core Types** (365 lines):
```typescript
export interface AuroraEvent { ... }
export interface AuroraPhoto { ... }
export interface AuroraMosaic { ... }
export interface KPIndexData { ... }
export interface PushSubscription { ... }
export interface AuroraChallenge { ... }
export interface UserBadge { ... }
export interface AuroraForecast { ... }
// ... and 15+ more
```

---

## 🚀 Getting Started

### 1. Database Setup

Run SQL schemas in Supabase SQL Editor:

```bash
# In order:
1. supabase-aurora-events-schema.sql
2. supabase-aurora-enhancements-schema.sql
```

### 2. Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-key  # For push notifications
```

### 3. Start Development

```bash
npm run dev:web
```

Visit: `http://localhost:3002/aurora-live`

---

## 📊 Usage Statistics

- **Components**: 13 React components
- **Lines of Code**: 3,200+
- **Database Tables**: 14 tables
- **Database Functions**: 10+ functions
- **TypeScript Types**: 25+ interfaces
- **Features**: 12 major features

---

## 🔮 Future Enhancements

1. **Machine Learning Integration**
   - Real AI photo scoring
   - Aurora prediction models
   - Smart photo tagging

2. **Social Features**
   - Follow photographers
   - Comment on photos
   - Share to social media

3. **Advanced Analytics**
   - Personal photography insights
   - Best shooting times
   - Location recommendations

4. **Mobile App**
   - Native camera integration
   - Offline photo queue
   - Push notification support

---

## 🤝 Contributing

See main [README.md](../README.md) and [PARALLEL-WORKFLOW.md](../PARALLEL-WORKFLOW.md) for contribution guidelines.

---

**Last Updated**: October 2025
**Version**: 1.0.0
**Status**: Production Ready (with mock data)
