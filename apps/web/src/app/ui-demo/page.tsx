'use client';

import React, { useState } from 'react';
import { User, Mail, Bell, Search } from 'lucide-react';

// Import UI components from the package
import { Button } from '@/../../packages/ui/src/components/Button';
import { Input } from '@/../../packages/ui/src/components/Input';
import { Select } from '@/../../packages/ui/src/components/Select';
import { Checkbox } from '@/../../packages/ui/src/components/Checkbox';
import { Radio } from '@/../../packages/ui/src/components/Radio';
import { Badge } from '@/../../packages/ui/src/components/Badge';
import { Alert } from '@/../../packages/ui/src/components/Alert';
import { Card } from '@/../../packages/ui/src/components/Card';
import { Tabs } from '@/../../packages/ui/src/components/Tabs';
import { ToastProvider, useToast } from '@/../../packages/ui/src/components/Toast';
import { Container } from '@/../../packages/ui/src/components/Container';
import { Grid } from '@/../../packages/ui/src/components/Grid';
import { Stack } from '@/../../packages/ui/src/components/Stack';

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
            YK-Companion UI Library Demo
          </h1>
          <p className="text-gray-400 text-xl">
            Aurora-themed components with pixel aesthetics
          </p>
          <div className="mt-4">
            <Badge variant="aurora-green">v1.0.0</Badge>
          </div>
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
              <h3 className="text-white mb-4 font-bold">States & Icons</h3>
              <Stack direction="horizontal" gap="md" wrap>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
                <Button leftIcon={<User className="w-4 h-4" />}>
                  With Left Icon
                </Button>
                <Button rightIcon={<Mail className="w-4 h-4" />}>
                  With Right Icon
                </Button>
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

            {/* Input with search */}
            <Input
              label="Search"
              placeholder="Search for anything..."
              leftElement={<Search className="w-5 h-5" />}
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
                { value: 'au', label: 'Australia' },
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

            <Alert severity="error" title="Error" closable onClose={() => console.log('Closed')}>
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
          <p className="text-gray-400 mb-4">Click the buttons to see toast notifications</p>
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
              Success Toast
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
              Error Toast
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
              Warning Toast
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
              Info Toast
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
          <p className="text-gray-400 mb-4">Resize your browser to see responsive behavior</p>
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
                <Button size="sm">Button 1</Button>
                <Button size="sm">Button 2</Button>
                <Button size="sm">Button 3</Button>
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

        {/* Pixel vs Modern Cards */}
        <Card
          header={<h2 className="text-2xl font-bold text-white">Pixel vs Modern Styling</h2>}
          borderColor="aurora-blue"
        >
          <Grid cols={2} gap="lg">
            <Card borderColor="aurora-green" pixel hoverable>
              <h3 className="text-white font-bold text-xl mb-2">
                Pixel Style (Default)
              </h3>
              <p className="text-gray-400 mb-4">
                Retro 8-bit aesthetic with 4px borders, sharp corners, and pixel-perfect shadows
              </p>
              <Button>Pixel Button</Button>
            </Card>

            <Card borderColor="aurora-blue" pixel={false} hoverable>
              <h3 className="text-white font-bold text-xl mb-2">
                Modern Style
              </h3>
              <p className="text-gray-400 mb-4">
                Smooth rounded corners, gradients, and modern shadow effects
              </p>
              <Button pixel={false}>Modern Button</Button>
            </Card>
          </Grid>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-gray-400">
          <p>Made with ❤️ in Yellowknife, Northwest Territories</p>
          <p className="mt-2">
            <Badge variant="aurora-green">@yk-companion/ui v1.0.0</Badge>
          </p>
        </div>
      </Stack>
    </Container>
  );
}

export default function UIDemo() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0a1128] via-[#151b3a] to-[#0a1128] py-12">
        <ComponentShowcase />
      </div>
    </ToastProvider>
  );
}
