import { test, expect } from '@playwright/test';


test('поиск по двум городам, москва — санкт-петербург', async ({ page }) => {
  await page.goto('', {
    waitUntil: 'domcontentloaded',
  });
  const originInput = page.locator('[data-test-id="origin-input"]');
  await originInput.click();
  await originInput.fill('москва');
  await expect(page.locator('[data-test-id="suggested-city-MOW"]')).toBeVisible();
  await page.locator('[data-test-id="destination-input"]').fill('санкт-петербург');
  await expect(page.locator('[id="plugin_cheapest_tickets_block"]')).toBeVisible();

  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOWLED1');
});


test('поменять местами города, москва — санкт-петербург', async ({ page }) => {

  await page.goto('?params=MOWLED1', {
    waitUntil: 'domcontentloaded',
  });
  const swapButton = page.locator('[data-test-id="avia-form"]').locator('[data-test-id="round-button"]');

  await swapButton.click();

  await expect(page.locator('[data-test-id="origin-input"]')).toHaveValue('Санкт-Петербург');
  await expect(page.locator('[data-test-id="destination-input"]')).toHaveValue('Москва');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('LEDMOW1');
});

