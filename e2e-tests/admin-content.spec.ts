import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Content Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should load blogs page', async ({ page }) => {
    await page.goto('/admin/blogs');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/blogs/i);
  });

  test('should load gallery page', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/gallery/i);
  });

  test('should load banners page', async ({ page }) => {
    await page.goto('/admin/banners');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/banners/i);
  });

  test('should load testimonials page', async ({ page }) => {
    await page.goto('/admin/testimonials');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/testimonials/i);
  });

  test('should load reviews page', async ({ page }) => {
    await page.goto('/admin/reviews');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/reviews/i);
  });

  test('should load services page', async ({ page }) => {
    await page.goto('/admin/services');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/admin\/services/i);
  });
});
