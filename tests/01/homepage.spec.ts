import { test, expect } from '@playwright/test';

test('загрузка главной страницы', async ({ page }) => {
    await page.goto('', {
        waitUntil: 'domcontentloaded',
    });

    await expect(
        page.locator('[data-test-id="logo-text"]')
    ).toBeVisible();
    await expect(
        page.locator('[data-test-id="destination-input"]')
    ).toBeVisible();
});

