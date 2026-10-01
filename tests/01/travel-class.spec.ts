import { test, expect } from '@playwright/test';


test('изменение эконом на бизнес, класс обслуживания , москва', async ({ page }) => {
  await page.goto('?params=MOW1', {
    waitUntil: 'domcontentloaded',
  });

  const tripClass = page.locator('[data-test-id="trip-class"]');

  await expect(tripClass).toHaveText('Эконом');

  await page.locator('[data-test-id="passengers-field"]').click();

  const economy = page.locator('[data-test-id="trip-class-Y"]');
  const comfort = page.locator('[data-test-id="trip-class-W"]');
  const business = page.locator('[data-test-id="trip-class-C"]');
  const first = page.locator('[data-test-id="trip-class-F"]');
  const businessLabel = page.locator('[data-test-id="radio-button"]').filter({ hasText: 'Бизнес' });

  await expect(economy).toBeChecked();
  await expect(comfort).not.toBeChecked();
  await expect(business).not.toBeChecked();
  await expect(first).not.toBeChecked();

  await businessLabel.click();

  await expect(economy).not.toBeChecked();
  await expect(comfort).not.toBeChecked();
  await expect(first).not.toBeChecked();
  await expect(business).toBeChecked();

  await expect(tripClass).toHaveText('Бизнес');

  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOWc1');
});


test('изменение эконом на комфорт, класс обслуживания , москва', async ({ page }) => {
  await page.goto('?params=MOW1', {
    waitUntil: 'domcontentloaded',
  });

  const tripClass = page.locator('[data-test-id="trip-class"]');

  await page.locator('[data-test-id="passengers-field"]').click();

  const economy = page.locator('[data-test-id="trip-class-Y"]');
  const comfort = page.locator('[data-test-id="trip-class-W"]');
  const business = page.locator('[data-test-id="trip-class-C"]');
  const first = page.locator('[data-test-id="trip-class-F"]');
  const comfortLabel = page.locator('[data-test-id="radio-button"]').filter({ hasText: 'Комфорт' });

  await comfortLabel.click();

  await expect(economy).not.toBeChecked();
  await expect(business).not.toBeChecked();
  await expect(first).not.toBeChecked();
  await expect(comfort).toBeChecked();

  await expect(tripClass).toHaveText('Комфорт');

  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOWw1');
});


test('изменение эконом на первый класс, класс обслуживания , москва', async ({ page }) => {
  await page.goto('?params=MOW1', {
    waitUntil: 'domcontentloaded',
  });

  const tripClass = page.locator('[data-test-id="trip-class"]');

  await page.locator('[data-test-id="passengers-field"]').click();

  const economy = page.locator('[data-test-id="trip-class-Y"]');
  const comfort = page.locator('[data-test-id="trip-class-W"]');
  const business = page.locator('[data-test-id="trip-class-C"]');
  const first = page.locator('[data-test-id="trip-class-F"]');
  const firstLabel = page.locator('[data-test-id="radio-button"]').filter({ hasText: 'Первый класс' });

  await firstLabel.click();

  await expect(economy).not.toBeChecked();
  await expect(comfort).not.toBeChecked();
  await expect(business).not.toBeChecked();
  await expect(first).toBeChecked();

  await expect(tripClass).toHaveText('Первый класс');

  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOWf1');
});


test('изменение бизнес на эконом, класс обслуживания , москва', async ({ page }) => {
  await page.goto('?params=MOWc1', {
    waitUntil: 'domcontentloaded',
  });

  const tripClass = page.locator('[data-test-id="trip-class"]');

  await expect(tripClass).toHaveText('Бизнес');

  await page.locator('[data-test-id="passengers-field"]').click();

  const economy = page.locator('[data-test-id="trip-class-Y"]');
  const comfort = page.locator('[data-test-id="trip-class-W"]');
  const business = page.locator('[data-test-id="trip-class-C"]');
  const first = page.locator('[data-test-id="trip-class-F"]');
  const economyLabel = page.locator('[data-test-id="radio-button"]').filter({ hasText: 'Эконом' });

  await economyLabel.click();

  await expect(comfort).not.toBeChecked();
  await expect(business).not.toBeChecked();
  await expect(first).not.toBeChecked();
  await expect(economy).toBeChecked();

  await expect(tripClass).toHaveText('Эконом');

  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW1');
});