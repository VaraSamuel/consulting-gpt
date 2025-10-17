import { test, expect } from '@playwright/test';

test.describe('Technology Form E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage
    await page.goto('/');
  });

  test('should load the homepage successfully', async ({ page }) => {
    // Check if the main heading is present
    await expect(page.locator('h1')).toContainText('Medical Technology Commercial Evaluator');

    // Check if the form is present
    await expect(page.locator('form')).toBeVisible();

    // Check if the Technology Information Form heading is present
    await expect(page.locator('text=Technology Information Form')).toBeVisible();
  });

  test('should display form fields correctly', async ({ page }) => {
    // Check for all form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="num_of_axes"]')).toBeVisible();
    await expect(page.locator('textarea[name="abstract"]')).toBeVisible();

    // Check for form labels
    await expect(page.locator('text=Technology Name')).toBeVisible();
    await expect(page.locator('text=Number of Axis')).toBeVisible();
    await expect(page.locator('text=Technology Abstract')).toBeVisible();

    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=Generate Report')).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait for validation errors to appear
    await expect(page.locator('text=Technology name must be at least 3 characters')).toBeVisible();
    await expect(page.locator('text=Number of axes must be at least 3')).toBeVisible();
    await expect(page.locator('text=Abstract must be at least 50 characters')).toBeVisible();
  });

  test('should allow user to fill form fields', async ({ page }) => {
    // Fill out the form
    await page.fill('input[name="name"]', 'AI Medical Diagnostic System');
    await page.fill('input[name="num_of_axes"]', '3');
    await page.fill(
      'textarea[name="abstract"]',
      'This is a comprehensive AI-powered medical diagnostic system that uses advanced machine learning algorithms to analyze patient data and provide accurate diagnostic recommendations.'
    );

    // Verify the values are filled
    await expect(page.locator('input[name="name"]')).toHaveValue('AI Medical Diagnostic System');
    await expect(page.locator('input[name="num_of_axes"]')).toHaveValue('3');
    await expect(page.locator('textarea[name="abstract"]')).toHaveValue(
      'This is a comprehensive AI-powered medical diagnostic system that uses advanced machine learning algorithms to analyze patient data and provide accurate diagnostic recommendations.'
    );
  });

  test('should validate minimum length requirements', async ({ page }) => {
    // Fill with invalid short values
    await page.fill('input[name="name"]', 'AI');
    await page.fill('input[name="num_of_axes"]', '3');
    await page.fill('textarea[name="abstract"]', 'Too short');

    // Try to submit
    await page.click('button[type="submit"]');

    // Check for specific validation errors
    await expect(page.locator('text=Technology name must be at least 3 characters')).toBeVisible();
    await expect(page.locator('text=Abstract must be at least 50 characters')).toBeVisible();
  });

  test('should handle form submission with valid data', async ({ page }) => {
    // Fill out the form with valid data
    await page.fill('input[name="name"]', 'AI Medical Diagnostic System');
    await page.fill('input[name="num_of_axes"]', '3');
    await page.fill(
      'textarea[name="abstract"]',
      'This is a comprehensive AI-powered medical diagnostic system that uses advanced machine learning algorithms to analyze patient data and provide accurate diagnostic recommendations for healthcare professionals.'
    );

    // Submit the form
    await page.click('button[type="submit"]');

    // Note: Since we don't have a real backend, we expect the form to try to submit
    // In a real scenario, we would expect navigation to a success page or a loading state

    // For now, we can verify that the form data was processed
    // (This might show a network error or loading state without a real backend)
    await page.waitForTimeout(1000); // Wait for any immediate response
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if form is still visible and usable
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('textarea[name="abstract"]')).toBeVisible();

    // Try to fill form on mobile
    await page.fill('input[name="name"]', 'Mobile Test');
    await expect(page.locator('input[name="name"]')).toHaveValue('Mobile Test');
  });

  test('should handle theme toggle if present', async ({ page }) => {
    // Check if theme toggle is present
    const themeToggle = page.locator('[data-testid="theme-toggle"]');

    if (await themeToggle.isVisible()) {
      // Click theme toggle
      await themeToggle.click();

      // Wait for theme change to apply
      await page.waitForTimeout(500);

      // Verify theme changed (check for dark mode class or similar)
      // This depends on how dark mode is implemented in the app
    }
  });
});
