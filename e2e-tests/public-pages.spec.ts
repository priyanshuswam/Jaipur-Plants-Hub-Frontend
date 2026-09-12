import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('Home page renders correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Jaipur Plants Hub').first()).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('footer').first()).toBeVisible();
  });

  test('About page renders correctly', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1').filter({ hasText: /Our Story|About/i })).toBeVisible();
  });

  test('Contact page has functional form', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('form')).toBeVisible();
  });

  test('Products catalog loads', async ({ page }) => {
    await page.goto('/products');
    await expect(page.locator('text=All Products').first()).toBeVisible();
  });
  
  test('Services page loads', async ({ page }) => {
    await page.goto('/services');
    await expect(page.locator('h1').filter({ hasText: /Services/i })).toBeVisible();
  });
});
