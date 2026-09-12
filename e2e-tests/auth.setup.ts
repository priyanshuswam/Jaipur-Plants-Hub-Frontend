import { test as setup, expect } from '@playwright/test';
import path from 'path';

const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123456';

const authFile = path.join(__dirname, '../.auth/admin.json');

setup('authenticate as admin', async ({ page, context }) => {
  // Listen for console logs
  page.on('console', msg => console.log('Browser console:', msg.text()));
  
  // Listen for network errors
  let loginResponse: any = null;
  page.on('response', async response => {
    if (response.url().includes('/auth/login')) {
      loginResponse = {
        status: response.status(),
        statusText: response.statusText(),
        body: await response.json().catch(() => null)
      };
    }
  });
  
  // Go to login page
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  
  // Fill in credentials
  await page.fill('input[type="email"]', ADMIN_EMAIL);
  await page.fill('input[type="password"]', ADMIN_PASSWORD);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for login API call to complete
  await page.waitForTimeout(3000);
  
  // Check login response
  console.log('Login API Response:', JSON.stringify(loginResponse, null, 2));
  
  // Check URL
  const url = page.url();
  console.log('Current URL after login:', url);
  
  // Verify localStorage has auth data
  const authStorage = await page.evaluate(() => {
    const authData = localStorage.getItem('greenscape-auth');
    return authData ? JSON.parse(authData) : null;
  });
  
  console.log('Auth storage:', authStorage ? 'Present' : 'Missing');
  if (authStorage) {
    console.log('User:', authStorage?.state?.user?.email);
    console.log('Role:', authStorage?.state?.user?.role);
    console.log('isAuthenticated:', authStorage?.state?.isAuthenticated);
  }
  
  // If login failed, show error
  if (!loginResponse || loginResponse.status !== 200) {
    throw new Error(`Login API failed: ${JSON.stringify(loginResponse)}`);
  }
  
  // Check if auth was successful
  if (!authStorage?.state?.isAuthenticated) {
    throw new Error('Auth state not properly set in localStorage despite successful API call');
  }
  
  if (authStorage.state.user?.role !== 'admin') {
    throw new Error('User is not admin');
  }
  
  // Save storage state
  await context.storageState({ path: authFile });
  
  console.log('✅ Authentication setup complete');
});
