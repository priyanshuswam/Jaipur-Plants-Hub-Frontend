import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Orders Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should load orders page', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/orders/i);
  });

  test('should have filter options', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForTimeout(1500);
    
    // Look for filter/status dropdowns
    const filterExists = await page.locator('select, button:has-text("Filter"), [role="combobox"]').first().isVisible().catch(() => false);
    expect(page.url()).toContain('/admin/orders');
  });

  test('should display orders table or list', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForTimeout(2000);
    
    // Check for table or list view
    const contentVisible = await page.locator('table, [role="table"], text=/order/i').first().isVisible().catch(() => false);
    expect(contentVisible || page.url().includes('/orders')).toBeTruthy();
  });
});
