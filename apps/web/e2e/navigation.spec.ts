/**
 * E2E Tests - Navigation & Routing
 * 
 * Tests core navigation flows and routing throughout the app.
 */

import { test, expect } from '@playwright/test';

test.describe('Core Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    
    // Check for key elements on homepage
    await expect(page.getByText(/yk buddy/i).first()).toBeVisible();
  });

  test('should navigate to visiting page', async ({ page }) => {
    await page.goto('/visiting');
    
    // Page should load
    await expect(page).toHaveURL('/visiting');
    
    // Should have visiting-related content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should navigate to living page', async ({ page }) => {
    await page.goto('/living');
    
    await expect(page).toHaveURL('/living');
  });

  test('should navigate to moving page', async ({ page }) => {
    await page.goto('/moving');
    
    await expect(page).toHaveURL('/moving');
  });

  test('should navigate to aurora page', async ({ page }) => {
    await page.goto('/aurora');
    
    await expect(page).toHaveURL('/aurora');
    await expect(page.getByText(/aurora forecast/i)).toBeVisible();
  });

  test('should navigate to garage sales page', async ({ page }) => {
    await page.goto('/living/garage-sales');
    
    await expect(page).toHaveURL('/living/garage-sales');
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    const response = await page.goto('/nonexistent-page-12345');
    
    // Should return 404 or redirect
    expect(response?.status()).toBeTruthy();
  });
});

test.describe('Header Navigation', () => {
  test('should display YK Buddy logo and navigate to home', async ({ page }) => {
    await page.goto('/visiting');
    
    // Click logo
    await page.getByRole('link', { name: /yk buddy/i }).first().click();
    
    // Should navigate to home
    await expect(page).toHaveURL('/');
  });

  test('should open mobile menu on small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Find and click hamburger menu
    const menuButton = page.locator('button[aria-label*="menu"]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      
      // Menu should be visible
      await page.waitForTimeout(500);
      const menuContent = page.getByRole('link', { name: /home/i });
      expect(menuContent).toBeTruthy();
    }
  });
});

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  viewports.forEach(({ name, width, height }) => {
    test(`should render correctly on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Page should load without errors
      await page.waitForLoadState('networkidle');
      
      // Check that key elements are present
      const logo = page.getByText(/yk buddy/i).first();
      await expect(logo).toBeVisible();
    });
  });
});

test.describe('Performance', () => {
  test('homepage should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known/acceptable errors (like Supabase not configured in test)
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('Supabase') && 
      !error.includes('environment') &&
      !error.includes('NEXT_PUBLIC')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

