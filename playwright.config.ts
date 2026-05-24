import { defineConfig, devices } from '@playwright/test';

const PORT = process.env['PUI_TEST_PORT'] ?? '4000';
const baseURL = process.env['PUI_TEST_BASE_URL'] ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'tests/reports/playwright' }],
    ...(process.env['CI'] ? [['github'] as const] : []),
  ],
  outputDir: 'tests/results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    reducedMotion: 'reduce',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'tablet-chromium',
      use: { ...devices['iPad Pro 11'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npm run serve:ssr:test',
    url: `${baseURL}/docs/components/button/overview`,
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
