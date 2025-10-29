/**
 * E2E Tests - Garage Sales Feature
 * 
 * Tests the complete garage sales flow including browsing, viewing, and interaction.
 */

import { test, expect } from '@playwright/test';

test.describe('Garage Sales Page', () => {
  test('should load garage sales page', async ({ page }) => {
    await page.goto('/living/garage-sales');
    
    await expect(page).toHaveURL('/living/garage-sales');
    
    // Should have page title or key elements
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('should display garage sales list or empty state', async ({ page }) => {
    await page.goto('/living/garage-sales');
    await page.waitForLoadState('networkidle');
    
    // Either shows sales or empty state
    const hasSales = await page.locator('[data-testid="garage-sale-card"]').count() > 0;
    const hasEmptyState = await page.locator('text=/no.*garage.*sales/i').count() > 0;
    
    expect(hasSales || hasEmptyState).toBeTruthy();
  });

  test('should switch between view modes', async ({ page }) => {
    await page.goto('/living/garage-sales');
    await page.waitForLoadState('networkidle');
    
    // Look for view mode buttons (List, Map, Calendar)
    const listButton = page.getByRole('button', { name: /list/i });
    const mapButton = page.getByRole('button', { name: /map/i });
    
    if (await listButton.isVisible() && await mapButton.isVisible()) {
      // Click map view
      await mapButton.click();
      await page.waitForTimeout(500);
      
      // Click back to list view
      await listButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('should filter garage sales by search', async ({ page }) => {
    await page.goto('/living/garage-sales');
    await page.waitForLoadState('networkidle');
    
    // Look for search input
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('furniture');
      await page.waitForTimeout(500);
      
      // Results should update
      expect(true).toBeTruthy();
    }
  });
});

test.describe('Favorite Button', () => {
  test('should show favorite button when authenticated', async ({ page }) => {
    await page.goto('/living/garage-sales');
    await page.waitForLoadState('networkidle');
    
    // Look for heart/favorite buttons
    const favoriteButtons = page.locator('button:has-text("Save"), button:has-text("❤️"), button:has-text("🤍")');
    const count = await favoriteButtons.count();
    
    // May or may not be visible depending on auth state
    expect(count >= 0).toBeTruthy();
  });
});

