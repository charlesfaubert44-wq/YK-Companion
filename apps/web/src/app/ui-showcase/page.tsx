'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui';

export default function UIShowcasePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
            shadcn/ui Component Showcase
          </h1>
          <p className="text-xl text-gray-400">
            YK Buddy's UI components powered by shadcn/ui with Aurora theming
          </p>
        </div>

        {/* Buttons Section */}
        <Card className="bg-dark-800 border-aurora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl text-aurora-green">Buttons</CardTitle>
            <CardDescription className="text-gray-400">
              Various button styles and variants
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="aurora">Aurora</Button>
              <Button variant="pixel">Pixel</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🎨</Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-aurora-green/20 to-transparent border-aurora-green/50">
            <CardHeader>
              <CardTitle className="text-aurora-green">Northern Lights</CardTitle>
              <CardDescription className="text-gray-300">
                Aurora Borealis Viewing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Experience the magic of the northern lights in Yellowknife.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="aurora" className="w-full">View Forecast</Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-aurora-blue/20 to-transparent border-aurora-blue/50">
            <CardHeader>
              <CardTitle className="text-aurora-blue">Garage Sales</CardTitle>
              <CardDescription className="text-gray-300">
                TSP Route Optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Plan your perfect garage sale route with our smart planner.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-aurora-blue text-aurora-blue">
                Plan Route
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-gradient-to-br from-aurora-purple/20 to-transparent border-aurora-purple/50">
            <CardHeader>
              <CardTitle className="text-aurora-purple">Premium</CardTitle>
              <CardDescription className="text-gray-300">
                Unlock All Features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Get unlimited access to all YK Buddy premium features.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default" className="w-full bg-aurora-purple hover:bg-aurora-purple/80">
                Upgrade Now
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Forms Section */}
        <Card className="bg-dark-800 border-aurora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl text-aurora-blue">Form Components</CardTitle>
            <CardDescription className="text-gray-400">
              Input fields, selects, and checkboxes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="bg-dark-900 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="bg-dark-900 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-300">City</Label>
              <Select>
                <SelectTrigger className="bg-dark-900 border-gray-700 text-white">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent className="bg-dark-900 border-gray-700">
                  <SelectItem value="yellowknife">Yellowknife</SelectItem>
                  <SelectItem value="whitehorse">Whitehorse</SelectItem>
                  <SelectItem value="iqaluit">Iqaluit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your experience..."
                className="bg-dark-900 border-gray-700 text-white min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={checked}
                onCheckedChange={(checked) => setChecked(checked as boolean)}
                className="border-aurora-green data-[state=checked]:bg-aurora-green"
              />
              <Label htmlFor="terms" className="text-gray-300 cursor-pointer">
                I agree to the terms and conditions
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <Card className="bg-dark-800 border-aurora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl text-aurora-purple">Badges</CardTitle>
            <CardDescription className="text-gray-400">
              Status indicators and labels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="aurora">Aurora Active</Badge>
              <Badge variant="pixel">Pixel Style</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Card className="bg-dark-800 border-aurora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl text-aurora-green">Tabs</CardTitle>
            <CardDescription className="text-gray-400">
              Navigate between different content sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visiting" className="w-full">
              <TabsList className="bg-dark-900 grid w-full grid-cols-3">
                <TabsTrigger value="visiting" className="data-[state=active]:bg-aurora-green data-[state=active]:text-black">
                  Visiting
                </TabsTrigger>
                <TabsTrigger value="living" className="data-[state=active]:bg-aurora-blue data-[state=active]:text-black">
                  Living
                </TabsTrigger>
                <TabsTrigger value="moving" className="data-[state=active]:bg-aurora-purple data-[state=active]:text-black">
                  Moving
                </TabsTrigger>
              </TabsList>
              <TabsContent value="visiting" className="text-gray-300 mt-4">
                <h3 className="text-xl font-semibold text-aurora-green mb-2">Visiting Yellowknife</h3>
                <p>Plan your trip to see the northern lights, explore local culture, and experience the midnight sun.</p>
              </TabsContent>
              <TabsContent value="living" className="text-gray-300 mt-4">
                <h3 className="text-xl font-semibold text-aurora-blue mb-2">Living in Yellowknife</h3>
                <p>Find garage sales, local events, and connect with the community. Your friendly companion for daily life.</p>
              </TabsContent>
              <TabsContent value="moving" className="text-gray-300 mt-4">
                <h3 className="text-xl font-semibold text-aurora-purple mb-2">Moving to Yellowknife</h3>
                <p>Everything you need to know about relocating: housing, jobs, schools, and settling into northern life.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Dialog Section */}
        <Card className="bg-dark-800 border-aurora-blue/30">
          <CardHeader>
            <CardTitle className="text-2xl text-aurora-pink">Dialog (Modal)</CardTitle>
            <CardDescription className="text-gray-400">
              Accessible modal dialogs with shadcn/ui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="aurora">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-b from-northern-midnight to-dark-900 border-aurora-blue/50 text-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                    Welcome to YK Buddy
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Your friendly companion for Yellowknife. Because nobody should face -40° alone!
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-gray-300">
                  <p>This dialog component uses shadcn/ui with our custom aurora theming.</p>
                  <p className="mt-4">Features include:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Accessible keyboard navigation</li>
                    <li>Focus management</li>
                    <li>Custom styling support</li>
                    <li>Animation on open/close</li>
                  </ul>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="aurora" onClick={() => setDialogOpen(false)}>
                    Get Started
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-500 py-8">
          <p>Built with shadcn/ui, Next.js 14, and Tailwind CSS</p>
          <p className="mt-2">Aurora-themed components for YK Buddy</p>
        </div>
      </div>
    </div>
  );
}
