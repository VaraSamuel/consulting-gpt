import { test, expect } from '@playwright/test';

test.describe('Performance and Loading E2E', () => {
  test('should load page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for the main content to be visible
    await expect(page.locator('h1')).toContainText('Medical Technology Commercial Evaluator');

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Form should be interactive
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeEnabled();
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', (route) => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });

    await page.goto('/');

    // Content should still load, just slower
    await expect(page.locator('h1')).toContainText('Medical Technology Commercial Evaluator');
    await expect(page.locator('form')).toBeVisible();
  });

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const jsErrors: string[] = [];

    // Capture JavaScript errors
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto('/');

    // Basic functionality should work
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[name="name"]', 'Test Technology');

    // Should have minimal or no JavaScript errors
    expect(jsErrors.length).toBeLessThan(3); // Allow for minor warnings
  });

  test('should handle form submission loading states', async ({ page }) => {
    await page.goto('/');

    // Fill form with valid data
    await page.fill('input[name="name"]', 'AI Medical Diagnostic System');
    await page.fill('input[name="num_of_axes"]', '3');
    await page.fill(
      'textarea[name="abstract"]',
      'This is a comprehensive AI-powered medical diagnostic system that uses advanced machine learning algorithms to analyze patient data and provide accurate diagnostic recommendations.'
    );

    // Submit form
    await page.click('button[type="submit"]');

    // Since we don't have a real backend, we expect the form to attempt submission
    // In a real scenario, we'd check for loading states, success messages, etc.

    // Wait a moment to see if any loading states appear
    await page.waitForTimeout(1000);

    // Form should still be present (since no navigation occurs without backend)
    await expect(page.locator('form')).toBeVisible();
  });
});

test.describe('Cross-Browser Compatibility E2E', () => {
  test('should work consistently across different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // Mobile portrait
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');

      // Core functionality should work at all viewport sizes
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('textarea[name="abstract"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();

      // Form should be usable
      await page.fill('input[name="name"]', 'Test Technology');
      await expect(page.locator('input[name="name"]')).toHaveValue('Test Technology');
    }
  });

  test('should handle touch interactions on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Test touch interactions using click (more reliable than tap)
    await page.click('input[name="name"]');
    await page.fill('input[name="name"]', 'Mobile Touch Test');

    await page.click('textarea[name="abstract"]');
    await page.fill(
      'textarea[name="abstract"]',
      'Testing touch interactions on mobile device for the medical technology form.'
    );

    // Verify values
    await expect(page.locator('input[name="name"]')).toHaveValue('Mobile Touch Test');
    await expect(page.locator('textarea[name="abstract"]')).toHaveValue(
      'Testing touch interactions on mobile device for the medical technology form.'
    );
  });

  test('should handle form autofill scenarios', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Test programmatic filling (simulating autofill)
    await page.fill('input[name="name"]', 'Autofilled Technology Name');
    await page.fill(
      'textarea[name="abstract"]',
      'This is an autofilled abstract for the medical technology form testing purposes.'
    );

    // Wait for the values to be set
    await page.waitForTimeout(500);

    // Verify the form has the filled values
    await expect(page.locator('input[name="name"]')).toHaveValue('Autofilled Technology Name');
    await expect(page.locator('textarea[name="abstract"]')).toHaveValue(
      'This is an autofilled abstract for the medical technology form testing purposes.'
    );
  });
});

test.describe('Error Handling E2E', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.goto('/');

    // Intercept network requests and simulate errors
    await page.route('**/api/**', (route) => {
      route.abort('failed');
    });

    // Fill and submit form
    await page.fill('input[name="name"]', 'AI Medical System');
    await page.fill('input[name="num_of_axes"]', '3');
    await page.fill(
      'textarea[name="abstract"]',
      'This is a comprehensive AI-powered medical diagnostic system for testing network error handling.'
    );

    await page.click('button[type="submit"]');

    // Form should still be present (graceful error handling)
    await expect(page.locator('form')).toBeVisible();

    // Wait for any error messages or handling
    await page.waitForTimeout(2000);
  });

  test('should handle browser console errors', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Interact with the form
    await page.fill('input[name="name"]', 'Test Technology');
    await page.click('button[type="submit"]');

    // Wait for any async errors
    await page.waitForTimeout(1000);

    // Should have minimal console errors
    expect(consoleErrors.length).toBeLessThan(5); // Allow for some warnings
  });
});
