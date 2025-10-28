import CarouselExamples from '@/components/CarouselExamples';

/**
 * Carousel Demo Page
 *
 * Route: /carousel-demo
 *
 * This page showcases all carousel examples and can be used for:
 * - Testing carousel functionality
 * - Visual reference for implementations
 * - Copy-paste code examples
 *
 * To view: Navigate to http://localhost:3000/carousel-demo
 */
export default function CarouselDemoPage() {
  return <CarouselExamples />;
}

export const metadata = {
  title: 'Carousel Demo - YK Companion',
  description: 'Interactive examples of the mobile-first carousel component',
};
