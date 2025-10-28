# YK Companion Layout Components

Shared layout components for consistent UI/UX across all pages.

## Components

### AppLayout
Main layout wrapper that includes seasonal banner, navigation menu, language selector, breadcrumbs, and footer.

**Props:**
- `children`: ReactNode - Page content
- `breadcrumbs?`: BreadcrumbItem[] - Optional breadcrumb navigation
- `showBanner?`: boolean - Show/hide seasonal banner (default: true)
- `showMenu?`: boolean - Show/hide navigation menu (default: true)
- `className?`: string - Additional CSS classes

**Example:**
```tsx
import { AppLayout } from '@/components/layout';

export default function MyPage() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'YK Buddy', href: '/' },
        { label: 'Living', href: '/living' },
        { label: 'Current Page' }
      ]}
    >
      <h1>Page Content</h1>
    </AppLayout>
  );
}
```

### PageHeader
Consistent page header with icon, title, and description.

**Props:**
- `icon?`: ReactNode | string - Large icon (emoji or component)
- `title`: string - Page title
- `description?`: string - Page subtitle/description
- `className?`: string - Additional CSS classes

**Example:**
```tsx
import { PageHeader } from '@/components/layout';

<PageHeader
  icon="🏠"
  title="Living in Yellowknife"
  description="Local events, seasonal guides, and community resources for residents."
/>
```

### Breadcrumbs
Navigation breadcrumbs with chevron separators.

**Props:**
- `items`: BreadcrumbItem[] - Array of breadcrumb items

**BreadcrumbItem:**
- `label`: string - Display text
- `href?`: string - Optional link (last item shouldn't have href)

**Example:**
```tsx
import { Breadcrumbs } from '@/components/layout';

<Breadcrumbs
  items={[
    { label: 'YK Buddy', href: '/' },
    { label: 'Living', href: '/living' },
    { label: 'Garage Sales' }
  ]}
/>
```

## Features

- **Consistent Styling**: All components use YK Buddy's northern theme with aurora colors
- **Mobile Responsive**: All components are fully responsive
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Modular**: Use components independently or together
- **TypeScript**: Full type safety with exported types

## Design Tokens

The components use these design elements:
- Background gradient: `from-northern-midnight via-dark-800 to-gray-900`
- Aurora colors: `aurora-green`, `aurora-blue`, `aurora-purple`
- Text colors: `text-white`, `text-gray-300`, `text-gray-400`
- Border colors: `border-gray-700/30`
- Hover states: `hover:text-aurora-green`
