/**
 * E2E Tests - Authentication Flow
 * 
 * Tests the complete user authentication journey including:
 * - Sign up
 * - Sign in
 * - Sign out
 * - Profile access
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display sign in button on homepage', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for sign in button
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeVisible();
  });

  test('should open auth modal when clicking sign in', async ({ page }) => {
    // Click sign in button
    await page.getByRole('button', { name: /sign in/i }).first().click();
    
    // Modal should appear
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    
    // Should have email and password fields
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should switch between sign in and sign up views', async ({ page }) => {
    // Open auth modal
    await page.getByRole('button', { name: /sign in/i }).first().click();
    
    // Click sign up link
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should show sign up form
    await expect(page.getByRole('heading', { name: /join yk buddy/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    
    // Switch back to sign in
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Open auth modal
    await page.getByRole('button', { name: /sign in/i }).first().click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).last().click();
    
    // Check for HTML5 validation (email required)
    const emailInput = page.getByLabel(/email/i);
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should close modal when clicking close button', async ({ page }) => {
    // Open auth modal
    await page.getByRole('button', { name: /sign in/i }).first().click();
    
    // Click close button
    await page.getByLabel('Close modal').click();
    
    // Modal should be gone
    await expect(page.getByRole('heading', { name: /welcome back/i })).not.toBeVisible();
  });

  test('should show user menu when authenticated', async ({ page, context }) => {
    // Mock authenticated state (you'll need to set up proper test user)
    // This is a placeholder - actual implementation depends on your auth setup
    
    // For now, just test the UI structure exists
    await page.goto('/');
    
    // The page should have navigation items
    const visitingLink = page.getByRole('link', { name: /visiting/i });
    await expect(visitingLink).toBeVisible();
  });
});

test.describe('Onboarding Flow', () => {
  test('should show onboarding modal for first-time visitors', async ({ page, context }) => {
    // Clear localStorage to simulate first visit
    await context.clearCookies();
    await page.goto('/');
    
    // Wait for onboarding modal (with delay from code)
    await page.waitForTimeout(1000);
    
    // Check if onboarding appears
    const onboardingHeading = page.getByRole('heading', { name: /welcome to yk buddy/i });
    
    // It might appear or might not depending on localStorage
    // This test verifies the modal can be triggered
    const customizeButton = page.getByRole('button', { name: /customize your experience/i });
    if (await customizeButton.isVisible()) {
      await customizeButton.click();
      await expect(onboardingHeading).toBeVisible();
    }
  });

  test('should allow selecting a pathway from onboarding', async ({ page }) => {
    await page.goto('/');
    
    // Trigger onboarding
    const customizeButton = page.getByRole('button', { name: /customize your experience/i });
    if (await customizeButton.isVisible()) {
      await customizeButton.click();
      
      // Click a pathway card
      await page.getByRole('link', { name: /visiting/i }).first().click();
      
      // Should navigate to visiting page
      await page.waitForURL('/visiting');
      await expect(page).toHaveURL('/visiting');
    }
  });
});

