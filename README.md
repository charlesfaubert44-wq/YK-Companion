# YK Buddy - Your Yellowknife Companion

**Because Nobody Should Face -40° Alone**

> Your friendly multilingual platform for exploring Yellowknife - whether you're visiting, living here, or planning to move.

[![Status](https://img.shields.io/badge/status-production%20ready-success)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Next.js](https://img.shields.io/badge/Next.js-14-black)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)]()

---

## 🌟 Quick Links

- **📖 Documentation:** [CURRENT_FEATURES.md](./CURRENT_FEATURES.md) - Complete feature list
- **🚀 Deployment:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment instructions
- **⚡ Quick Start:** [QUICK_START.md](./QUICK_START.md) - Get online in 1 hour
- **🗄️ Database:** [docs/database-schema.md](./docs/database-schema.md) - Schema documentation
- **📦 Archived:** [ARCHIVED_FEATURES.md](./ARCHIVED_FEATURES.md) - Removed features

---

## 🎯 What is YK Buddy?

YK Buddy is a community platform for Yellowknife, Northwest Territories that serves three distinct user groups:

### 🧳 Visitors
- Aurora viewing information
- Trip planning resources
- Seasonal guides
- Tourist attractions

### 🏠 Residents
- **Garage Sale Planner** with map and route optimization
- Local events and activities
- Community resources
- Insider tips

### 📦 People Moving Here
- Housing market insights
- Job opportunities
- **Cost of Living Calculator**
- Moving checklists
- Newcomer guides

---

## ✨ Key Features

### 🌐 Multilingual Support (9 Languages)
- English 🇬🇧
- Français 🇫🇷
- 中文 🇨🇳
- 日本語 🇯🇵
- 한국어 🇰🇷
- Español 🇪🇸
- Deutsch 🇩🇪
- Tiếng Việt 🇻🇳
- Tagalog 🇵🇭

**Implementation:** Language context with localStorage persistence, easy to add more languages

### ✨ Premium Spotlight System
**Monetization** through animated northern lights sponsor placements

- Interactive aurora background (flowing gradients)
- Golden shimmer sponsor text
- Position-based pricing (home, visiting, living, moving)
- Admin dashboard with real-time pricing calculator
- Volume discounts (7+, 30+, 90+ days)
- Payment tracking

**Revenue Potential:** ~$3,800/month with just 10 sponsors

### 🏘️ Garage Sale Planner
**Smart route planning** for local garage sales

- Interactive Mapbox map
- Calendar view
- Distance calculations
- Smart itinerary building
- Save favorites

### 🎨 Northern-Themed Design
- Custom animated icons (Bush Plane, Northern Cabin, Old Truck)
- Aurora color palette
- Seasonal banner system
- Mobile-responsive
- Touch-friendly interface

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React 18** - UI library

### Backend & Database
- **Supabase** - PostgreSQL database
- **Supabase Auth** - User authentication
- **Row Level Security** - Data protection

### Maps & Location
- **Mapbox GL** - Interactive maps
- **Geolocation** - Distance calculations

### Deployment
- **Vercel** - Hosting and CI/CD
- **Custom Domain Ready** - ykbuddy.com

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/charlesfaubert44-wq/YK-Companion.git
cd YK-Companion

# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev:web

# Open http://localhost:3002
```

### Key Development URLs
- **Home**: http://localhost:3002/
- **About**: http://localhost:3002/about
- **Contact**: http://localhost:3002/contact
- **Garage Sales**: http://localhost:3002/living/garage-sales
- **Admin**: http://localhost:3002/admin

---

## 📁 Project Structure

```
YK-Companion/
├── apps/
│   └── web/                    # Next.js app (ACTIVE)
│       ├── src/
│       │   ├── app/           # Pages
│       │   │   ├── about/
│       │   │   ├── contact/
│       │   │   ├── admin/     # Admin dashboard
│       │   │   │   ├── sponsors/
│       │   │   │   └── pricing-plans/
│       │   │   ├── living/
│       │   │   │   └── garage-sales/
│       │   │   ├── moving/
│       │   │   └── visiting/
│       │   ├── components/
│       │   │   ├── PremiumSpotlight.tsx
│       │   │   ├── LanguageSelector.tsx
│       │   │   ├── NorthernIcons.tsx
│       │   │   └── garage-sales/
│       │   ├── contexts/
│       │   │   ├── AuthContext.tsx
│       │   │   └── LanguageContext.tsx
│       │   └── styles/
│       └── package.json
├── supabase/
│   └── migrations/            # Database migrations
│       ├── 20250123000001_profiles.sql
│       ├── 20250123000002_garage_sales.sql
│       └── 20250124000003_premium_sponsors.sql
├── docs/                      # Documentation
├── CURRENT_FEATURES.md       # What exists now
├── ARCHIVED_FEATURES.md      # What was removed
├── DEPLOYMENT_GUIDE.md       # Full deployment guide
├── QUICK_START.md           # 1-hour deployment
└── README.md                # This file
```

---

## 🗄️ Database Schema

**Active Tables:** 4

1. **profiles** - User information (linked to Supabase Auth)
2. **garage_sales** - Community garage sale listings
3. **premium_sponsors** - Premium spotlight placements
4. **premium_pricing_plans** - Configurable pricing structure

See [docs/database-schema.md](./docs/database-schema.md) for full schema.

---

## 🌐 Deployment

### Production Stack (Recommended)
- **Domain:** ykbuddy.com (~$10/year)
- **Hosting:** Vercel (FREE tier)
- **Database:** Supabase (FREE tier)
- **Total:** ~$1/month!

### Deployment Steps

1. **Quick Start** (1 hour): See [QUICK_START.md](./QUICK_START.md)
2. **Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Production URL
Coming soon: https://ykbuddy.com

---

## 📊 Current Status

### ✅ Completed Features
- [x] Multilingual support (9 languages)
- [x] Premium Spotlight system with admin dashboard
- [x] Garage sale planner with maps
- [x] About & Contact pages
- [x] User authentication
- [x] Custom northern-themed icons
- [x] Seasonal banner system
- [x] Mobile-responsive design
- [x] Production-ready deployment config

### 🚧 In Progress
- [ ] Email notifications for sponsors
- [ ] Payment integration (Stripe)
- [ ] Google Analytics
- [ ] SEO optimization

### 📋 Planned Features
- [ ] Event calendar
- [ ] Business directory
- [ ] Housing listings
- [ ] Job board
- [ ] Community reviews

---

## 💰 Business Model

### Revenue Streams

**Primary:** Premium Spotlight Placements

**Pricing Example:**
- Position: Home Top
- Duration: 30 days
- Base: $15/day × 30 days = $450
- Discount (30+ days): 15% off = -$67.50
- **Total:** $382.50

**With 10 sponsors/month:** ~$3,825/month revenue
**Monthly costs:** ~$1 (domain only on free tiers)
**Profit:** ~$3,824/month 💰

---

## 🎨 Brand Identity

**Slogan:** "Because Nobody Should Face -40° Alone"

**Voice:** Friendly, conversational, slightly humorous

**Colors:**
- Aurora Green: #10B981, #34D399
- Aurora Blue: #3B82F6, #60A5FA
- Aurora Purple: #8B5CF6, #A78BFA
- Northern Midnight: #0A1128
- Buddy Gold: #FFD700

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 📚 Documentation

- **[CURRENT_FEATURES.md](./CURRENT_FEATURES.md)** - Complete current feature list
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- **[QUICK_START.md](./QUICK_START.md)** - Get online in 1 hour
- **[ARCHIVED_FEATURES.md](./ARCHIVED_FEATURES.md)** - Features that were removed
- **[docs/database-schema.md](./docs/database-schema.md)** - Database schema

---

## 📧 Contact

- **Email:** hello@ykbuddy.ca (coming soon)
- **Location:** Yellowknife, Northwest Territories, Canada
- **Territory:** Traditional territory of the Yellowknives Dene First Nation

---

**Made with ❤️ in Yellowknife**

**Version:** 1.0.0
**Last Updated:** January 2025
**Status:** Production Ready
**Next Milestone:** Deploy to ykbuddy.com 🚀
