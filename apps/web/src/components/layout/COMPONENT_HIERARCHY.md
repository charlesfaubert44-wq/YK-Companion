# Layout Components - Visual Hierarchy

## Full Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  AppLayout                                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Fixed Top-Right: LanguageSelector                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  YKBuddySeasonalBanner (optional)                     │  │
│  │  • Winter/Summer/Fall theme                           │  │
│  │  • Weather widget                                     │  │
│  │  • Northern lights animation                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  InteractiveMenu (optional)                           │  │
│  │  • Home • About • Contact                             │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Main Content Container                               │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Breadcrumbs (optional)                         │  │  │
│  │  │  YK Buddy > Living > Garage Sales               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  PageHeader (your component)                    │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │  Icon (emoji or component)                │  │  │  │
│  │  │  │  🛒                                        │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │  Title (gradient text)                    │  │  │  │
│  │  │  │  Garage Sale Planner                      │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │  Description (gray text)                  │  │  │  │
│  │  │  │  Find garage sales on the map...          │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Your Page Content (children)                   │  │  │
│  │  │  • Cards                                        │  │  │
│  │  │  • Lists                                        │  │  │
│  │  │  • Forms                                        │  │  │
│  │  │  • Interactive elements                         │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Footer (automatic)                             │  │  │
│  │  │  • Copyright text                               │  │  │
│  │  │  • Localized via t('footer')                    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Modals (automatic)                                   │  │
│  │  • About Modal                                        │  │
│  │  • Contact Modal                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Component Relationships

```
AppLayout (container)
│
├─── LanguageSelector (fixed top-right)
│
├─── YKBuddySeasonalBanner (conditional)
│
├─── InteractiveMenu (conditional)
│    ├─── Home link
│    ├─── About button → AboutModal
│    └─── Contact button → ContactModal
│
├─── Main Content Container
│    ├─── Breadcrumbs (conditional)
│    ├─── {children} ← Your content goes here
│    └─── Footer
│
├─── AboutModal
└─── ContactModal
```

## Usage Flow

```
1. Developer imports AppLayout
   ↓
2. Wraps page content with AppLayout
   ↓
3. Optionally adds breadcrumbs prop
   ↓
4. Uses PageHeader for consistent title section
   ↓
5. Adds custom page content
   ↓
6. AppLayout handles:
   • Background gradient
   • Navigation menu
   • Language selector
   • Footer
   • Modals
```

## Styling Inheritance

```
AppLayout
│
├─── Background: from-northern-midnight via-dark-800 to-gray-900
│
├─── Max Width: 6xl (1280px)
│
├─── Padding: px-4 py-12
│
└─── All children inherit:
     • Text colors (white, gray-300, gray-400)
     • Aurora theme colors
     • Border styles (border-gray-700/30)
     • Hover states (hover:text-aurora-green)
```

## Responsive Behavior

```
Mobile (<768px):
┌─────────────┐
│ [Language]  │
│             │
│   Banner    │
│             │
│    Menu     │
│             │
│  Content    │
│  (stacked)  │
│             │
│   Footer    │
└─────────────┘

Desktop (≥768px):
┌──────────────────────┐
│        [Language]    │
│                      │
│      Banner          │
│                      │
│   Home•About•Contact │
│                      │
│  Content (2-col)     │
│  ┌────────┬────────┐ │
│  │        │        │ │
│  └────────┴────────┘ │
│                      │
│       Footer         │
└──────────────────────┘
```
