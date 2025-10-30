# YK Buddy Mobile Redesign

## Overview

A complete mobile redesign of YK Buddy based on the seasonal banner aesthetic, featuring:
- Seasonal theming throughout the entire mobile experience
- Modern bottom navigation with aurora effects
- Gesture-based interactions
- Smooth page transitions
- One-handed optimization
- PWA-ready mobile app experience

## Key Features

### 1. Seasonal Theming System
The mobile app dynamically adapts to match the current seasonal banner theme:
- **11 Seasonal Themes**: Winter, Spring, Summer, Fall, Halloween, Remembrance Day, Christmas, New Year, Canada Day, Indigenous Peoples Day, Easter
- **Dynamic Colors**: Each theme has primary, secondary, and accent colors with aurora glow effects
- **Animated Backgrounds**: Gradient backgrounds with aurora pulse animations
- **Seasonal Icons**: Theme-specific emojis in the header

### 2. Mobile App Wrapper
[MobileAppWrapper.tsx](apps/web/src/components/mobile/MobileAppWrapper.tsx)

**Features:**
- Fixed positioning to prevent overscroll bounce
- Seasonal gradient backgrounds matching banner themes
- Aurora glow overlay with pulse animation
- Animated star particles
- Safe area insets for notched devices
- Smooth page transitions

**Usage:**
```tsx
<MobileAppWrapper showHeader={true} showBottomNav={true}>
  {children}
</MobileAppWrapper>
```

### 3. Mobile Bottom Navigation
[MobileBottomNav.tsx](apps/web/src/components/mobile/MobileBottomNav.tsx)

**Features:**
- 5 primary navigation items (Home, Discover, Aurora, Seasonal, Profile)
- Icons with seasonal color theming
- Active state with glow effects
- Animated aurora wave at top of nav
- Touch feedback with haptics
- Pulsing notification indicator on Aurora tab

**Navigation Items:**
- Home - Main dashboard
- Discover - Content discovery
- Aurora - Aurora forecast (with pulse indicator)
- Seasonal - Seasonal content
- Profile - User profile

### 4. Mobile Header
[MobileHeader.tsx](apps/web/src/components/mobile/MobileHeader.tsx)

**Features:**
- Compact seasonal banner
- Menu button with aurora glow
- YK Buddy branding with seasonal emoji
- Live weather temperature display
- Notification button with badge
- Animated aurora wave separator
- Decorative particles

### 5. Mobile Menu Drawer
[MobileMenuDrawer.tsx](apps/web/src/components/mobile/MobileMenuDrawer.tsx)

**Features:**
- Slide-in from left with backdrop blur
- Seasonal aurora glow effect
- Organized menu sections (Main, Explore, Tools)
- User greeting when logged in
- Settings and logout options
- Staggered item animations
- Touch feedback on all items

**Menu Structure:**
- **Main**: Home, Discover, Aurora Forecast
- **Explore**: Visiting, Living, Moving
- **Tools**: Trip Calculator, Knowledge Base, Saved Items
- **Settings**: Profile, Logout

### 6. Mobile Card Components
[MobileCard.tsx](apps/web/src/components/mobile/MobileCard.tsx)

**Variants:**
- `default` - Standard card with backdrop blur
- `elevated` - Enhanced card with gradient
- `flat` - Solid background card

**Specialized Cards:**

#### MobileFeatureCard
For feature showcases with icon, title, and description:
```tsx
<MobileFeatureCard
  icon={<Icon size={24} />}
  title="Feature Title"
  description="Feature description"
  onClick={() => {}}
  theme={theme}
/>
```

#### MobileContentCard
For content items with image, title, subtitle, and badge:
```tsx
<MobileContentCard
  image="/path/to/image.jpg"
  title="Content Title"
  subtitle="Subtitle"
  badge="New"
  onClick={() => {}}
  theme={theme}
/>
```

**Features:**
- Press state with scale animation
- Seasonal border glow on interaction
- Haptic feedback
- Aurora gradient overlays
- Chevron arrow indicator

### 7. Swipeable Page Transitions
[SwipeablePageTransition.tsx](apps/web/src/components/mobile/SwipeablePageTransition.tsx)

**Features:**
- Right swipe to go back (browser history)
- Left swipe for custom actions
- Visual feedback with aurora curtain effect
- Edge indicators showing swipe progress
- Haptic feedback at key moments
- First-time swipe hint

**Gestures:**
- Swipe right (>100px) - Navigate back
- Swipe left (>100px) - Custom action (if defined)
- Visual indicators appear on screen edges
- Threshold and velocity detection

### 8. Gesture Hooks
[useSwipeGesture.ts](apps/web/src/hooks/useSwipeGesture.ts)

#### useSwipeGesture
Detects swipe gestures in all four directions:
```tsx
const swipeState = useSwipeGesture(elementRef, {
  onSwipeLeft: () => {},
  onSwipeRight: () => {},
  onSwipeUp: () => {},
  onSwipeDown: () => {},
  threshold: 50,
  velocityThreshold: 0.3,
  enableHaptics: true,
});
```

#### useLongPress
Detects long press gestures:
```tsx
const isLongPressing = useLongPress(elementRef, {
  onLongPress: () => {},
  delay: 500,
  enableHaptics: true,
});
```

#### usePullToRefresh
Pull-to-refresh gesture:
```tsx
const { isPulling, isRefreshing, pullDistance, progress } = usePullToRefresh(elementRef, {
  onRefresh: async () => {},
  threshold: 80,
  enableHaptics: true,
});
```

## Design Principles

### 1. One-Handed Optimization
- Primary navigation in bottom 40vh (thumb zone)
- Large touch targets (minimum 44x44px)
- Bottom navigation for easy reach
- Swipe gestures for common actions

### 2. Seasonal Consistency
- Colors match the current seasonal banner
- Aurora effects throughout the interface
- Animated particles and glows
- Seasonal emojis in header

### 3. Performance
- Hardware-accelerated animations
- Smooth 60fps transitions
- Lazy loading where appropriate
- Optimized for mobile devices

### 4. Accessibility
- WCAG-compliant color contrast
- Touch-friendly target sizes
- Haptic feedback for interactions
- Reduced motion support
- Semantic HTML structure

### 5. PWA Optimization
- Fixed positioning for app-like feel
- Safe area insets for notched devices
- Prevent overscroll bounce
- Smooth momentum scrolling

## Integration

The mobile redesign is automatically enabled when viewing on mobile devices (screen width ≤ 639px). The [AppLayout.tsx](apps/web/src/components/layout/AppLayout.tsx) component detects mobile devices and switches to the mobile wrapper:

```tsx
const isMobile = useIsMobile();

if (isMobile) {
  return (
    <MobileAppWrapper showHeader={true} showBottomNav={true}>
      <SwipeablePageTransition theme={theme} enableBackSwipe={true}>
        {children}
      </SwipeablePageTransition>
    </MobileAppWrapper>
  );
}

// Desktop layout...
```

## File Structure

```
apps/web/src/
├── components/
│   └── mobile/
│       ├── MobileAppWrapper.tsx         # Main mobile container
│       ├── MobileBottomNav.tsx          # Bottom navigation bar
│       ├── MobileHeader.tsx             # Compact header
│       ├── MobileMenuDrawer.tsx         # Slide-out menu
│       ├── MobileCard.tsx               # Card components
│       └── SwipeablePageTransition.tsx  # Page transitions
├── hooks/
│   └── useSwipeGesture.ts              # Gesture detection hooks
└── layout/
    └── AppLayout.tsx                    # Updated with mobile support
```

## Seasonal Themes

Each theme includes:
- `primary` - Main brand color
- `secondary` - Secondary accent
- `accent` - Highlight color
- `background` - Tailwind gradient classes
- `glow` - RGBA glow color

### Theme Examples:

**Winter:**
- Primary: Aurora Blue (#4d94ff)
- Secondary: Purple (#a366ff)
- Accent: Aurora Green (#00ff88)
- Background: Indigo to slate gradient

**Summer:**
- Primary: Orange (#ffa500)
- Secondary: Gold (#FFD700)
- Accent: Pink (#ff66cc)
- Background: Amber to rose gradient

**Halloween:**
- Primary: Orange (#ff6b35)
- Secondary: Purple (#a366ff)
- Accent: Orange (#ffa500)
- Background: Purple to black gradient

## Usage Examples

### Basic Page with Mobile Support
```tsx
import { MobileFeatureCard } from '@/components/mobile/MobileCard';

export default function MyPage() {
  const { currentTheme } = useBannerSettings();
  const theme = SEASONAL_THEMES[currentTheme];

  return (
    <div className="space-y-4">
      <h1>My Page</h1>

      <MobileFeatureCard
        icon={<MapPin size={24} />}
        title="Explore Yukon"
        description="Discover amazing places in Yukon"
        onClick={() => router.push('/explore')}
        theme={theme}
      />
    </div>
  );
}
```

### Custom Swipe Actions
```tsx
<SwipeablePageTransition
  theme={theme}
  enableBackSwipe={true}
  onSwipeLeft={() => {
    // Custom action on left swipe
    router.push('/next-page');
  }}
>
  {children}
</SwipeablePageTransition>
```

### Pull to Refresh
```tsx
const contentRef = useRef<HTMLDivElement>(null);
const { isPulling, progress } = usePullToRefresh(contentRef, {
  onRefresh: async () => {
    await fetchNewData();
  },
});

return (
  <div ref={contentRef}>
    {isPulling && <RefreshIndicator progress={progress} />}
    {content}
  </div>
);
```

## Browser Support

- iOS Safari 14+
- Chrome for Android 90+
- Samsung Internet 14+
- Firefox Mobile 90+

## Testing Checklist

- [ ] Test on various screen sizes (320px - 639px)
- [ ] Test on iOS Safari (notch support)
- [ ] Test on Android Chrome
- [ ] Test all 11 seasonal themes
- [ ] Test swipe gestures
- [ ] Test bottom navigation
- [ ] Test menu drawer
- [ ] Test haptic feedback
- [ ] Test safe area insets
- [ ] Test in landscape orientation
- [ ] Test PWA install
- [ ] Test offline functionality
- [ ] Test performance (60fps animations)
- [ ] Test reduced motion preference

## Future Enhancements

1. **Advanced Gestures**
   - Pinch to zoom for images
   - Two-finger swipe for secondary actions
   - Shake to refresh

2. **Offline Support**
   - Service worker for offline pages
   - Cached content
   - Background sync

3. **Enhanced Animations**
   - Shared element transitions
   - Physics-based spring animations
   - Parallax scrolling effects

4. **Customization**
   - User-selectable accent colors
   - Custom navigation order
   - Layout preferences

5. **Advanced Features**
   - Voice navigation
   - Biometric authentication
   - Push notifications
   - Deep linking

## Performance Metrics

Target metrics:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Smooth animations: 60fps
- Touch response: < 100ms
- Page transitions: < 300ms

## Contributing

When adding new mobile features:
1. Follow the seasonal theming pattern
2. Add haptic feedback for interactions
3. Support safe area insets
4. Test on real devices
5. Consider one-handed use
6. Document new components
7. Add to this README

## Questions?

For issues or questions about the mobile redesign, please open an issue on GitHub or contact the development team.
