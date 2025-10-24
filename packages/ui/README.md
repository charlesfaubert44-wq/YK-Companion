# @yk-companion/ui

Beautiful UI component library for YK-Companion with aurora-themed pixel aesthetics.

## Features

- **Aurora-themed color palette** - Northern lights inspired colors (green, blue, purple, pink)
- **Pixel art aesthetic** - Retro 8-bit styling with optional modern variants
- **TypeScript support** - Full type safety with TypeScript
- **Tailwind CSS integration** - Built with Tailwind utility classes
- **Accessible** - WCAG compliant components
- **Tree-shakeable** - Import only what you need
- **Mobile-first** - Responsive design for all screen sizes

## Installation

```bash
npm install @yk-companion/ui
# or
yarn add @yk-companion/ui
# or
pnpm add @yk-companion/ui
```

## Usage

```tsx
import { Button, Card, Input, ToastProvider, useToast } from '@yk-companion/ui';

function App() {
  return (
    <ToastProvider>
      <Card
        header={<h2>Welcome to YK-Companion</h2>}
        borderColor="aurora-green"
      >
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
        />
        <Button variant="primary" size="md">
          Submit
        </Button>
      </Card>
    </ToastProvider>
  );
}
```

## Components

### Form Components

#### Button
Interactive button with multiple variants and sizes.

```tsx
<Button variant="primary" size="md" pixel>
  Click me
</Button>

<Button variant="secondary" leftIcon={<Icon />}>
  With Icon
</Button>

<Button loading fullWidth>
  Loading...
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'` (default: `'primary'`)
- `size`: `'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `pixel`: Enable pixel art aesthetic (default: `true`)
- `loading`: Show loading state
- `fullWidth`: Full width button
- `leftIcon`, `rightIcon`: Icons before/after text

#### Input
Text input with aurora-themed styling.

```tsx
<Input
  label="Username"
  placeholder="Enter username"
  helperText="Choose a unique username"
  leftElement={<UserIcon />}
/>

<Input
  error
  helperText="This field is required"
/>
```

**Props:**
- `size`: Component size (default: `'md'`)
- `pixel`: Enable pixel art aesthetic (default: `true`)
- `error`: Show error state
- `label`: Label text
- `helperText`: Helper text below input
- `leftElement`, `rightElement`: Icons or elements

#### Select
Dropdown select component.

```tsx
<Select
  label="Country"
  options={[
    { value: 'ca', label: 'Canada' },
    { value: 'us', label: 'United States' }
  ]}
/>
```

**Props:**
- `size`, `pixel`, `error`, `label`, `helperText`: Same as Input
- `options`: Array of `{ value: string; label: string }`

#### Checkbox
Checkbox with label and helper text.

```tsx
<Checkbox
  label="Accept terms and conditions"
  helperText="You must accept to continue"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>
```

#### Radio
Radio button with label.

```tsx
<Radio
  name="plan"
  value="basic"
  label="Basic Plan"
  checked={plan === 'basic'}
  onChange={(e) => setPlan(e.target.value)}
/>
```

### Feedback Components

#### Badge
Label and status indicator.

```tsx
<Badge variant="aurora-green">New</Badge>
<Badge variant="aurora-blue" dot>Active</Badge>
<Badge size="lg" pixel={false}>Premium</Badge>
```

**Props:**
- `variant`: Color variant (default: `'aurora-green'`)
- `size`: Badge size (default: `'md'`)
- `pixel`: Enable pixel aesthetic (default: `true`)
- `dot`: Show dot indicator

#### Alert
Alert messages with severity levels.

```tsx
<Alert severity="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert severity="error" closable onClose={() => {}}>
  An error occurred.
</Alert>
```

**Props:**
- `severity`: `'success' | 'error' | 'warning' | 'info'` (default: `'info'`)
- `title`: Alert title
- `closable`: Show close button
- `onClose`: Close callback

#### Toast
Toast notifications with provider.

```tsx
// Wrap app with provider
<ToastProvider>
  <App />
</ToastProvider>

// Use in components
function MyComponent() {
  const { showToast } = useToast();

  const handleClick = () => {
    showToast({
      message: 'Operation completed!',
      severity: 'success',
      duration: 5000,
      position: 'bottom-right'
    });
  };

  return <Button onClick={handleClick}>Show Toast</Button>;
}
```

**Options:**
- `message`: Toast message (required)
- `severity`: Message severity
- `duration`: Auto-hide duration in ms (0 = no auto-hide)
- `position`: Toast position on screen

### Display Components

#### Card
Content container with header and footer.

```tsx
<Card
  header={<h3>Card Title</h3>}
  footer={<Button>Learn More</Button>}
  borderColor="aurora-blue"
  hoverable
>
  Card content goes here
</Card>

<Card
  image="/image.jpg"
  imageAlt="Description"
>
  Card with image
</Card>
```

**Props:**
- `pixel`: Enable pixel aesthetic (default: `true`)
- `borderColor`: Border color variant (default: `'aurora-green'`)
- `hoverable`: Enable hover effects
- `header`, `footer`: Header and footer content
- `image`, `imageAlt`: Image and alt text

#### Tabs
Tabbed content organization.

```tsx
<Tabs
  tabs={[
    {
      id: 'profile',
      label: 'Profile',
      content: <ProfileContent />,
      icon: <UserIcon />
    },
    {
      id: 'settings',
      label: 'Settings',
      content: <SettingsContent />,
      disabled: true
    }
  ]}
  defaultTab="profile"
  onChange={(tabId) => console.log(tabId)}
/>
```

**Props:**
- `tabs`: Array of tab objects
- `defaultTab`: Default active tab ID
- `activeTab`: Controlled active tab
- `onChange`: Tab change callback
- `pixel`: Enable pixel aesthetic (default: `true`)
- `fullWidth`: Full width tabs

### Layout Components

#### Container
Page container with max-width.

```tsx
<Container maxWidth="lg">
  <h1>Page Content</h1>
</Container>
```

**Props:**
- `maxWidth`: `'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'` (default: `'lg'`)
- `center`: Center the container (default: `true`)
- `padding`: Add padding (default: `true`)

#### Grid
Grid layout system.

```tsx
<Grid cols={3} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

<Grid
  responsive={{
    mobile: 1,
    tablet: 2,
    desktop: 4
  }}
>
  {/* Responsive grid */}
</Grid>
```

**Props:**
- `cols`: Number of columns or `'auto'` (default: `'auto'`)
- `gap`: Gap size (default: `'md'`)
- `responsive`: Responsive column config

#### Stack
Flexbox stack layout.

```tsx
<Stack direction="horizontal" gap="md" align="center">
  <Button>Action 1</Button>
  <Button>Action 2</Button>
</Stack>
```

**Props:**
- `direction`: `'horizontal' | 'vertical'` (default: `'vertical'`)
- `gap`: Gap size (default: `'md'`)
- `align`: Align items (default: `'stretch'`)
- `justify`: Justify content (default: `'start'`)
- `wrap`: Wrap items (default: `false`)

## Theme Configuration

### Aurora Color Palette

The library uses an aurora-themed color palette:

- **Aurora Green** (`#00ff88`) - Primary, CTAs, success
- **Aurora Blue** (`#4d94ff`) - Secondary, trust
- **Aurora Purple** (`#a366ff`) - Culture, premium
- **Aurora Pink** (`#ff66cc`) - Accents, warmth
- **Midnight** (`#0a1128`) - Dark backgrounds
- **Ice** (`#e0f2ff`) - Light backgrounds

### Size Scale

- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

### Pixel Aesthetic

Most components support a `pixel` prop that enables retro 8-bit styling:

- 4px borders instead of 2px
- Box shadows for depth
- No border radius (sharp corners)
- Pixel-perfect hover effects

Set `pixel={false}` for modern, rounded variants.

## Utilities

### cn()
Class name utility combining clsx and tailwind-merge.

```tsx
import { cn } from '@yk-companion/ui';

<div className={cn('base-class', isActive && 'active-class')} />
```

### Theme Helpers

```tsx
import {
  colors,
  getColorClasses,
  getSizeClasses,
  getPixelShadow
} from '@yk-companion/ui';

// Get color configuration
const green = colors['aurora-green'];

// Get Tailwind classes
const bgClasses = getColorClasses('aurora-green', 'bg');
const textClasses = getColorClasses('aurora-blue', 'text');

// Get size classes
const padding = getSizeClasses('md', 'padding');

// Get pixel shadow
const shadow = getPixelShadow('aurora-green');
```

## TypeScript

All components are fully typed with TypeScript. Import types as needed:

```tsx
import type {
  ButtonProps,
  InputProps,
  ColorVariant,
  SizeVariant,
  Severity
} from '@yk-companion/ui';
```

## Tailwind CSS Configuration

To use this library, ensure your project has Tailwind CSS configured with the aurora color palette. Add to your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        'aurora-green': {
          DEFAULT: '#00ff88',
          dark: '#00cc6a',
        },
        'aurora-blue': {
          DEFAULT: '#4d94ff',
          dark: '#3d7ae0',
        },
        'aurora-purple': {
          DEFAULT: '#a366ff',
          dark: '#8c52e0',
        },
        'aurora-pink': {
          DEFAULT: '#ff66cc',
          dark: '#e052b3',
        },
        midnight: {
          DEFAULT: '#0a1128',
          dark: '#050814',
          light: '#151b3a',
        },
      },
    },
  },
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Credits

Made with love in Yellowknife, Northwest Territories
