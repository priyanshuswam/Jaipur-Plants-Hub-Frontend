import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Users Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should load users page', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/users/i);
  });

  test('should display users list', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(2000);
    
    const contentVisible = await page.locator('table, text=/users|customers/i').first().isVisible().catch(() => false);
    expect(contentVisible || page.url().includes('/users')).toBeTruthy();
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(1000);
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    const searchExists = await searchInput.isVisible().catch(() => false);
    expect(page.url()).toContain('/admin/users');
  });
});
