import { test, expect } from '@playwright/test';
import { MONTHS_RU, MONTHS_SHORT_RU } from '../helpers/helpers.ts';


test('выбор точной даты когда, москва', async ({ page }) => {
    await page.goto('?params=MOW1', {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="start-date-field"]').click();

    const today = page.locator('td[data-today="true"]:not([data-hidden="true"])');
    await expect(today).toHaveCount(1);
    const todayDate = await today.getAttribute('data-day');

    if (!todayDate) {
        throw new Error('У сегодняшней даты отсутствует data-day');
    }

    const [, month, day] = todayDate.split('-').map(Number);
    const expectedDate = `${day} ${MONTHS_RU[month - 1]}`;
    const startButton = today.locator('button').first();

    await startButton.click();

    await expect(page.locator('[data-test-id="start-date-value"]')).toContainText(expectedDate);

    await page.locator('[data-test-id="calendar-action-button"]').click();

    const expectedParams = `MOW${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}1`;

    await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe(expectedParams);
});


test('выбор точных дат когда и обратно, москва', async ({ page }) => {
    await page.goto('?params=MOW1', {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="start-date-field"]').click();

    const today = page.locator('td[data-today="true"]:not([data-hidden="true"])');
    const todayDate = await today.getAttribute('data-day');

    if (!todayDate) {
        throw new Error('У сегодняшней даты отсутствует data-day');
    }

    const [year, month, day] = todayDate.split('-').map(Number);
    const expectedStartDate = `${day} ${MONTHS_RU[month - 1]}`;
    const startButton = today.locator('button').first();

    await startButton.click();

    await expect(page.locator('[data-test-id="start-date-value"]')).toContainText(expectedStartDate);

    await page.locator('[data-test-id="end-date-field"]').click();

    const returnDate = new Date(year, month, 10);
    const returnYear = returnDate.getFullYear();
    const returnMonth = returnDate.getMonth() + 1;
    const returnDay = returnDate.getDate();

    const returnDateCell = page.locator(
        `td[data-day="${returnYear}-${String(returnMonth).padStart(2, '0')}-${String(returnDay).padStart(2, '0')}"]`
    );

    await returnDateCell.locator('button').first().click();

    const expectedReturnDate = `10 ${MONTHS_RU[month]}`;

    await expect(page.locator('[data-test-id="end-date-value"]')).toContainText(expectedReturnDate);

    await page.locator('[data-test-id="calendar-action-button"]').click();

    const expectedParams = `MOW${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${returnDay}${String(returnMonth).padStart(2, '0')}1`;

    await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe(expectedParams);
});


test('выбор плавающей даты когда, москва', async ({ page }) => {
    await page.goto('?params=MOW1', {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="start-date-field"]').click();

    const today = page.locator('td[data-today="true"]:not([data-hidden="true"])');
    const todayDate = await today.getAttribute('data-day');

    if (!todayDate) {
        throw new Error('У сегодняшней даты отсутствует data-day');
    }

    const [year, month, day] = todayDate.split('-').map(Number);

    const startDate = new Date(year, month - 1, day);
    const targetDate = new Date(year, month, 15);

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1;

    const target = page.locator(`td[data-day="${targetYear}-${String(targetMonth).padStart(2, '0')}-15"]`);

    const startButton = today.locator('button').first();
    const targetButton = target.locator('button').first();

    await startButton.click();
    await startButton.dragTo(targetButton);

    const expectedDate = `${day} ${MONTHS_SHORT_RU[month - 1]} — 15 ${MONTHS_SHORT_RU[targetMonth - 1]}`;

    await expect(page.locator('[data-test-id="start-date-value"]')).toContainText(expectedDate);

    const departureOffset = Math.round((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const expectedParams = `MOW${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}1`;

    await page.locator('[data-test-id="calendar-action-button"]').click();

    await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe(expectedParams);
    await expect.poll(() => new URL(page.url()).searchParams.get('departure_offset')).toBe(String(departureOffset));
});


test('выбор плавающих дат когда и обратно, москва', async ({ page }) => {
    await page.goto('?params=MOW1', {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="start-date-field"]').click();

    const today = page.locator('td[data-today="true"]:not([data-hidden="true"])');
    const todayDate = await today.getAttribute('data-day');

    if (!todayDate) {
        throw new Error('У сегодняшней даты отсутствует data-day');
    }

    const [year, month, day] = todayDate.split('-').map(Number);

    const startDate = new Date(year, month - 1, day);
    const startTargetDate = new Date(year, month, 15);

    const startTarget = page.locator(
        `td[data-day="${startTargetDate.getFullYear()}-${String(
            startTargetDate.getMonth() + 1
        ).padStart(2, '0')}-15"]`
    );

    const startButton = today.locator('button').first();
    const startTargetButton = startTarget.locator('button').first();

    await startButton.click();
    await startButton.dragTo(startTargetButton);

    const expectedStartDate = `${day} ${MONTHS_SHORT_RU[month - 1]} — 15 ${MONTHS_SHORT_RU[startTargetDate.getMonth()]}`;

    await expect(page.locator('[data-test-id="start-date-value"]')).toContainText(expectedStartDate);

    await page.locator('[data-test-id="end-date-field"]').click();

    const returnStartDate = new Date(year, month, 10);
    const returnTargetDate = new Date(year, month, 20);

    const returnStart = page.locator(
        `td[data-day="${returnStartDate.getFullYear()}-${String(
            returnStartDate.getMonth() + 1
        ).padStart(2, '0')}-10"]`
    );
    const returnTarget = page.locator(
        `td[data-day="${returnTargetDate.getFullYear()}-${String(
            returnTargetDate.getMonth() + 1
        ).padStart(2, '0')}-20"]`
    );

    const returnStartButton = returnStart.locator('button').first();
    const returnTargetButton = returnTarget.locator('button').first();

    await returnStartButton.click();
    await returnStartButton.dragTo(returnTargetButton);

    const expectedReturnDate = `10–20 ${MONTHS_RU[returnStartDate.getMonth()]}`;

    await expect(page.locator('[data-test-id="end-date-value"]')).toContainText(expectedReturnDate);

    const departureOffset = Math.round(
        (startTargetDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const returnOffset = Math.round(
        (returnTargetDate.getTime() - returnStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    await page.locator('[data-test-id="calendar-action-button"]').click();

    const expectedParams =
        `MOW${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}10${String(
            returnStartDate.getMonth() + 1
        ).padStart(2, '0')}1`;

    await expect.poll(() => new URL(page.url()).searchParams.get('params')).toBe(expectedParams);
    await expect.poll(() => new URL(page.url()).searchParams.get('departure_offset')).toBe(String(departureOffset));
    await expect.poll(() => new URL(page.url()).searchParams.get('return_offset')).toBe(String(returnOffset));
});