import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login|Sign In|GreenScape/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');
    
    // Wait for validation messages
    await page.waitForTimeout(500);
    
    // Check for error messages (may be inline or toast)
    const errorVisible = await page.locator('text=/email|password|required/i').isVisible().catch(() => false);
    expect(errorVisible).toBeTruthy();
  });

  test('should login with admin credentials and redirect to admin dashboard', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/\/admin|\/dashboard/i, { timeout: 10000 });
    
    // Verify we're on admin page
    const url = page.url();
    expect(url).toMatch(/\/admin/i);
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(1000);
    
    // Should still be on login page
    const url = page.url();
    expect(url).toContain('/login');
  });
});
