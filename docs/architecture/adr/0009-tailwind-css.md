# ADR-0009: Use Tailwind CSS for Styling

**Status:** Accepted
**Date:** 2025-01-15
**Decision Makers:** Development Team
**Impact:** Low to Medium

---

## Context

We need a CSS solution that provides:

- **Rapid Development** - Quick to style components
- **Consistency** - Consistent design system
- **Responsive Design** - Mobile-first approach
- **Small Bundle** - Optimized for production
- **Maintainability** - Easy to update and refactor

### Requirements

- Mobile-first responsive design
- Dark mode support (future)
- Custom northern lights theme
- Fast iteration on UI
- No CSS conflicts
- Good performance

---

## Decision

**We will use Tailwind CSS as our primary styling solution** with:

- Utility-first classes
- Custom theme configuration
- JIT (Just-In-Time) compiler
- Mobile-first breakpoints
- Minimal custom CSS

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'northern-midnight': '#0a1628',
        'aurora-green': '#10b981',
        'aurora-blue': '#3b82f6',
        'aurora-purple': '#a855f7',
        'dark-800': '#1e293b',
        'dark-900': '#0f172a',
      },
      animation: {
        aurora: 'aurora 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
```

---

## Alternatives Considered

### Alternative 1: CSS Modules

**Pros:** Scoped styles, no conflicts, familiar CSS
**Cons:** More files, verbose, less rapid development
**Why not chosen:** Slower development, more boilerplate

### Alternative 2: Styled Components

**Pros:** CSS-in-JS, dynamic styles, component-scoped
**Cons:** Runtime overhead, larger bundle, flash of unstyled content
**Why not chosen:** Performance concerns, prefer build-time solution

### Alternative 3: Emotion

**Pros:** Fast CSS-in-JS, good performance
**Cons:** Runtime cost, complexity
**Why not chosen:** Tailwind simpler and faster

### Alternative 4: Vanilla CSS/SCSS

**Pros:** No dependencies, full control
**Cons:** No design system, hard to maintain, conflicts
**Why not chosen:** Too much manual work, inconsistent

---

## Consequences

### Positive Consequences

- **Rapid Development** - Style components quickly
- **Consistency** - Design system baked in
- **Small Bundle** - PurgeCSS removes unused styles
- **Mobile-First** - Built-in responsive utilities
- **No Conflicts** - Utility classes don't collide
- **Easy to Learn** - Simple class names
- **Great DX** - IntelliSense with Tailwind plugin

### Negative Consequences

- **HTML Verbosity** - Many classes in markup
- **Learning Curve** - Must learn utility names
- **Custom Styles** - Sometimes need arbitrary values
- **Readability** - Long class strings can be hard to read

---

## Implementation

### Custom Theme

```javascript
// Northern lights color palette
colors: {
  'aurora-green': '#10b981',   // Emerald green
  'aurora-blue': '#3b82f6',    // Sky blue
  'aurora-purple': '#a855f7',  // Purple
  'northern-midnight': '#0a1628', // Dark background
}
```

### Component Example

```tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border-2 border-aurora-blue/40 rounded-3xl p-6 hover:border-aurora-green/70 transition-all duration-500">
      {children}
    </div>
  );
}
```

### Responsive Design

```tsx
<div className="px-4 sm:px-6 md:px-8 lg:px-12">
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
    Responsive Heading
  </h1>
</div>
```

---

## Best Practices

### Do's

✅ Use Tailwind utilities first
✅ Extract components, not CSS
✅ Use design tokens (theme)
✅ Mobile-first breakpoints
✅ Use @apply sparingly

### Don'ts

❌ Write custom CSS for everything
❌ Mix Tailwind with other CSS frameworks
❌ Use arbitrary values everywhere
❌ Ignore design system
❌ Create utility classes with @apply

---

## Validation

### Success Criteria

- [x] All components styled with Tailwind
- [x] No conflicting styles
- [x] Production bundle < 20KB CSS
- [x] Mobile-responsive on all pages
- [x] Custom theme applied consistently

### Current Status (Jan 2025)

- **CSS Bundle:** 15KB (gzipped)
- **Tailwind Usage:** 95%
- **Custom CSS:** < 5%
- **Mobile Responsive:** 100%

---

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Best Practices](https://tailwindcss.com/docs/reusing-styles)

---

## Notes

### Related Decisions

- [ADR-0001 - Next.js App Router](./0001-nextjs-app-router.md)

---

**Last Updated:** 2025-01-27
**Review Cycle:** Annually
