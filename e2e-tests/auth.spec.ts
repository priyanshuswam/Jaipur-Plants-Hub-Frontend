import { test, expect } from '@playwright/test';
import { hasSMTP } from './utils';

test.describe('Authentication Flows', () => {
  test('Login page renders', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1').filter({ hasText: 'Welcome Back' })).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Signup page renders', async ({ page }) => {
    await page.goto('/signup');
    await expect(page.locator('h1').filter({ hasText: 'Create an Account' })).toBeVisible();
  });

  test('Forgot Password flow', async ({ page }) => {
    test.skip(!hasSMTP, 'Skipped due to missing SMTP credentials');
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'test@greenscapepro.com');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Check your email')).toBeVisible();
  });

  test('Login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    // Assuming a toast or error message shows up
    await expect(page.locator('text=Invalid credentials').or(page.locator('text=Invalid email or password'))).toBeVisible({ timeout: 10000 });
  });
});
