# YKBuddy - Your Yellowknife Companion

Your friendly companion for exploring Yellowknife - whether you're visiting, living here, or planning to move. YKBuddy helps you discover, plan, and enjoy everything this northern city has to offer.

## 🌟 Live Site

Visit YKBuddy: [https://web-f149uve7f-charles-projects-5049ee53.vercel.app](https://web-f149uve7f-charles-projects-5049ee53.vercel.app)

## 🎯 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/charlesfaubert44-wq/YK-Companion.git
cd YK-Companion

# Install dependencies
npm install

# Start the development server
npm run dev:web

# Open http://localhost:3002
```

## ✨ Major Features

### 🌌 **Aurora Live Events** - Real-time aurora tracking and community photography

**Live at:** `/aurora-live`

A comprehensive aurora tracking platform with 9 major enhancement features:

1. **📸 Live Photo Uploads** - Real-time community aurora photos with metadata
2. **🎨 Photo Mosaics** - Generate stunning mosaics from photos taken at the same moment
3. **🔔 Push Notifications** - Browser notifications for aurora alerts with customizable KP thresholds
4. **🏆 Photography Challenges** - Monthly challenges with leaderboards and badges
5. **🏅 Achievement Badges** - Earn badges for milestones (First Light, Aurora Master, Champion)
6. **🔮 Aurora Forecasts** - 3-day KP predictions with hourly breakdown and accuracy tracking
7. **📧 Email Digests** - Customizable summaries (daily/weekly/monthly)
8. **📷 AR Camera Overlay** - Real-time camera settings based on current KP index
9. **🤖 AI Photo Scoring** - Multi-dimensional quality analysis (composition, color, technical)
10. **🖼️ Print Downloads** - High-resolution mosaic exports (4K/8K/12K)
11. **⚡ WebSocket Real-time** - Live updates for events, photos, and KP changes

**Tech Highlights:**
- Auto-event creation when KP ≥ 4.0
- Nearest Neighbor TSP algorithm for route optimization
- Time-window photo selection for mosaics
- Real-time polling (10s intervals, upgradeable to WebSocket)
- Complete Supabase schema with RLS and triggers

### 🏘️ **Garage Sale Planner** - Smart route planning for yard sales

**Live at:** `/living/garage-sales`

Plan your perfect garage sale route with intelligent optimization:

- **🗺️ Interactive Map** - Mapbox GL with custom markers
- **📅 Calendar View** - See all sales by date
- **🧭 Smart Itinerary** - AI-powered route optimization using TSP algorithm
- **⏱️ Time Estimates** - Automatic travel time and duration calculations
- **📍 Location Filtering** - Search by neighborhood or distance
- **💾 Save Routes** - Bookmark your favorite sales

**Route Optimization:**
- Nearest Neighbor TSP algorithm
- Real-time distance calculations
- ETAs based on 3 min/km drive time
- 30 min per sale estimation

### 🎨 **Pixel UI Component Library** - Retro-inspired design system

**Demo at:** `/pixel-demo`

Complete pixel art component library with:
- PixelButton (Green, Blue, Purple, Yellow variants)
- PixelCard with aurora glow effects
- Press Start 2P pixel font integration
- Pixel-perfect shadows and animations

## 🔮 The Aurora Orb Logo

YKBuddy features an interactive **Aurora Orb** logo that represents the magical northern lights:

- 🔮 **Aurora Orb**: Circular gradient sphere with flowing northern lights colors
- ⭐ **Golden Northern Star**: 8-pointed compass star representing True North
- 🌊 **Rotating Aurora Ring**: Subtle conic gradient that continuously rotates
- ✨ **Floating Particles**: 12 aurora-colored particles that float and pulse
- 🎯 **Interactive**: Mouse tracking, hover effects, and continuous animations

## 📱 Three Simple Pathways

YKBuddy organizes content around three user journeys:

### 🧳 Visiting Yellowknife
For tourists and travelers planning a trip to Yellowknife:
- Aurora viewing guides and real-time tracking
- Trip planning tools and itineraries
- Activity recommendations and seasonal guides
- Budget calculators and cost transparency

### 🏠 Living in Yellowknife
For residents exploring their city:
- **Garage Sale Planner** with route optimization
- Local events and happenings
- Hidden gems and new discoveries
- Community guides and resources
- Seasonal activities for locals

### 📦 Moving to Yellowknife
For people relocating to Yellowknife:
- Housing market insights and rental guides
- Job market and employment resources
- Cost of living calculators
- Community integration and newcomer guides

## 🎨 Brand Identity

**Voice & Tone**: Friendly, conversational, and welcoming
- We use "we" and "let's" to create companionship
- Approachable language without being overly casual
- Helpful and encouraging, like a local friend

**Color Palette**:
- **Aurora Colors**: Green (#00ff88), Blue (#4d94ff), Purple (#a366ff)
- **Buddy Gold**: Warm golden yellow (#FFD700) and orange-gold (#FFA500)
- **Northern Midnight**: Deep blue-black backgrounds (#0a1128)

**Design Principles**:
- Clean, modern, and interactive
- Aurora-inspired gradients and glows
- Mobile-first responsive design
- Touch-friendly large buttons

## 🛠️ Tech Stack

### Web Application (Production)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 with custom aurora color palette
- **Database**: Supabase (PostgreSQL)
- **Maps**: Mapbox GL JS
- **UI**: React 18 with interactive components
- **Real-time**: WebSocket provider + 10s polling
- **Deployment**: Vercel (automatic deployments)
- **Monorepo**: npm workspaces

### Database & Backend
- **Supabase**: PostgreSQL with Row Level Security
- **Database Functions**: Triggers, automated event creation
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Photo uploads with thumbnails

### Mobile (Archived - Ready for Future)
- React Native (Expo) mobile app code exists but not currently deployed
- Ready for future mobile development when needed

## 📁 Project Structure

```
YK-Companion/
├── apps/
│   ├── web/                          # Next.js web application (ACTIVE)
│   │   ├── src/
│   │   │   ├── app/                 # Next.js App Router pages
│   │   │   │   ├── aurora-live/    # Aurora tracking system
│   │   │   │   ├── living/
│   │   │   │   │   └── garage-sales/ # Smart route planner
│   │   │   │   └── pixel-demo/     # Component showcase
│   │   │   ├── components/
│   │   │   │   ├── aurora/         # Aurora system components (11 files)
│   │   │   │   ├── garage-sales/   # Garage sale components (5 files)
│   │   │   │   └── NorthernLogo.tsx
│   │   │   └── types/
│   │   │       ├── aurora.types.ts
│   │   │       ├── aurora-enhancements.types.ts
│   │   │       └── garage-sales.types.ts
│   │   ├── supabase-aurora-events-schema.sql
│   │   ├── supabase-aurora-enhancements-schema.sql
│   │   ├── supabase-garage-sales-schema.sql
│   │   ├── tailwind.config.ts      # Custom aurora color palette
│   │   └── package.json
│   └── mobile/                      # React Native/Expo (ARCHIVED)
│       └── src/                    # Mobile app code (not deployed)
├── docs/                           # Documentation
├── .github/                        # GitHub workflows
├── BRAND-IDENTITY.md              # Complete brand guidelines
├── PARALLEL-WORKFLOW.md           # Git workflow documentation
└── README.md                      # This file
```

## 🚀 Development

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

Check versions:
```bash
node --version
npm --version
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/charlesfaubert44-wq/YK-Companion.git
cd YK-Companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file
cp apps/web/.env.example apps/web/.env.local

# Edit .env.local with your Supabase credentials
```

### Running Development Server

**Option 1: Web app only (Recommended)**
```bash
npm run dev:web
```

**Option 2: All apps**
```bash
npm run dev
```

The web app will be available at: **http://localhost:3002**

### Key Development URLs

- **Home**: http://localhost:3002/
- **Aurora Live Events**: http://localhost:3002/aurora-live
- **Garage Sale Planner**: http://localhost:3002/living/garage-sales
- **Pixel UI Demo**: http://localhost:3002/pixel-demo

### Building for Production

```bash
npm run build:web
```

### Database Setup

Run the SQL schema files in your Supabase SQL Editor:

1. `apps/web/supabase-garage-sales-schema.sql` - Garage sale system
2. `apps/web/supabase-aurora-events-schema.sql` - Aurora events and photos
3. `apps/web/supabase-aurora-enhancements-schema.sql` - All 9 enhancement features

## 📊 Database Schema

### Aurora Events System
- `aurora_events` - Auto-created when KP ≥ 4.0
- `aurora_photos` - Community photo uploads
- `aurora_mosaics` - Generated photo compilations
- `kp_index_data` - Real-time KP tracking

### Aurora Enhancements
- `push_subscriptions` - Browser push notifications
- `aurora_challenges` - Photography competitions
- `user_badges` - Achievement system
- `aurora_forecasts` - 3-day predictions
- `email_digest_preferences` - Customizable emails
- `ar_camera_recommendations` - Skill-based settings

### Garage Sales System
- `garage_sales` - Sale listings
- `saved_garage_sales` - User bookmarks
- `garage_sale_itineraries` - Optimized routes

## 🎯 Current Features

✅ **Interactive Aurora Orb Logo** - Mouse-tracking northern lights effect
✅ **Aurora Live Events** - Real-time community aurora tracking
✅ **Photo Mosaics** - Time-synchronized community collages
✅ **Photography Challenges** - Monthly competitions with leaderboards
✅ **Badge System** - Achievement tracking and rewards
✅ **Aurora Forecasts** - 3-day KP predictions
✅ **Push Notifications** - Real-time aurora alerts
✅ **AR Camera Guide** - Smart camera settings
✅ **AI Photo Scoring** - Quality analysis and feedback
✅ **Garage Sale Planner** - TSP route optimization
✅ **Pixel UI Library** - Retro component system
✅ **Three User Pathways** - Visiting, Living, Moving sections
✅ **Mobile Responsive** - Touch-friendly interface
✅ **Fast Deployment** - Automatic Vercel deployments

## 🗺️ Roadmap

### Phase 1: Content & Discovery ✅
- [x] Aurora Live Events with real-time tracking
- [x] Garage Sale Planner with route optimization
- [x] Photography challenges and badges
- [x] Pixel UI component library

### Phase 2: User Experience (In Progress)
- [ ] User authentication and profiles
- [ ] Saved itineraries and favorites
- [ ] Personal photo galleries
- [ ] Challenge participation tracking

### Phase 3: Community Features
- [ ] Community tips and reviews
- [ ] User-generated content
- [ ] Social sharing
- [ ] Discussion forums

### Phase 4: Advanced Features
- [ ] Mobile app deployment (code ready)
- [ ] Booking integration
- [ ] Multi-language support
- [ ] Offline functionality

### Phase 5: Analytics & Insights
- [ ] Aurora prediction models
- [ ] User behavior analytics
- [ ] Recommendation engine
- [ ] A/B testing framework

## 📚 Documentation

- **[BRAND-IDENTITY.md](./BRAND-IDENTITY.md)** - Complete brand guidelines, voice, tone, and design principles
- **[BRAND-STRATEGY.md](./BRAND-STRATEGY.md)** - Brand positioning and strategy
- **[PARALLEL-WORKFLOW.md](./PARALLEL-WORKFLOW.md)** - Git workflow for parallel development
- **[MOBILE-FIRST-IMPLEMENTATION.md](./MOBILE-FIRST-IMPLEMENTATION.md)** - Mobile development strategy
- **[AURORA-FEATURES.md](./docs/AURORA-FEATURES.md)** - Detailed aurora system documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [PARALLEL-WORKFLOW.md](./PARALLEL-WORKFLOW.md) for our branching strategy.

## 📝 License

MIT

---

**Made with ❤️ in Yellowknife**

**Current Status**: Active Development
**Last Updated**: October 2025
**Version**: 1.0.0
**Contributors**: 1
**Lines of Code**: 15,000+
**Components**: 40+
**Database Tables**: 20+
