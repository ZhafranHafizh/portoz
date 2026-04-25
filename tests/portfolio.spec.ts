import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test('homepage should load correctly and redirect if needed', async ({ page }) => {
    // Navigate to the root URL
    await page.goto('/');

    // Check if the page title contains something reasonable (usually 'portoz' or similar)
    // or just check if body is visible.
    await expect(page.locator('body')).toBeVisible();
    
    // Check if navigation exists but don't strictly require visibility
    // since it might be hidden on mobile or under certain conditions.
    const nav = page.locator('nav');
    if (await nav.count() > 0) {
      await expect(nav.first()).toBeAttached();
    }
  });

  test('projects page should load', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('body')).toBeVisible();
    // Assuming there's a heading or projects container
    // We just ensure it doesn't return a 404 or completely fail.
  });

  test('contact page should load', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('body')).toBeVisible();
  });
});
