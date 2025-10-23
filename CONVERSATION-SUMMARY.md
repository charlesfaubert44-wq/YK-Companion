# YK-Companion Project - Conversation Summary

## Project Overview
**YK-Companion** - A beautiful pixel art-themed Progressive Web App for Yellowknife, Northwest Territories, featuring dynamic seasonal design that changes based on the four seasons.

**Repository**: https://github.com/charlesfaubert44-wq/YK-Companion
**Branch**: v2 (ready to push)
**Current Working Branch**: `claude/clear-repository-011CUPQLGokp3s2i9ztc76Qr`

---

## What We Built

### Core Features
1. **Dynamic Seasonal Design System**
   - Automatic season detection based on current month
   - 4 distinct themes: Winter ❄️, Spring 🌸, Summer ☀️, Fall 🍂
   - Smooth transitions between seasons (1 second CSS animations)
   - Manual season switcher with localStorage persistence

2. **Interactive Pixel Art Lake Scene**
   - Great Slave Lake with houseboat
   - Season-specific variations:
     - **Winter**: Frozen ice with cracks, snowfall animation, warm cabin lights
     - **Spring**: Ice breakup colors, interactive trout
     - **Summer**: Vibrant water, midnight sun, jumping trout (click to interact)
     - **Fall**: Autumn colors, falling leaves animation
   - Click counter for fish jumps in summer/spring

3. **Responsive Design**
   - Mobile-first approach
   - Optimized for all mobile devices
   - Touch-friendly interactions
   - PWA-ready with manifest

4. **Three Main Sections**
   - **Living Here**: Community life, services, weather, outdoor activities
   - **Moving Here**: Education, employment, housing, support networks
   - **Visiting**: Aurora viewing, photography, adventures, culture

---

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom YK theme
- **Icons**: Lucide React
- **Fonts**: Inter, Poppins, Press Start 2P (pixel font)
- **Build Tool**: Next.js built-in

---

## Project Structure

```
yk-companion/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main landing page with all sections
│   │   └── globals.css         # Global styles + seasonal themes
│   ├── components/
│   │   ├── Navbar.tsx          # Navigation with mobile menu
│   │   ├── Footer.tsx          # Footer component
│   │   ├── LakeScene.tsx       # Original lake scene (deprecated)
│   │   ├── SeasonalLakeScene.tsx  # Dynamic seasonal lake scene
│   │   ├── SeasonSelector.tsx  # Season switcher widget
│   │   └── PixelArt.tsx        # Reusable pixel art components
│   ├── hooks/
│   │   └── useSeason.ts        # Custom hook for season management
│   └── lib/
│       └── seasons.ts          # Season detection and theme definitions
├── public/
│   └── manifest.json           # PWA manifest
├── preview.html                # Standalone HTML preview (one file)
├── codepen-html.html           # HTML for CodePen
├── codepen-css.css             # CSS for CodePen
├── codepen-js.js               # JavaScript for CodePen
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind + custom YK colors
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS config
├── .gitignore                  # Git ignore rules
└── README.md                   # Full documentation

```

---

## Key Files Explained

### Season System
**src/lib/seasons.ts**
- Season detection based on month
- Season theme definitions with color palettes
- CSS variable generation

**src/hooks/useSeason.ts**
- React hook for season state management
- localStorage persistence
- Manual season override

**src/app/globals.css**
- Seasonal body backgrounds (`.season-winter`, `.season-spring`, etc.)
- Seasonal aurora effects
- Pixel art button/card styles
- Custom animations (aurora, float, fade-in)

### Components
**src/components/SeasonalLakeScene.tsx**
- Main interactive scene component
- 4 complete seasonal variations
- Click handler for trout jumping
- Snowfall/leaf animations
- Dynamic colors and effects

**src/components/SeasonSelector.tsx**
- Fixed bottom-right widget
- 4 season buttons with emojis
- Active state highlighting
- Gradient backgrounds per season

**src/app/page.tsx**
- Main landing page
- Hero section with stats
- Living/Moving/Visiting sections
- Integrates all components
- Season context provider

---

## Color Palette

### Winter (Nov-Mar)
- Primary: `#38bdf8` (Ice blue)
- Secondary: `#818cf8` (Aurora purple-blue)
- Accent: `#c084fc` (Purple)
- Background: `#0c1929` (Deep frozen)

### Spring (Apr-May)
- Primary: `#60a5fa` (Bright blue)
- Secondary: `#34d399` (Fresh green)
- Accent: `#fbbf24` (Warm yellow)
- Background: `#1e293b`

### Summer (Jun-Aug)
- Primary: `#22c55e` (Vibrant green)
- Secondary: `#fbbf24` (Midnight sun gold)
- Accent: `#f97316` (Warm orange)
- Background: `#1e3a2f` (Deep forest)

### Fall (Sep-Oct)
- Primary: `#f59e0b` (Autumn gold)
- Secondary: `#ef4444` (Fall red)
- Accent: `#8b5cf6` (Purple)
- Background: `#1c1917` (Rich brown-black)

---

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit http://localhost:3000

---

## Preview Options

### Option 1: Standalone HTML
Open `preview.html` in any browser - works offline, no build needed.

### Option 2: CodePen
1. Go to https://codepen.io/pen/
2. Copy content from:
   - `codepen-html.html` → HTML section
   - `codepen-css.css` → CSS section
   - `codepen-js.js` → JS section
3. Click Save

---

## Git History

### Commits Made
1. **Clear repository - delete all files**
   - Removed all previous files from nwt-bike-finder repo

2. **Build YK-Companion - Pixel Art Aurora-themed Mobile Web App**
   - Initial Next.js setup
   - Created components, layout, styling
   - Implemented base pixel art theme

3. **Add dynamic seasonal design system to YK-Companion**
   - Season detection utility
   - 4 seasonal themes with variations
   - Dynamic lake scene
   - Season selector widget

4. **Add standalone mobile preview HTML file**
   - Self-contained preview.html

5. **Add CodePen-ready files for mobile preview**
   - Separated HTML/CSS/JS for CodePen

---

## Current Status

### ✅ Completed
- All 4 seasonal themes working
- Interactive lake scene with animations
- Season selector widget
- Mobile-responsive design
- PWA manifest
- Preview files for CodePen
- Full documentation

### 🚧 Ready to Push
- Code is ready on branch: `claude/clear-repository-011CUPQLGokp3s2i9ztc76Qr`
- Target repo: https://github.com/charlesfaubert44-wq/YK-Companion
- Target branch: `v2`

### 📋 Manual Push Required
Due to proxy authorization, push manually:

```bash
cd /home/user/nwt-bike-finder

# Add remote
git remote add yk-new https://github.com/charlesfaubert44-wq/YK-Companion.git

# Push to v2 branch
git push -u yk-new HEAD:v2
```

---

## Interactive Features

1. **Season Switcher** (bottom-right corner)
   - Click any season emoji to change theme
   - Choice persists in localStorage
   - Smooth 1-second transitions

2. **Lake Scene Interactions**
   - Summer/Spring: Click lake to see trout jump
   - Winter: Animated snowfall
   - Fall: Falling leaves
   - All seasons: Floating houseboat animation

3. **Mobile Menu**
   - Hamburger menu on mobile
   - Smooth slide-down animation
   - Links to all sections

---

## Design Philosophy

- **Pixel Art Aesthetic**: Retro gaming meets Northern Lights
- **Seasonal Authenticity**: Colors and elements match real Yellowknife seasons
- **Mobile-First**: Optimized for phone screens
- **Performance**: Smooth animations, fast loading
- **Accessibility**: High contrast, readable fonts

---

## Next Steps / Ideas for Expansion

### Potential Features
- [ ] Add more pages (About, Contact, Events Calendar)
- [ ] Weather widget with real Yellowknife data
- [ ] Aurora forecast integration
- [ ] Photo gallery of Yellowknife
- [ ] Community events section
- [ ] Business directory
- [ ] Interactive map of attractions
- [ ] Blog/news section
- [ ] Language support (English/French/Indigenous languages)
- [ ] Dark/light mode toggle (in addition to seasons)

### Technical Improvements
- [ ] Add analytics
- [ ] Implement service worker for offline support
- [ ] Add loading states
- [ ] Error boundaries
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Social media meta tags
- [ ] Sitemap generation

### Design Enhancements
- [ ] More pixel art scenes (downtown, mines, aurora viewing)
- [ ] Character animations (people, wildlife)
- [ ] Sound effects (optional, toggle)
- [ ] More seasonal variations (northern lights intensity, etc.)
- [ ] Custom cursor designs
- [ ] Loading screen with pixel art

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  }
}
```

---

## Notes for New Conversation

1. **Project Location**: `/home/user/nwt-bike-finder`
2. **Active Branch**: `claude/clear-repository-011CUPQLGokp3s2i9ztc76Qr`
3. **Target Repo**: YK-Companion (needs manual push to v2 branch)
4. **Season Detection**: Automatically shows Fall (current month is October)
5. **All Code Committed**: Yes, ready to push
6. **Testing**: Preview files available for quick mobile testing

---

## Questions Addressed in This Session

1. ✅ Clear the repository
2. ✅ Create YK-Companion mobile web app
3. ✅ Design brand with pixel art Aurora theme
4. ✅ Implement Living/Moving/Visiting sections
5. ✅ Add seasonal design variations
6. ✅ Create mobile preview version
7. ✅ Generate CodePen-ready files
8. ✅ Prepare for push to new repository

---

## Contact & Support

- **Built with**: Claude Code
- **Designer Intent**: Medium-skilled enthusiast focused on Yellowknife
- **Target Audience**: Residents, newcomers, and visitors to Yellowknife, NWT

---

**Last Updated**: October 23, 2025
**Project Status**: Ready for deployment
**Next Action**: Manual push to YK-Companion/v2 branch
