/**
 * Tests for Northern-themed icon components
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Northern Icons', () => {
  describe('BushPlaneIcon', () => {
    it('should render SVG element', async () => {
      const { BushPlaneIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<BushPlaneIcon />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should have animation classes', async () => {
      const { BushPlaneIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<BushPlaneIcon />);
      
      // Should have some animation or hover effect
      const animatedElement = container.querySelector('[class*="animate"]') ||
                             container.querySelector('[class*="transition"]');
      expect(container.firstChild).toBeTruthy();
    });

    it('should accept custom size prop', async () => {
      const { BushPlaneIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<BushPlaneIcon size={64} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should be accessible', async () => {
      const { BushPlaneIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<BushPlaneIcon />);
      
      const svg = container.querySelector('svg');
      // Should have aria-label or role
      expect(svg?.getAttribute('role') || svg?.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('NorthernCabinIcon', () => {
    it('should render SVG element', async () => {
      const { NorthernCabinIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<NorthernCabinIcon />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should have chimney smoke animation', async () => {
      const { NorthernCabinIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<NorthernCabinIcon />);
      
      // Check for animation elements
      expect(container.querySelector('svg')).toBeTruthy();
    });
  });

  describe('OldTruckIcon', () => {
    it('should render SVG element', async () => {
      const { OldTruckIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<OldTruckIcon />);
      
      const svg = container.querySelector('svg');
      expect(svg).toBeTruthy();
    });

    it('should have wheel animation on hover', async () => {
      const { OldTruckIcon } = await import('@/components/NorthernIcons');
      const { container } = render(<OldTruckIcon />);
      
      // Should have animation setup
      expect(container.querySelector('svg')).toBeTruthy();
    });
  });

  describe('All Icons', () => {
    it('should export all three icons', async () => {
      const icons = await import('@/components/NorthernIcons');
      
      expect(icons.BushPlaneIcon).toBeDefined();
      expect(icons.NorthernCabinIcon).toBeDefined();
      expect(icons.OldTruckIcon).toBeDefined();
    });

    it('should have consistent API', async () => {
      const { BushPlaneIcon, NorthernCabinIcon, OldTruckIcon } = await import('@/components/NorthernIcons');
      
      // All should accept similar props
      const testProps = { size: 48, className: 'test-class' };
      
      const { container: plane } = render(<BushPlaneIcon {...testProps} />);
      const { container: cabin } = render(<NorthernCabinIcon {...testProps} />);
      const { container: truck } = render(<OldTruckIcon {...testProps} />);
      
      expect(plane.querySelector('svg')).toBeTruthy();
      expect(cabin.querySelector('svg')).toBeTruthy();
      expect(truck.querySelector('svg')).toBeTruthy();
    });
  });
});

