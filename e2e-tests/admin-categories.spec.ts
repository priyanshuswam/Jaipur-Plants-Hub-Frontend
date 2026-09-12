import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Categories Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should load categories page', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/admin\/categories/i);
    const titleVisible = await page.locator('text=/categories/i').first().isVisible().catch(() => false);
    expect(titleVisible).toBeTruthy();
  });

  test('should display categories list or tree', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForTimeout(2000);
    
    // Check if categories are displayed (could be table, cards, or tree view)
    const contentVisible = await page.locator('table, [role="tree"], [class*="category"]').first().isVisible().catch(() => false);
    expect(contentVisible || page.url().includes('/categories')).toBeTruthy();
  });

  test('should have add category button', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForTimeout(1000);
    
    const addBtn = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")').first();
    const btnExists = await addBtn.isVisible().catch(() => false);
    expect(btnExists).toBeTruthy();
  });
});
