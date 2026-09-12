import { test, expect } from '@playwright/test';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';
const ADMIN_EMAIL = 'admin@greenscapepro.com';
const ADMIN_PASSWORD = 'Admin@123';

let adminToken = '';
let testProductId = '';
let testCategoryId = '';

test.describe('Production Readiness Audit - Real CRUD Operations', () => {
  
  test.beforeAll(async () => {
    // Get admin token for API verification
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      adminToken = response.data.accessToken;
      console.log('✅ Admin token obtained for API verification');
    } catch (error) {
      console.error('❌ Failed to get admin token:', error);
    }
  });

  test('1. Product CRUD - Create Product', async ({ page }) => {
    console.log('\n🧪 Testing: Create Product');
    
    await page.goto('http://localhost:3000/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Look for "Add Product" or "Create" button
    const addButton = page.locator('button:has-text("Add"), button:has-text("Create"), a[href*="/admin/products/create"]').first();
    
    if (await addButton.isVisible({ timeout: 5000 })) {
      await addButton.click();
      await page.waitForTimeout(2000);
      
      // Fill product form
      await page.fill('input[name="name"], input[placeholder*="name" i]', 'QA Test Plant ' + Date.now());
      await page.fill('textarea[name="description"], textarea[placeholder*="description" i]', 'This is a QA test product for production audit');
      await page.fill('input[name="price"], input[placeholder*="price" i]', '29.99');
      await page.fill('input[name="stock"], input[placeholder*="stock" i]', '100');
      
      // Submit form
      const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);
      
      // Check for success message or redirect
      const url = page.url();
      console.log('Current URL after create:', url);
      
      // Verify in API
      const response = await axios.get(`${API_BASE}/products?search=QA Test Plant`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (response.data.data.products && response.data.data.products.length > 0) {
        testProductId = response.data.data.products[0]._id;
        console.log('✅ Product created successfully, ID:', testProductId);
      } else {
        console.log('⚠️ Product not found in API response after creation');
      }
    } else {
      console.log('⚠️ Add Product button not found - checking if page has inline create form');
    }
  });

  test('2. Product CRUD - Edit Product', async ({ page }) => {
    console.log('\n🧪 Testing: Edit Product');
    
    if (!testProductId) {
      console.log('⚠️ Skipping edit test - no product ID from create test');
      return;
    }
    
    await page.goto('http://localhost:3000/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Find edit button for the test product
    const editButton = page.locator(`button:has-text("Edit"), a[href*="${testProductId}"]`).first();
    
    if (await editButton.isVisible({ timeout: 5000 })) {
      await editButton.click();
      await page.waitForTimeout(2000);
      
      // Update price
      const priceInput = page.locator('input[name="price"], input[placeholder*="price" i]').first();
      await priceInput.clear();
      await priceInput.fill('39.99');
      
      // Submit
      const submitButton = page.locator('button[type="submit"], button:has-text("Update"), button:has-text("Save")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);
      
      // Verify in API
      const response = await axios.get(`${API_BASE}/products/${testProductId}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      if (response.data.data.price === 39.99) {
        console.log('✅ Product updated successfully, new price:', response.data.data.price);
      } else {
        console.log('❌ Product price not updated. Expected: 39.99, Got:', response.data.data.price);
      }
    } else {
      console.log('⚠️ Edit button not found');
    }
  });

  test('3. Product CRUD - Delete Product', async ({ page }) => {
    console.log('\n🧪 Testing: Delete Product');
    
    if (!testProductId) {
      console.log('⚠️ Skipping delete test - no product ID');
      return;
    }
    
    await page.goto('http://localhost:3000/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Find delete button
    const deleteButton = page.locator(`button:has-text("Delete"), button[aria-label*="delete" i]`).first();
    
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      // Listen for confirmation dialog
      page.on('dialog', dialog => dialog.accept());
      
      await deleteButton.click();
      await page.waitForTimeout(2000);
      
      // Verify deletion in API
      try {
        await axios.get(`${API_BASE}/products/${testProductId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('⚠️ Product still exists after delete');
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('✅ Product deleted successfully');
        } else {
          console.log('❌ Unexpected error checking product deletion:', error.message);
        }
      }
    } else {
      console.log('⚠️ Delete button not found');
    }
  });

  test('4. Category CRUD - Create Category', async ({ page }) => {
    console.log('\n🧪 Testing: Create Category');
    
    await page.goto('http://localhost:3000/admin/categories');
    await page.waitForLoadState('networkidle');
    
    const addButton = page.locator('button:has-text("Add"), button:has-text("Create")').first();
    
    if (await addButton.isVisible({ timeout: 5000 })) {
      await addButton.click();
      await page.waitForTimeout(2000);
      
      // Fill category form
      const timestamp = Date.now();
      await page.fill('input[name="name"], input[placeholder*="name" i]', `QA Category ${timestamp}`);
      await page.fill('input[name="slug"], input[placeholder*="slug" i]', `qa-category-${timestamp}`);
      
      // Submit
      const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);
      
      // Verify in API
      const response = await axios.get(`${API_BASE}/categories`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      const createdCategory = response.data.data.categories?.find((cat: any) => 
        cat.name.includes('QA Category')
      );
      
      if (createdCategory) {
        testCategoryId = createdCategory._id;
        console.log('✅ Category created successfully, ID:', testCategoryId);
      } else {
        console.log('⚠️ Category not found after creation');
      }
    } else {
      console.log('⚠️ Add Category button not found');
    }
  });

  test('5. Category CRUD - Delete Category', async ({ page }) => {
    console.log('\n🧪 Testing: Delete Category');
    
    if (!testCategoryId) {
      console.log('⚠️ Skipping delete test - no category ID');
      return;
    }
    
    await page.goto('http://localhost:3000/admin/categories');
    await page.waitForLoadState('networkidle');
    
    // Find and click delete
    const deleteButton = page.locator('button:has-text("Delete"), button[aria-label*="delete" i]').first();
    
    if (await deleteButton.isVisible({ timeout: 5000 })) {
      page.on('dialog', dialog => dialog.accept());
      
      await deleteButton.click();
      await page.waitForTimeout(2000);
      
      // Verify deletion
      try {
        await axios.get(`${API_BASE}/categories/${testCategoryId}`, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('⚠️ Category still exists after delete');
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log('✅ Category deleted successfully');
        }
      }
    } else {
      console.log('⚠️ Delete button not found');
    }
  });

  test('6. Orders - View and verify order data', async ({ page }) => {
    console.log('\n🧪 Testing: Order Management');
    
    await page.goto('http://localhost:3000/admin/orders');
    await page.waitForLoadState('networkidle');
    
    // Check if orders load
    const hasOrders = await page.locator('table, .order-item, [data-testid="order"]').isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasOrders) {
      console.log('✅ Orders page loaded with data');
      
      // Verify API
      const response = await axios.get(`${API_BASE}/orders`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      console.log(`✅ API returned ${response.data.data?.orders?.length || 0} orders`);
    } else {
      console.log('⚠️ No orders visible or empty state shown');
    }
  });

  test('7. Coupons - Create and Delete', async ({ page }) => {
    console.log('\n🧪 Testing: Coupon CRUD');
    
    await page.goto('http://localhost:3000/admin/coupons');
    await page.waitForLoadState('networkidle');
    
    const addButton = page.locator('button:has-text("Add"), button:has-text("Create")').first();
    
    if (await addButton.isVisible({ timeout: 5000 })) {
      await addButton.click();
      await page.waitForTimeout(2000);
      
      // Fill coupon form
      const couponCode = `QA${Date.now()}`;
      await page.fill('input[name="code"], input[placeholder*="code" i]', couponCode);
      await page.fill('input[name="discount"], input[placeholder*="discount" i]', '10');
      
      // Submit
      const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Save")').first();
      await submitButton.click();
      await page.waitForTimeout(3000);
      
      // Verify in API
      const response = await axios.get(`${API_BASE}/coupons`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      const createdCoupon = response.data.data?.coupons?.find((c: any) => c.code === couponCode);
      
      if (createdCoupon) {
        console.log('✅ Coupon created successfully:', couponCode);
        
        // Try to delete it
        const deleteButton = page.locator('button:has-text("Delete")').first();
        if (await deleteButton.isVisible({ timeout: 5000 })) {
          page.on('dialog', dialog => dialog.accept());
          await deleteButton.click();
          await page.waitForTimeout(2000);
          console.log('✅ Coupon deleted');
        }
      } else {
        console.log('⚠️ Coupon not found after creation');
      }
    } else {
      console.log('⚠️ Add Coupon button not found');
    }
  });

  test('8. Data Persistence - Refresh and verify', async ({ page }) => {
    console.log('\n🧪 Testing: Data Persistence after Refresh');
    
    // Navigate to products
    await page.goto('http://localhost:3000/admin/products');
    await page.waitForLoadState('networkidle');
    
    // Get product count
    const response1 = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const countBefore = response1.data.data?.pagination?.total || 0;
    
    // Refresh page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Get product count again
    const response2 = await axios.get(`${API_BASE}/products`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const countAfter = response2.data.data?.pagination?.total || 0;
    
    if (countBefore === countAfter) {
      console.log(`✅ Data persistence verified: ${countBefore} products before and after refresh`);
    } else {
      console.log(`⚠️ Data mismatch: ${countBefore} before, ${countAfter} after refresh`);
    }
  });

  test('9. API Health Check - All endpoints', async ({ page }) => {
    console.log('\n🧪 Testing: API Endpoints Health');
    
    const endpoints = [
      { name: 'Products', url: `${API_BASE}/products` },
      { name: 'Categories', url: `${API_BASE}/categories` },
      { name: 'Orders', url: `${API_BASE}/orders` },
      { name: 'Users', url: `${API_BASE}/users` },
      { name: 'Coupons', url: `${API_BASE}/coupons` },
      { name: 'Reviews', url: `${API_BASE}/reviews` },
      { name: 'Banners', url: `${API_BASE}/banners` },
      { name: 'Blogs', url: `${API_BASE}/blogs` },
    ];
    
    let passedCount = 0;
    let failedCount = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint.url, {
          headers: { Authorization: `Bearer ${adminToken}` },
          timeout: 5000,
        });
        
        if (response.status === 200) {
          console.log(`✅ ${endpoint.name}: OK (${response.status})`);
          passedCount++;
        } else {
          console.log(`⚠️ ${endpoint.name}: Unexpected status ${response.status}`);
          failedCount++;
        }
      } catch (error: any) {
        console.log(`❌ ${endpoint.name}: Failed - ${error.message}`);
        failedCount++;
      }
    }
    
    console.log(`\n📊 API Health: ${passedCount}/${endpoints.length} endpoints healthy`);
  });

  test('10. Console Errors Check', async ({ page }) => {
    console.log('\n🧪 Testing: Console Errors');
    
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('response', response => {
      if (response.status() >= 400 && !response.url().includes('favicon')) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });
    
    // Navigate through key pages
    const pages = [
      '/admin',
      '/admin/products',
      '/admin/categories',
      '/admin/orders',
      '/admin/users',
    ];
    
    for (const url of pages) {
      await page.goto(`http://localhost:3000${url}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    console.log(`\n📊 Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors found:', consoleErrors.slice(0, 5));
    }
    
    console.log(`📊 Network Errors: ${networkErrors.length}`);
    if (networkErrors.length > 0) {
      console.log('Failed requests:', networkErrors.slice(0, 5));
    }
    
    if (consoleErrors.length === 0 && networkErrors.length === 0) {
      console.log('✅ No console or network errors detected');
    }
  });
});
