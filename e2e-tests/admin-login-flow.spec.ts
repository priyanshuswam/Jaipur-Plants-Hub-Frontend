import { test, expect, Page } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

// Helper to login
async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  // Wait for either success or error
  await page.waitForTimeout(3000);
}

test.describe('Admin Login and Navigation Flow', () => {
  test('complete admin login flow', async ({ page }) => {
    // Step 1: Visit login page
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    // Step 2: Fill credentials
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    
    // Step 3: Submit
    await page.click('button[type="submit"]');
    
    // Step 4: Wait for redirect (could be /account or / then manually navigate to /admin)
    await page.waitForTimeout(4000);
    
    // Step 5: Navigate to admin panel
    await page.goto('/admin');
    await page.waitForTimeout(2000);
    
    // Step 6: Verify admin dashboard loads
    const url = page.url();
    expect(url).toContain('/admin');
    
    // Check for dashboard elements
    const hasDashboardContent = await page.locator('text=/dashboard|analytics|products|orders/i').first().isVisible().catch(() => false);
    expect(hasDashboardContent).toBeTruthy();
  });

  test('admin can access all main pages', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin');
    
    const pages = [
      '/admin',
      '/admin/products',
      '/admin/categories',
      '/admin/orders',
      '/admin/users',
      '/admin/blogs',
      '/admin/gallery',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForTimeout(1500);
      
      const url = page.url();
      expect(url).toContain(pagePath);
      
      // Check page loaded (not blank or error)
      const bodyText = await page.locator('body').innerText();
      expect(bodyText.length).toBeGreaterThan(50);
    }
  });
});
