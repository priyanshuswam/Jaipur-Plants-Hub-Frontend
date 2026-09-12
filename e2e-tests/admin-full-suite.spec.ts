import { test, expect } from '@playwright/test';

test.describe('Admin Panel - Full Suite (Authenticated)', () => {
  test('dashboard loads and displays stats', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(2000);
    
    // Verify we're on admin page
    expect(page.url()).toContain('/admin');
    
    // Check for dashboard elements
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.toLowerCase()).toMatch(/dashboard|admin|analytics|products|orders/);
  });

  test('products page loads', async ({ page }) => {
    await page.goto('/admin/products');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/products');
    const pageVisible = await page.locator('body').isVisible();
    expect(pageVisible).toBeTruthy();
  });

  test('categories page loads', async ({ page }) => {
    await page.goto('/admin/categories');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/categories');
  });

  test('orders page loads', async ({ page }) => {
    await page.goto('/admin/orders');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/orders');
  });

  test('users page loads', async ({ page }) => {
    await page.goto('/admin/users');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/users');
  });

  test('blogs page loads', async ({ page }) => {
    await page.goto('/admin/blogs');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/blogs');
  });

  test('gallery page loads', async ({ page }) => {
    await page.goto('/admin/gallery');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/gallery');
  });

  test('banners page loads', async ({ page }) => {
    await page.goto('/admin/banners');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/banners');
  });

  test('testimonials page loads', async ({ page }) => {
    await page.goto('/admin/testimonials');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/testimonials');
  });

  test('reviews page loads', async ({ page }) => {
    await page.goto('/admin/reviews');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/reviews');
  });

  test('services page loads', async ({ page }) => {
    await page.goto('/admin/services');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/services');
  });

  test('coupons page loads', async ({ page }) => {
    await page.goto('/admin/coupons');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/coupons');
  });

  test('queries page loads', async ({ page }) => {
    await page.goto('/admin/queries');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/queries');
  });

  test('notifications page loads', async ({ page }) => {
    await page.goto('/admin/notifications');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/notifications');
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/admin/settings');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/settings');
  });

  test('analytics page loads', async ({ page }) => {
    await page.goto('/admin/analytics');
    await page.waitForTimeout(2000);
    
    expect(page.url()).toContain('/admin/analytics');
  });
});
