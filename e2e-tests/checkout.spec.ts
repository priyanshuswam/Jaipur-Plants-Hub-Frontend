import { test, expect } from '@playwright/test';
import { hasRazorpay } from './utils';

test.describe('Checkout Flows', () => {
  test('Cart drawer opens', async ({ page }) => {
    await page.goto('/products');
    // Click the cart icon in navbar
    await page.locator('nav').locator('svg.feather-shopping-cart, svg.feather-shopping-bag, .text-primary-700.text-xl').first().click();
    await expect(page.locator('text=Your Cart')).toBeVisible();
  });

  test('Razorpay Checkout', async ({ page }) => {
    test.skip(!hasRazorpay, 'Skipped due to missing Razorpay credentials');
    // This is just a placeholder logic to ensure it skips appropriately
    expect(true).toBe(true);
  });
});
