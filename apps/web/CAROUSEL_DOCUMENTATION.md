# Mobile-First Carousel Component Documentation

## Overview

A fully-featured, mobile-first carousel component built for the YK-Companion web app. Designed with touch gestures, keyboard navigation, and accessibility in mind.

## Features

- **Mobile-First**: Optimized for touch on small screens
- **Touch Gestures**: Swipe left/right to navigate
- **Keyboard Navigation**: Arrow keys, Home, End
- **Smooth Animations**: 60fps using CSS transforms
- **Snap Scrolling**: Smooth, predictable slide transitions
- **Pagination Dots**: Visual indicators for current slide
- **Navigation Arrows**: Optional prev/next buttons
- **Autoplay**: Optional auto-advance with configurable interval
- **Responsive**: Configure items per view for mobile, tablet, desktop
- **Accessible**: ARIA labels, keyboard support, screen reader friendly
- **TypeScript**: Full type safety
- **Zero Dependencies**: No external carousel libraries

## Installation

The carousel is already installed at:
```
/apps/web/src/components/Carousel.tsx
```

## Basic Usage

```tsx
import Carousel, { CarouselCard } from '@/components/Carousel';

export default function MyComponent() {
  return (
    <Carousel showDots showArrows loop>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | Carousel items/slides |
| `autoplayInterval` | `number` | `0` | Auto-advance interval in ms (0 = disabled) |
| `showDots` | `boolean` | `true` | Show pagination dots |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `loop` | `boolean` | `true` | Enable infinite loop |
| `className` | `string` | `''` | Custom CSS class |
| `itemsPerView` | `object` | `{ mobile: 1, tablet: 2, desktop: 3 }` | Items visible at once |
| `gap` | `number` | `16` | Gap between items in pixels |
| `onSlideChange` | `(index: number) => void` | `undefined` | Callback when slide changes |
| `snap` | `boolean` | `true` | Enable snap scrolling |
| `swipeSensitivity` | `number` | `0.3` | Swipe sensitivity (0-1, higher = more sensitive) |

### itemsPerView Object

```tsx
{
  mobile?: number;   // Items shown on mobile (<768px)
  tablet?: number;   // Items shown on tablet (768px-1023px)
  desktop?: number;  // Items shown on desktop (>=1024px)
}
```

## Examples

### 1. Simple Carousel

```tsx
<Carousel>
  <div className="bg-aurora-green/20 p-8 rounded-xl">
    <h3 className="text-xl font-bold text-white">Slide 1</h3>
  </div>
  <div className="bg-aurora-blue/20 p-8 rounded-xl">
    <h3 className="text-xl font-bold text-white">Slide 2</h3>
  </div>
</Carousel>
```

### 2. Autoplay Carousel

```tsx
<Carousel
  autoplayInterval={5000}
  showDots
  loop
>
  {items.map((item) => (
    <div key={item.id}>{item.content}</div>
  ))}
</Carousel>
```

### 3. Responsive Multi-Item Carousel

```tsx
<Carousel
  itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap={20}
  showDots
  showArrows
>
  {cards.map((card) => (
    <CarouselCard key={card.id}>
      <div className="p-6 bg-dark-800 rounded-xl h-full">
        <h3>{card.title}</h3>
        <p>{card.description}</p>
      </div>
    </CarouselCard>
  ))}
</Carousel>
```

### 4. Card Carousel with Callbacks

```tsx
<Carousel
  onSlideChange={(index) => console.log('Slide:', index)}
  loop={false}
  showDots
>
  {slides.map((slide, i) => (
    <div key={i}>{slide}</div>
  ))}
</Carousel>
```

### 5. Mobile-Only Carousel (Desktop Grid)

```tsx
{/* Mobile: Carousel */}
<div className="block md:hidden">
  <Carousel showDots showArrows={false}>
    {items.map((item) => (
      <CarouselCard key={item.id}>
        <ItemCard item={item} />
      </CarouselCard>
    ))}
  </Carousel>
</div>

{/* Desktop: Grid */}
<div className="hidden md:grid md:grid-cols-3 gap-6">
  {items.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>
```

## Pre-Built Carousel Components

### EnhancedPathwayCardsCarousel

Mobile-first carousel for the three pathway cards (Visiting, Living, Moving).

**Location**: `/apps/web/src/components/EnhancedPathwayCardsCarousel.tsx`

**Usage**:
```tsx
import EnhancedPathwayCardsCarousel from '@/components/EnhancedPathwayCardsCarousel';

<EnhancedPathwayCardsCarousel />
```

**Behavior**:
- Mobile: Carousel with dots
- Desktop: Grid layout (3 columns)

### PremiumSponsorsCarousel

Carousel for premium sponsor cards with autoplay.

**Location**: `/apps/web/src/components/sponsors/PremiumSponsorsCarousel.tsx`

**Usage**:
```tsx
import PremiumSponsorsCarousel from '@/components/sponsors/PremiumSponsorsCarousel';

<PremiumSponsorsCarousel
  position="home_bottom"
  maxSponsors={6}
  autoplay={true}
  autoplayInterval={5000}
/>
```

**Props**:
- `position`: Filter sponsors by position
- `maxSponsors`: Maximum number of sponsors to show
- `autoplay`: Enable autoplay
- `autoplayInterval`: Autoplay interval in ms

### GarageSaleCarousel

Carousel for garage sale listings.

**Location**: `/apps/web/src/components/garage-sales/GarageSaleCarousel.tsx`

**Usage**:
```tsx
import GarageSaleCarousel from '@/components/garage-sales/GarageSaleCarousel';

<GarageSaleCarousel
  sales={garageSales}
  selectedSales={selectedSales}
  onToggleSelection={handleToggle}
  enableSelection={true}
/>
```

**Props**:
- `sales`: Array of garage sale objects
- `selectedSales`: Array of selected sale IDs
- `onToggleSelection`: Callback for selection toggle
- `enableSelection`: Enable selection checkboxes
- `alwaysCarousel`: Use carousel on all screen sizes
- `autoplay`: Enable autoplay

## Accessibility

The carousel includes the following accessibility features:

### Keyboard Navigation
- **Arrow Left**: Previous slide
- **Arrow Right**: Next slide
- **Home**: First slide
- **End**: Last slide

### ARIA Labels
- `role="region"`: Carousel container
- `aria-label="Carousel"`: Region label
- `aria-live="polite"`: Live region for screen readers
- `role="list"`: Slide container
- `role="listitem"`: Individual slides
- `aria-label`: Descriptive labels for arrows and dots
- `aria-selected`: Current slide indicator

### Screen Reader Support
- Current slide announced on change
- Navigation buttons have descriptive labels
- Pagination dots indicate slide number

### Focus Management
- Keyboard focus visible on interactive elements
- Focus ring on arrows and dots
- Tab navigation supported

## Performance Optimizations

1. **CSS Transforms**: Uses `translateX` for smooth 60fps animations
2. **useCallback**: Memoized navigation functions
3. **Conditional Rendering**: Arrows/dots only render when needed
4. **Touch Optimization**: Prevents unnecessary re-renders during drag
5. **No Layout Shifts**: Reserved space prevents content jump
6. **Efficient Updates**: Only re-renders on state changes

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile Safari: Full support
- Mobile Chrome: Full support

## Customization

### Styling

The carousel uses Tailwind CSS and respects your app's design tokens:

```tsx
// Custom background and border
<Carousel className="bg-dark-900 rounded-2xl border-2 border-aurora-blue/30">
  {/* slides */}
</Carousel>
```

### Animation Duration

Modify the transition in the inline style:

```tsx
// In Carousel.tsx, line ~200
style={{
  transform: `translateX(${translateX}%)`,
  transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  // Change 0.5s to your preferred duration
}}
```

### Custom Arrow Buttons

Replace the SVG arrows in the component with your custom icons.

## Common Patterns

### Pattern 1: Responsive Behavior

Mobile carousel, desktop grid:

```tsx
<>
  <div className="md:hidden">
    <Carousel>{items.map(...)}</Carousel>
  </div>
  <div className="hidden md:grid md:grid-cols-3">
    {items.map(...)}
  </div>
</>
```

### Pattern 2: Dynamic Content

Fetch data and populate carousel:

```tsx
const [items, setItems] = useState([]);

useEffect(() => {
  fetchItems().then(setItems);
}, []);

return (
  <Carousel>
    {items.map((item) => (
      <Card key={item.id} data={item} />
    ))}
  </Carousel>
);
```

### Pattern 3: Controlled Carousel

Control carousel from parent:

```tsx
const [currentIndex, setCurrentIndex] = useState(0);

return (
  <div>
    <Carousel onSlideChange={setCurrentIndex}>
      {slides}
    </Carousel>
    <p>Current slide: {currentIndex + 1}</p>
  </div>
);
```

## Troubleshooting

### Issue: Carousel not swiping on mobile

**Solution**: Ensure the carousel has enough space and is not nested in elements with touch event handlers that prevent default.

### Issue: Items not fitting correctly

**Solution**: Make sure child elements have consistent heights or use `h-full` on CarouselCard wrapper.

### Issue: Autoplay not stopping on hover

**Solution**: Ensure the carousel container is receiving mouse events and not blocked by child elements with `pointer-events-none`.

### Issue: Dots/arrows not showing

**Solution**: Check that `showDots` and `showArrows` props are set to `true` and that there are more items than `itemsPerView`.

## Migration Guide

### From SwipeableCards to Carousel

**Before**:
```tsx
<SwipeableCards
  cards={cards}
  onSwipeRight={handleRight}
  onSwipeLeft={handleLeft}
/>
```

**After**:
```tsx
<Carousel showDots loop>
  {cards.map((card) => (
    <CardComponent key={card.id} card={card} />
  ))}
</Carousel>
```

### From Grid to Carousel

**Before**:
```tsx
<div className="grid grid-cols-3 gap-6">
  {items.map((item) => <Card key={item.id} {...item} />)}
</div>
```

**After**:
```tsx
<Carousel itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}>
  {items.map((item) => (
    <CarouselCard key={item.id}>
      <Card {...item} />
    </CarouselCard>
  ))}
</Carousel>
```

## Files Created/Modified

### Created Files
1. `/apps/web/src/components/Carousel.tsx` - Main carousel component
2. `/apps/web/src/components/EnhancedPathwayCardsCarousel.tsx` - Pathway cards with carousel
3. `/apps/web/src/components/sponsors/PremiumSponsorsCarousel.tsx` - Sponsor carousel
4. `/apps/web/src/components/garage-sales/GarageSaleCarousel.tsx` - Garage sale carousel
5. `/apps/web/src/components/CarouselExamples.tsx` - Usage examples
6. `/apps/web/CAROUSEL_DOCUMENTATION.md` - This documentation

### Modified Files
1. `/apps/web/src/app/page.tsx` - Updated to use EnhancedPathwayCardsCarousel

## Testing Checklist

- [ ] Swipe gestures work on mobile
- [ ] Arrow keys navigate slides
- [ ] Dots indicate current slide
- [ ] Autoplay advances automatically
- [ ] Autoplay pauses on hover
- [ ] Loop works correctly
- [ ] Responsive breakpoints work
- [ ] Keyboard focus is visible
- [ ] Screen reader announces slides
- [ ] No layout shift on load
- [ ] Smooth 60fps animations
- [ ] Works with single item
- [ ] Works with empty state

## Support

For issues or questions, contact the YK-Companion development team.

## License

Part of the YK-Companion project.
