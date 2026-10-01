import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: 2,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
    }],
  ],

  expect: {
    timeout: 20_000,
  },

  use: {
    baseURL: 'https://www.aviasales.ru/',
    locale: 'ru-RU',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
//    {
//      name: 'firefox',
//      use: { ...devices['Desktop Firefox'] },
//    },
//    {
//      name: 'webkit',
//      use: { ...devices['Desktop Safari'] },
//    },
  ],
});