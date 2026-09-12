import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'Chrome - 1920px', use: { browserName: 'chromium', viewport: { width: 1920, height: 1080 } } },
    { name: 'Chrome - 1440px', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'Chrome - 1024px', use: { browserName: 'chromium', viewport: { width: 1024, height: 768 } } },
    { name: 'Chrome - 768px', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 } } },
    { name: 'Chrome - 375px', use: { browserName: 'chromium', viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true } },
    { name: 'Chrome - 320px', use: { browserName: 'chromium', viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true } },
    { name: 'Edge', use: { browserName: 'chromium', channel: 'msedge' } },
  ],
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'cd ../backend && npm run start',
      url: 'http://localhost:5000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      stdout: 'ignore',
      stderr: 'pipe',
    }
  ],
});
