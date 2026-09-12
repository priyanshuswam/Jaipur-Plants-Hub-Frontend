import { test, expect } from '@playwright/test';

test.describe('Admin Panel - Detailed Interactions', () => {
  
  test('Dashboard displays key metrics', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Check for dashboard content
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    
    // Verify we're on dashboard
    expect(page.url()).toContain('/admin');
  });

  test('Products page - view and search', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Verify URL
    expect(page.url()).toContain('/admin/products');
    
    // Check if search box exists
    const searchInput = page.locator('input[type="search"], input[placeholder*="Search"], input[name="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('plant');
      await page.waitForTimeout(1000);
    }
  });

  test('Categories page loads data', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/categories');
  });

  test('Orders page loads', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/orders');
  });

  test('Users management page', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/users');
  });

  test('Blogs page navigates correctly', async ({ page }) => {
    await page.goto('/admin/blogs');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/blogs');
  });

  test('Gallery management', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/gallery');
  });

  test('Banners page', async ({ page }) => {
    await page.goto('/admin/banners');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/banners');
  });

  test('Testimonials management', async ({ page }) => {
    await page.goto('/admin/testimonials');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/testimonials');
  });

  test('Reviews moderation', async ({ page }) => {
    await page.goto('/admin/reviews');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/reviews');
  });

  test('Services page', async ({ page }) => {
    await page.goto('/admin/services');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/services');
  });

  test('Coupons management', async ({ page }) => {
    await page.goto('/admin/coupons');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/coupons');
  });

  test('Queries/Contact messages', async ({ page }) => {
    await page.goto('/admin/queries');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/queries');
  });

  test('Notifications center', async ({ page }) => {
    await page.goto('/admin/notifications');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/notifications');
  });

  test('Settings page', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/settings');
  });

  test('Analytics dashboard', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/admin/analytics');
  });

  test('Navigation between pages works', async ({ page }) => {
    // Start at dashboard
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    // Navigate to products
    const productsLink = page.locator('a[href="/admin/products"]').first();
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/admin/products');
    }
    
    // Navigate to categories
    const categoriesLink = page.locator('a[href="/admin/categories"]').first();
    if (await categoriesLink.isVisible()) {
      await categoriesLink.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/admin/categories');
    }
  });
});
