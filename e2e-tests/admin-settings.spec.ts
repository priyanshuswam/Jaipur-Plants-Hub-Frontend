import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Settings & Misc', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should load settings page', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/settings/i);
  });

  test('should load notifications page', async ({ page }) => {
    await page.goto('/admin/notifications');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/notifications/i);
  });

  test('should load queries page', async ({ page }) => {
    await page.goto('/admin/queries');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/queries/i);
  });

  test('should load coupons page', async ({ page }) => {
    await page.goto('/admin/coupons');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/coupons/i);
  });
});
