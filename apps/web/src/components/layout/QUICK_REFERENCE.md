# Layout Components - Quick Reference Card

## Import
```tsx
import { AppLayout, PageHeader, Breadcrumbs } from '@/components/layout';
```

## Basic Page Template
```tsx
export default function MyPage() {
  return (
    <AppLayout>
      <PageHeader
        icon="🏠"
        title="Page Title"
        description="Page description"
      />

      {/* Your content here */}
    </AppLayout>
  );
}
```

## With Breadcrumbs
```tsx
<AppLayout
  breadcrumbs={[
    { label: 'YK Buddy', href: '/' },
    { label: 'Section', href: '/section' },
    { label: 'Current Page' }  // No href for current page
  ]}
>
  {/* Content */}
</AppLayout>
```

## Props Cheat Sheet

### AppLayout
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Page content |
| `breadcrumbs` | BreadcrumbItem[] | undefined | Breadcrumb trail |
| `showBanner` | boolean | true | Show seasonal banner |
| `showMenu` | boolean | true | Show navigation menu |
| `className` | string | '' | Additional CSS |

### PageHeader
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | ReactNode \| string | undefined | Large icon |
| `title` | string | required | Page title |
| `description` | string | undefined | Subtitle |
| `className` | string | '' | Additional CSS |

### Breadcrumbs
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | BreadcrumbItem[] | required | Breadcrumb items |

### BreadcrumbItem
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | yes | Display text |
| `href` | string | no | Link URL (omit for current page) |

## Common Patterns

### Minimal Page (no banner/menu)
```tsx
<AppLayout showBanner={false} showMenu={false}>
  <PageHeader title="Admin Dashboard" />
</AppLayout>
```

### With Custom Icon Component
```tsx
import { BushPlaneIcon } from '@/components/NorthernIcons';

<PageHeader
  icon={<BushPlaneIcon className="w-16 h-16 text-aurora-green" />}
  title="Visit Yellowknife"
/>
```

### Deep Nested Page
```tsx
<AppLayout
  breadcrumbs={[
    { label: 'YK Buddy', href: '/' },
    { label: 'Living', href: '/living' },
    { label: 'Community', href: '/living/community' },
    { label: 'Recreation' }
  ]}
>
```

## Styling Classes

### Background
- `from-northern-midnight via-dark-800 to-gray-900` (automatic)

### Text Colors
- `text-white` - Primary text
- `text-gray-300` - Secondary text
- `text-gray-400` - Tertiary text

### Aurora Colors
- `text-aurora-green`, `border-aurora-green`, `bg-aurora-green/20`
- `text-aurora-blue`, `border-aurora-blue`, `bg-aurora-blue/20`
- `text-aurora-purple`, `border-aurora-purple`, `bg-aurora-purple/20`

### Content Cards
```tsx
<div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
  {/* Card content */}
</div>
```

### Hover States
- `hover:text-aurora-green`
- `hover:border-aurora-blue`
- `hover:bg-white/10`

## What's Included Automatically

✓ Seasonal banner (winter/summer themes)
✓ Navigation menu (Home • About • Contact)
✓ Language selector (top-right)
✓ Footer with localized text
✓ About modal
✓ Contact modal
✓ Background gradient
✓ Responsive layout
✓ Max-width container (1280px)

## What You Provide

□ Page content (children)
□ Page title and description (PageHeader)
□ Breadcrumb trail (optional)
□ Custom CSS classes (optional)

## File Locations

**Components:**
- `apps/web/src/components/layout/AppLayout.tsx`
- `apps/web/src/components/layout/PageHeader.tsx`
- `apps/web/src/components/layout/Breadcrumbs.tsx`

**Docs:**
- `README.md` - Full documentation
- `EXAMPLE_USAGE.tsx` - 7 real-world examples
- `COMPONENT_HIERARCHY.md` - Visual diagrams
- `SUMMARY.md` - Implementation details
- `QUICK_REFERENCE.md` - This file

## Tips

1. **Always use AppLayout** for consistent UI
2. **Last breadcrumb has no href** (current page)
3. **Icons can be emoji or components** (flexible)
4. **Footer is automatic** (from t('footer'))
5. **Type-safe** with TypeScript
6. **Mobile responsive** out of the box

## Example Pages to Study

Check these existing pages for context:
- `apps/web/src/app/page.tsx` (homepage)
- `apps/web/src/app/living/page.tsx` (section page)
- `apps/web/src/app/visiting/page.tsx` (section page)

## Need Help?

1. See `EXAMPLE_USAGE.tsx` for 7 complete examples
2. See `README.md` for detailed prop documentation
3. See `COMPONENT_HIERARCHY.md` for visual structure
4. See `SUMMARY.md` for implementation details
