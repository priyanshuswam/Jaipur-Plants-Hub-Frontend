import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should display dashboard overview', async ({ page }) => {
    await page.goto('/admin');
    
    // Check for dashboard elements
    await expect(page.locator('text=/dashboard|overview/i')).toBeVisible({ timeout: 5000 });
    
    // Look for stat cards (revenue, orders, users, products)
    const statsVisible = await page.locator('text=/revenue|orders|users|products/i').first().isVisible().catch(() => false);
    expect(statsVisible).toBeTruthy();
  });

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/admin');
    
    // Find and click analytics link
    const analyticsLink = page.locator('a[href*="/admin/analytics"], text=Analytics').first();
    await analyticsLink.click();
    
    await page.waitForURL(/\/admin\/analytics/i, { timeout: 5000 });
    await expect(page).toHaveURL(/\/admin\/analytics/i);
  });

  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/admin');
    
    const navLinks = [
      { text: 'Products', url: '/admin/products' },
      { text: 'Categories', url: '/admin/categories' },
      { text: 'Orders', url: '/admin/orders' },
      { text: 'Users', url: '/admin/users' },
    ];

    for (const link of navLinks) {
      const linkEl = page.locator(`a[href*="${link.url}"], text=${link.text}`).first();
      const isVisible = await linkEl.isVisible().catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });
});
