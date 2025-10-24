# Component Examples

This file provides comprehensive examples of all components in the @yk-companion/ui library.

## Complete Demo Application

```tsx
import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Checkbox,
  Radio,
  Badge,
  Alert,
  Card,
  Tabs,
  ToastProvider,
  useToast,
  Container,
  Grid,
  Stack,
  ColorVariant,
} from '@yk-companion/ui';
import { User, Mail, Bell } from 'lucide-react';

function ComponentShowcase() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('ca');
  const [accepted, setAccepted] = useState(false);
  const [plan, setPlan] = useState('basic');

  return (
    <Container maxWidth="2xl">
      <Stack direction="vertical" gap="xl">
        {/* Header */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold text-[#00ff88] mb-4">
            YK-Companion UI Library
          </h1>
          <p className="text-gray-400 text-xl">
            Aurora-themed components with pixel aesthetics
          </p>
        </div>

        {/* Buttons Section */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Buttons</h2>}
          borderColor="aurora-green"
        >
          <Stack direction="vertical" gap="lg">
            {/* Variants */}
            <div>
              <h3 className="text-white mb-4 font-bold">Variants</h3>
              <Stack direction="horizontal" gap="md" wrap>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </Stack>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-white mb-4 font-bold">Sizes</h3>
              <Stack direction="horizontal" gap="md" align="center" wrap>
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </Stack>
            </div>

            {/* States */}
            <div>
              <h3 className="text-white mb-4 font-bold">States</h3>
              <Stack direction="horizontal" gap="md" wrap>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button leftIcon={<User className="w-4 h-4" />}>
                  With Left Icon
                </Button>
                <Button rightIcon={<Mail className="w-4 h-4" />}>
                  With Right Icon
                </Button>
                <Button fullWidth>Full Width</Button>
              </Stack>
            </div>

            {/* Pixel vs Modern */}
            <div>
              <h3 className="text-white mb-4 font-bold">Pixel vs Modern</h3>
              <Stack direction="horizontal" gap="md" wrap>
                <Button pixel>Pixel Style</Button>
                <Button pixel={false}>Modern Style</Button>
              </Stack>
            </div>
          </Stack>
        </Card>

        {/* Form Components */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Form Components</h2>}
          borderColor="aurora-blue"
        >
          <Stack direction="vertical" gap="lg">
            {/* Input */}
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              helperText="We'll never share your email"
              leftElement={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Input with error */}
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              error
              helperText="Password must be at least 8 characters"
            />

            {/* Select */}
            <Select
              label="Country"
              helperText="Select your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={[
                { value: 'ca', label: 'Canada' },
                { value: 'us', label: 'United States' },
                { value: 'uk', label: 'United Kingdom' },
              ]}
            />

            {/* Checkbox */}
            <Checkbox
              label="Accept terms and conditions"
              helperText="You must accept the terms to continue"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />

            {/* Radio Group */}
            <div>
              <p className="text-[#00ff88] font-bold mb-2 text-sm">Select Plan</p>
              <Stack direction="vertical" gap="sm">
                <Radio
                  name="plan"
                  value="basic"
                  label="Basic Plan"
                  helperText="Free forever"
                  checked={plan === 'basic'}
                  onChange={(e) => setPlan(e.target.value)}
                />
                <Radio
                  name="plan"
                  value="pro"
                  label="Pro Plan"
                  helperText="$10/month"
                  checked={plan === 'pro'}
                  onChange={(e) => setPlan(e.target.value)}
                />
                <Radio
                  name="plan"
                  value="enterprise"
                  label="Enterprise Plan"
                  helperText="Contact sales"
                  checked={plan === 'enterprise'}
                  onChange={(e) => setPlan(e.target.value)}
                />
              </Stack>
            </div>

            {/* Submit Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={() =>
                showToast({
                  message: 'Form submitted successfully!',
                  severity: 'success',
                })
              }
            >
              Submit Form
            </Button>
          </Stack>
        </Card>

        {/* Badges */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Badges</h2>}
          borderColor="aurora-purple"
        >
          <Stack direction="vertical" gap="lg">
            {/* Colors */}
            <div>
              <h3 className="text-white mb-4 font-bold">Colors</h3>
              <Stack direction="horizontal" gap="md" wrap>
                <Badge variant="aurora-green">New</Badge>
                <Badge variant="aurora-blue">Info</Badge>
                <Badge variant="aurora-purple">Premium</Badge>
                <Badge variant="aurora-pink">Hot</Badge>
                <Badge variant="midnight">Dark</Badge>
                <Badge variant="gray">Neutral</Badge>
              </Stack>
            </div>

            {/* With Dot */}
            <div>
              <h3 className="text-white mb-4 font-bold">With Dot Indicator</h3>
              <Stack direction="horizontal" gap="md" wrap>
                <Badge variant="aurora-green" dot>Online</Badge>
                <Badge variant="aurora-blue" dot>Active</Badge>
                <Badge variant="aurora-pink" dot>Live</Badge>
              </Stack>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-white mb-4 font-bold">Sizes</h3>
              <Stack direction="horizontal" gap="md" align="center" wrap>
                <Badge size="xs">XS</Badge>
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
                <Badge size="xl">Extra Large</Badge>
              </Stack>
            </div>
          </Stack>
        </Card>

        {/* Alerts */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Alerts</h2>}
          borderColor="aurora-pink"
        >
          <Stack direction="vertical" gap="md">
            <Alert severity="success" title="Success!">
              Your changes have been saved successfully.
            </Alert>

            <Alert severity="error" title="Error" closable onClose={() => {}}>
              An error occurred while processing your request.
            </Alert>

            <Alert severity="warning" title="Warning">
              This action cannot be undone. Please proceed with caution.
            </Alert>

            <Alert severity="info">
              This is an informational message without a title.
            </Alert>
          </Stack>
        </Card>

        {/* Toasts */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Toast Notifications</h2>}
          borderColor="aurora-green"
        >
          <Grid cols={2} gap="md">
            <Button
              variant="primary"
              onClick={() =>
                showToast({
                  message: 'Success toast message!',
                  severity: 'success',
                  position: 'top-right',
                })
              }
            >
              Show Success Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                showToast({
                  message: 'Error toast message!',
                  severity: 'error',
                  position: 'top-right',
                })
              }
            >
              Show Error Toast
            </Button>

            <Button
              variant="accent"
              onClick={() =>
                showToast({
                  message: 'Warning toast message!',
                  severity: 'warning',
                  position: 'bottom-center',
                })
              }
            >
              Show Warning Toast
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                showToast({
                  message: 'Info toast message!',
                  severity: 'info',
                  position: 'bottom-left',
                  duration: 3000,
                })
              }
            >
              Show Info Toast
            </Button>
          </Grid>
        </Card>

        {/* Tabs */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Tabs</h2>}
          borderColor="aurora-blue"
        >
          <Tabs
            tabs={[
              {
                id: 'profile',
                label: 'Profile',
                icon: <User className="w-4 h-4" />,
                content: (
                  <Stack direction="vertical" gap="md">
                    <p className="text-gray-300">
                      Profile settings and information go here.
                    </p>
                    <Input label="Full Name" placeholder="John Doe" />
                    <Input label="Bio" placeholder="Tell us about yourself" />
                    <Button>Save Profile</Button>
                  </Stack>
                ),
              },
              {
                id: 'notifications',
                label: 'Notifications',
                icon: <Bell className="w-4 h-4" />,
                content: (
                  <Stack direction="vertical" gap="md">
                    <p className="text-gray-300">
                      Notification preferences go here.
                    </p>
                    <Checkbox label="Email notifications" />
                    <Checkbox label="Push notifications" />
                    <Checkbox label="SMS notifications" />
                    <Button>Save Preferences</Button>
                  </Stack>
                ),
              },
              {
                id: 'security',
                label: 'Security',
                disabled: true,
                content: <p>Security settings</p>,
              },
            ]}
          />
        </Card>

        {/* Grid Layout */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Grid Layout</h2>}
          borderColor="aurora-purple"
        >
          <Grid cols={3} gap="md">
            <Card borderColor="aurora-green" hoverable>
              <h3 className="text-white font-bold mb-2">Card 1</h3>
              <p className="text-gray-400">Grid item with auto layout</p>
            </Card>
            <Card borderColor="aurora-blue" hoverable>
              <h3 className="text-white font-bold mb-2">Card 2</h3>
              <p className="text-gray-400">Grid item with auto layout</p>
            </Card>
            <Card borderColor="aurora-purple" hoverable>
              <h3 className="text-white font-bold mb-2">Card 3</h3>
              <p className="text-gray-400">Grid item with auto layout</p>
            </Card>
          </Grid>
        </Card>

        {/* Responsive Grid */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Responsive Grid</h2>}
          borderColor="aurora-pink"
        >
          <Grid
            responsive={{
              mobile: 1,
              tablet: 2,
              desktop: 4,
            }}
            gap="md"
          >
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} borderColor="aurora-pink">
                <h3 className="text-white font-bold">Item {i}</h3>
                <p className="text-gray-400 text-sm">
                  1 col on mobile, 2 on tablet, 4 on desktop
                </p>
              </Card>
            ))}
          </Grid>
        </Card>

        {/* Stack Layouts */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Stack Layouts</h2>}
          borderColor="aurora-green"
        >
          <Stack direction="vertical" gap="lg">
            {/* Horizontal Stack */}
            <div>
              <h3 className="text-white mb-4 font-bold">Horizontal Stack</h3>
              <Stack direction="horizontal" gap="md" justify="center">
                <Button>Button 1</Button>
                <Button>Button 2</Button>
                <Button>Button 3</Button>
              </Stack>
            </div>

            {/* Vertical Stack */}
            <div>
              <h3 className="text-white mb-4 font-bold">Vertical Stack</h3>
              <Stack direction="vertical" gap="sm">
                <Badge>Item 1</Badge>
                <Badge>Item 2</Badge>
                <Badge>Item 3</Badge>
              </Stack>
            </div>

            {/* Stack with alignment */}
            <div>
              <h3 className="text-white mb-4 font-bold">
                Stack with Space Between
              </h3>
              <Stack direction="horizontal" justify="between" align="center">
                <span className="text-white">Left Content</span>
                <Badge variant="aurora-green">Center</Badge>
                <Button size="sm">Right Action</Button>
              </Stack>
            </div>
          </Stack>
        </Card>

        {/* Feature Cards */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Feature Cards</h2>}
          borderColor="aurora-blue"
        >
          <Grid cols="auto" gap="lg">
            <Card
              image="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400"
              imageAlt="Technology"
              borderColor="aurora-green"
              hoverable
              footer={<Button fullWidth>Learn More</Button>}
            >
              <h3 className="text-white font-bold text-xl mb-2">
                Modern Design
              </h3>
              <p className="text-gray-400">
                Beautiful components with aurora-themed aesthetics
              </p>
            </Card>

            <Card
              image="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400"
              imageAlt="Code"
              borderColor="aurora-blue"
              hoverable
              footer={<Button fullWidth variant="secondary">Learn More</Button>}
            >
              <h3 className="text-white font-bold text-xl mb-2">
                TypeScript Support
              </h3>
              <p className="text-gray-400">
                Full type safety with TypeScript definitions
              </p>
            </Card>

            <Card
              image="https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=400"
              imageAlt="Mobile"
              borderColor="aurora-purple"
              hoverable
              footer={<Button fullWidth variant="accent">Learn More</Button>}
            >
              <h3 className="text-white font-bold text-xl mb-2">
                Mobile First
              </h3>
              <p className="text-gray-400">
                Responsive design for all screen sizes
              </p>
            </Card>
          </Grid>
        </Card>
      </Stack>
    </Container>
  );
}

// App wrapper with ToastProvider
export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1128] via-[#151b3a] to-[#0a1128] py-12">
        <ComponentShowcase />
      </div>
    </ToastProvider>
  );
}
```

## Quick Start Templates

### Form Template

```tsx
import { Button, Input, Select, Checkbox } from '@yk-companion/ui';

function RegistrationForm() {
  return (
    <form className="space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        required
      />
      <Select
        label="Country"
        options={[
          { value: 'ca', label: 'Canada' },
          { value: 'us', label: 'USA' },
        ]}
        required
      />
      <Checkbox
        label="I agree to the terms and conditions"
        required
      />
      <Button type="submit" fullWidth>
        Register
      </Button>
    </form>
  );
}
```

### Dashboard Template

```tsx
import { Container, Grid, Card, Badge, Stack } from '@yk-companion/ui';

function Dashboard() {
  return (
    <Container maxWidth="2xl">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <Grid cols={3} gap="lg">
        <Card borderColor="aurora-green">
          <Stack direction="vertical" gap="sm">
            <Stack direction="horizontal" justify="between" align="center">
              <h3 className="text-white">Total Users</h3>
              <Badge variant="aurora-green">+12%</Badge>
            </Stack>
            <p className="text-4xl font-bold text-[#00ff88]">1,234</p>
          </Stack>
        </Card>

        <Card borderColor="aurora-blue">
          <Stack direction="vertical" gap="sm">
            <Stack direction="horizontal" justify="between" align="center">
              <h3 className="text-white">Revenue</h3>
              <Badge variant="aurora-blue">+8%</Badge>
            </Stack>
            <p className="text-4xl font-bold text-[#4d94ff]">$12.5K</p>
          </Stack>
        </Card>

        <Card borderColor="aurora-purple">
          <Stack direction="vertical" gap="sm">
            <Stack direction="horizontal" justify="between" align="center">
              <h3 className="text-white">Active Sessions</h3>
              <Badge variant="aurora-purple" dot>Live</Badge>
            </Stack>
            <p className="text-4xl font-bold text-[#a366ff]">456</p>
          </Stack>
        </Card>
      </Grid>
    </Container>
  );
}
```

### Settings Page Template

```tsx
import { Container, Card, Tabs, Input, Checkbox, Button, Stack } from '@yk-companion/ui';

function Settings() {
  return (
    <Container maxWidth="lg">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      <Tabs
        tabs={[
          {
            id: 'general',
            label: 'General',
            content: (
              <Stack direction="vertical" gap="md">
                <Input label="Username" placeholder="johndoe" />
                <Input label="Email" type="email" placeholder="john@example.com" />
                <Button>Save Changes</Button>
              </Stack>
            ),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            content: (
              <Stack direction="vertical" gap="md">
                <Checkbox label="Email notifications" />
                <Checkbox label="Push notifications" />
                <Checkbox label="SMS notifications" />
                <Button>Save Preferences</Button>
              </Stack>
            ),
          },
        ]}
      />
    </Container>
  );
}
```

## Integration Examples

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';
import { Input, Button, Select } from '@yk-companion/ui';

function FormWithValidation() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...register('email', { required: true })}
        error={!!errors.email}
        helperText={errors.email && 'Email is required'}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### With State Management

```tsx
import { create } from 'zustand';
import { useToast } from '@yk-companion/ui';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

function UserProfile() {
  const { showToast } = useToast();
  const { user, setUser } = useStore();

  const handleSave = () => {
    // Save user
    showToast({
      message: 'Profile updated!',
      severity: 'success',
    });
  };

  return (
    // Your component
  );
}
```
