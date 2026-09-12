import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'admin123';

test.describe('Admin Authentication', () => {
  test('Admin login successful', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin', { timeout: 10000 });
    await expect(page).toHaveURL('/admin');
  });
});

test.describe('Products Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View products list', async ({ page }) => {
    await page.goto('/admin/products');
    await expect(page.getByText('Products')).toBeVisible();
  });
});

test.describe('Categories Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View categories list', async ({ page }) => {
    await page.goto('/admin/categories');
    await expect(page.getByText('Categories')).toBeVisible();
  });
});

test.describe('Blogs Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View blogs list', async ({ page }) => {
    await page.goto('/admin/blogs');
    await expect(page.getByText('Blog Posts')).toBeVisible();
  });
});

test.describe('Services Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View services list', async ({ page }) => {
    await page.goto('/admin/services');
    await expect(page.getByText('Services')).toBeVisible();
  });
});

test.describe('Banners Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View banners list', async ({ page }) => {
    await page.goto('/admin/banners');
    await expect(page.getByText('Banners')).toBeVisible();
  });
});

test.describe('Gallery Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View gallery list', async ({ page }) => {
    await page.goto('/admin/gallery');
    await expect(page.getByText('Gallery')).toBeVisible();
  });
});

test.describe('Dashboard Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByText('Dashboard')).toBeVisible();
  });
});

test.describe('Orders Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View orders list', async ({ page }) => {
    await page.goto('/admin/orders');
    await expect(page.getByText('Orders')).toBeVisible();
  });
});

test.describe('Customers Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View customers list', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByText('Users')).toBeVisible();
  });
});

test.describe('Reviews Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View reviews list', async ({ page }) => {
    await page.goto('/admin/reviews');
    await expect(page.getByText('Reviews')).toBeVisible();
  });
});

test.describe('Coupons Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View coupons list', async ({ page }) => {
    await page.goto('/admin/coupons');
    await expect(page.getByText('Coupons')).toBeVisible();
  });
});

test.describe('Settings Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View settings page', async ({ page }) => {
    await page.goto('/admin/settings');
    await expect(page.getByText('Settings')).toBeVisible();
  });
});

test.describe('Notifications Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View notifications page', async ({ page }) => {
    await page.goto('/admin/notifications');
    await expect(page.getByText('Notifications')).toBeVisible();
  });
});

test.describe('Contact Queries Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', ADMIN_EMAIL);
    await page.fill('input[type="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('View contact queries list', async ({ page }) => {
    await page.goto('/admin/queries');
    await expect(page.getByText('Contact Queries')).toBeVisible();
  });
});
