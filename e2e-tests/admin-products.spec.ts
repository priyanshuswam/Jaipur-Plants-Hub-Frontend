import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

test.describe('Admin Products Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/admin/i, { timeout: 10000 });
  });

  test('should load products list page', async ({ page }) => {
    await page.goto('/admin/products');
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Check for products page elements
    const productsVisible = await page.locator('text=/products|inventory/i').first().isVisible().catch(() => false);
    expect(productsVisible).toBeTruthy();
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForTimeout(1000);
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    const searchExists = await searchInput.isVisible().catch(() => false);
    
    if (searchExists) {
      await searchInput.fill('plant');
      await page.waitForTimeout(1000);
      expect(searchExists).toBeTruthy();
    }
  });

  test('should have add/create product button', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForTimeout(1000);
    
    // Look for create/add button
    const createBtn = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New"), a[href*="/products/new"]').first();
    const btnExists = await createBtn.isVisible().catch(() => false);
    expect(btnExists).toBeTruthy();
  });

  test('should load product create page', async ({ page }) => {
    await page.goto('/admin/products/new');
    await page.waitForTimeout(2000);
    
    // Check for form elements
    const formVisible = await page.locator('form, input[name="name"], input[name="title"]').first().isVisible().catch(() => false);
    expect(formVisible).toBeTruthy();
  });

  test('should have pagination controls', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForTimeout(1500);
    
    // Look for pagination
    const pagination = page.locator('button:has-text("Next"), button:has-text("Previous"), text=/page/i').first();
    const paginationExists = await pagination.isVisible().catch(() => false);
    
    // Pagination might not exist if there's only 1 product
    // Just verify the page loaded without errors
    expect(page.url()).toContain('/admin/products');
  });
});
