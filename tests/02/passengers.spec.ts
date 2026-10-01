import { test, expect } from '@playwright/test';


test('добавление взрослого пассажира, москва', async ({ page }) => {
  await page.goto('?params=MOW1', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('1 пассажир');

  await page.locator('[data-test-id="passengers-field"]').click();

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const children = page.locator('[data-test-id="number-of-children"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');
  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('0');

  await adults.locator('[data-test-id="increase-button"]').click();

  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('2');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('2 пассажира');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW2');
});


test('добавление ребенка пассажира, москва', async ({ page }) => {
  await page.goto('?params=MOW1', {
    waitUntil: 'domcontentloaded',
  });
  await page.locator('[data-test-id="passengers-field"]').click();

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const children = page.locator('[data-test-id="number-of-children"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');

  await children.locator('[data-test-id="increase-button"]').click();

  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('2 пассажира');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW11');
});


test('добавление младенца пассажира, москва', async ({ page }) => {
  await page.goto('?params=MOW1', {
    waitUntil: 'domcontentloaded',
  });
  await page.locator('[data-test-id="passengers-field"]').click();

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const children = page.locator('[data-test-id="number-of-children"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');

  await infants.locator('[data-test-id="increase-button"]').click();

  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('2 пассажира');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW101');
});


test('удаление взрослого пассажира, москва', async ({ page }) => {
  await page.goto('?params=MOW2', {
    waitUntil: 'domcontentloaded',
  });

  await page.locator('[data-test-id="passengers-field"]').click();

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const children = page.locator('[data-test-id="number-of-children"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');

  await adults.locator('[data-test-id="decrease-button"]').click();

  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('1 пассажир');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW1');
});


test('удаление ребенка пассажира, москва', async ({ page }) => {
  await page.goto('?params=MOW11', {
    waitUntil: 'domcontentloaded',
  });

  await page.locator('[data-test-id="passengers-field"]').click();

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const children = page.locator('[data-test-id="number-of-children"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');

  await children.locator('[data-test-id="decrease-button"]').click();

  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('1 пассажир');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW1');
});


test('удаление младенца пассажира, москва', async ({ page }) => {
  await page.goto('?params=MOW101', {
    waitUntil: 'domcontentloaded',
  });

  await page.locator('[data-test-id="passengers-field"]').click();

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const children = page.locator('[data-test-id="number-of-children"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');

  await infants.locator('[data-test-id="decrease-button"]').click();

  await expect(adults.locator('[data-test-id="passenger-number"]')).toContainText('1');
  await expect(children.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(infants.locator('[data-test-id="passenger-number"]')).toContainText('0');
  await expect(page.locator('[data-test-id="passenger-numbers"]')).toHaveText('1 пассажир');
  await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe('MOW1');
});


test('ограничение количества младенцев относительно взрослых пассажиров, москва', async ({ page }) => {
  await page.goto('?params=MOW101', {
    waitUntil: 'domcontentloaded',
  });

  await page.locator('[data-test-id="passengers-field"]').click();

  const message = 'Младенцев без места не может быть больше, чем взрослых';

  const adults = page.locator('[data-test-id="number-of-adults"]');
  const infants = page.locator('[data-test-id="number-of-infants"]');
  const decreaseAdult = adults.locator('[data-test-id="decrease-button"]');
  const increaseInfant = infants.locator('[data-test-id="increase-button"]');

  await expect(decreaseAdult).toBeDisabled();
  await expect(increaseInfant).toBeDisabled();

  const decreaseAdultBox = await decreaseAdult.boundingBox();

  if (!decreaseAdultBox) {
    throw new Error('Не удалось получить координаты кнопки уменьшения взрослых');
  }
  await page.mouse.move(
    decreaseAdultBox.x + decreaseAdultBox.width / 2,
    decreaseAdultBox.y + decreaseAdultBox.height / 2
  );
  await expect(page.getByText(message)).toBeVisible();

  const increaseInfantBox = await increaseInfant.boundingBox();

  if (!increaseInfantBox) {
    throw new Error('Не удалось получить координаты кнопки увеличения младенцев');
  }
  await page.mouse.move(
    increaseInfantBox.x + increaseInfantBox.width / 2,
    increaseInfantBox.y + increaseInfantBox.height / 2
  );
  await expect(page.getByText(message)).toBeVisible();
});