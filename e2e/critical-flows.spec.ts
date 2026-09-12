import { test, expect, type Page } from '@playwright/test';

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:5000/api/v1';

// Test users
const TEST_USER = {
  email: `user_${Date.now()}@e2etest.com`,
  password: 'Test@123456',
  firstName: 'E2E',
  lastName: 'TestUser',
};

const ADMIN_USER = {
  email: 'admin@greenscapepro.com',
  password: 'Admin@123456',
};

test.describe('Jaipur Plants Hub - Critical E2E Flows', () => {
  
  // ============================================================
  // 1. USER REGISTRATION & LOGIN
  // ============================================================
  
  test('1.1 User Registration Flow', async ({ page }) => {
    console.log('Testing user registration...');
    
    await page.goto(`${BASE_URL}/signup`);
    await expect(page).toHaveTitle(/Sign Up|Create Account|Jaipur Plants Hub/i);
    
    // Fill registration form
    await page.fill('input[name="firstName"], input[placeholder*="First"], input[type="text"]:first', TEST_USER.firstName);
    await page.fill('input[name="lastName"], input[placeholder*="Last"]', TEST_USER.lastName);
    await page.fill('input[name="email"], input[type="email"]', TEST_USER.email);
    await page.fill('input[name="password"], input[type="password"]:first', TEST_USER.password);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect or success message
    await page.waitForTimeout(2000);
    
    // Check if redirected to home or dashboard
    const url = page.url();
    const isLoggedIn = url.includes('/account') || url === `${BASE_URL}/` || url.includes('/dashboard');
    
    expect(isLoggedIn).toBeTruthy();
    console.log('✅ User registration: PASS');
  });

  test('1.2 User Login Flow', async ({ page }) => {
    console.log('Testing user login...');
    
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Verify logged in
    const url = page.url();
    expect(url).not.toContain('/login');
    
    console.log('✅ User login: PASS');
  });

  test('1.3 User Session Persistence', async ({ page, context }) => {
    console.log('Testing session persistence...');
    
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Check cookies exist
    const cookies = await context.cookies();
    const hasAuthCookie = cookies.some(c => c.name === 'accessToken' || c.name === 'refreshToken');
    expect(hasAuthCookie).toBeTruthy();
    
    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);
    
    // Should still be logged in
    const url = page.url();
    expect(url).not.toContain('/login');
    
    console.log('✅ Session persistence: PASS');
  });

  test('1.4 Wrong Password Rejection', async ({ page }) => {
    console.log('Testing wrong password...');
    
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
    
    // Should still be on login page or show error
    const url = page.url();
    expect(url).toContain('/login');
    
    console.log('✅ Wrong password rejected: PASS');
  });

  // ============================================================
  // 2. ADMIN AUTHENTICATION
  // ============================================================

  test('2.1 Admin Login & Dashboard Access', async ({ page }) => {
    console.log('Testing admin login...');
    
    await page.goto(`${BASE_URL}/login`);
    
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(3000);
    
    // Admin should be redirected to /admin or stay on home
    const url = page.url();
    console.log('After admin login, URL:', url);
    
    // Navigate to admin dashboard
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForTimeout(2000);
    
    const finalUrl = page.url();
    console.log('Admin dashboard URL:', finalUrl);
    
    // Should not be redirected away from /admin
    expect(finalUrl).toContain('/admin');
    
    // Check for dashboard content
    const hasContent = await page.locator('h1, h2').count() > 0;
    expect(hasContent).toBeTruthy();
    
    console.log('✅ Admin dashboard access: PASS');
  });

  test('2.2 Regular User Cannot Access Admin', async ({ page, context }) => {
    console.log('Testing admin authorization...');
    
    // First, clear any existing sessions
    await context.clearCookies();
    
    // Login as regular user
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Try to access admin
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForTimeout(2000);
    
    const url = page.url();
    // Should be redirected away from /admin
    expect(url).not.toContain('/admin');
    
    console.log('✅ Admin authorization: PASS');
  });

  // ============================================================
  // 3. PRODUCT CRUD (Admin)
  // ============================================================

  test('3.1 Admin Product Create', async ({ page }) => {
    console.log('Testing product creation...');
    
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', ADMIN_USER.email);
    await page.fill('input[type="password"]', ADMIN_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Navigate to products page
    await page.goto(`${BASE_URL}/admin/products`);
    await page.waitForTimeout(2000);
    
    // Check if Add Product button exists
    const hasAddButton = await page.locator('a[href*="products/new"], button:has-text("Add Product")').count() > 0;
    
    if (!hasAddButton) {
      console.log('⚠️  Add Product button not found - checking page structure');
      const content = await page.content();
      console.log('Page has content:', content.length > 0);
    } else {
      console.log('✅ Product management page accessible: PASS');
    }
    
    expect(hasAddButton).toBeTruthy();
  });

  test('3.2 Check Product Listing on Frontend', async ({ page }) => {
    console.log('Testing frontend product listing...');
    
    await page.goto(`${BASE_URL}/products`);
    await page.waitForTimeout(2000);
    
    // Check if products are displayed
    const hasProducts = await page.locator('a[href*="/products/"], div:has-text("Plant"), img').count() > 0;
    
    expect(hasProducts).toBeTruthy();
    console.log('✅ Frontend product listing: PASS');
  });

  // ============================================================
  // 4. PERFORMANCE CHECK
  // ============================================================

  test('4.1 Homepage Load Performance', async ({ page }) => {
    console.log('Testing homepage performance...');
    
    const startTime = Date.now();
    await page.goto(BASE_URL);
    const loadTime = Date.now() - startTime;
    
    console.log(`Homepage load time: ${loadTime}ms`);
    
    // Should load in reasonable time (< 5000ms)
    expect(loadTime).toBeLessThan(5000);
    
    // Check for console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length > 0) {
      console.log('⚠️  Console errors found:', errors);
    } else {
      console.log('✅ No console errors');
    }
  });

  test('4.2 Check for Duplicate API Requests', async ({ page }) => {
    console.log('Checking for duplicate API requests...');
    
    const apiCalls = new Map<string, number>();
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/')) {
        const count = apiCalls.get(url) || 0;
        apiCalls.set(url, count + 1);
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    // Check for duplicates
    let hasDuplicates = false;
    apiCalls.forEach((count, url) => {
      if (count > 1) {
        console.log(`⚠️  Duplicate request (${count}x): ${url}`);
        hasDuplicates = true;
      }
    });
    
    if (!hasDuplicates) {
      console.log('✅ No duplicate API requests detected');
    }
  });

  // ============================================================
  // 5. ERROR HANDLING
  // ============================================================

  test('5.1 Network Error Handling', async ({ page }) => {
    console.log('Testing error handling...');
    
    // Try accessing non-existent product
    const response = await page.goto(`${BASE_URL}/products/non-existent-product-slug`);
    await page.waitForTimeout(1000);
    
    // Should show 404 or error page, not crash
    const has404 = await page.locator('text=/404|Not Found|doesn.*t exist/i').count() > 0;
    
    if (!has404) {
      console.log('⚠️  404 page not clearly shown');
    }
    
    expect(response?.status()).toBe(404);
    console.log('✅ 404 handling: PASS');
  });

  // ============================================================
  // 6. LOGOUT
  // ============================================================

  test('6.1 User Logout', async ({ page, context }) => {
    console.log('Testing logout...');
    
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', TEST_USER.email);
    await page.fill('input[type="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Find and click logout
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")').first();
    const hasLogout = await logoutButton.count() > 0;
    
    if (hasLogout) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      
      // Check cookies cleared
      const cookies = await context.cookies();
      const hasAuthCookie = cookies.some(c => c.name === 'accessToken');
      expect(hasAuthCookie).toBeFalsy();
      
      console.log('✅ Logout: PASS');
    } else {
      console.log('⚠️  Logout button not found in UI');
    }
  });
});
