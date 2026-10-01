import { test, expect } from '@playwright/test';
import { MONTHS_SHORT_RU, getSearchDate } from '../helpers/helpers.ts';


test('результаты соответствуют поиску, москва — санкт-петербург', async ({ page }) => {

    const { day, month, searchDate } = getSearchDate(2);
    const expectedDate = `${day} ${MONTHS_SHORT_RU[month - 1]}`;
    const searchParams = `search/MOW${searchDate}LED1`;

    await page.goto(searchParams, {
        waitUntil: 'domcontentloaded',
    });

    const results = page.locator('[data-test-id="search-results-items-list"]');
    const strictTickets = results.locator('[data-test-id="ticket-preview"]');
    const normalTickets = results.locator('[data-test-id*="ticket-preview-normal"]');

    await expect.poll(
        async () => {
            const strictCount = await strictTickets.count();

            if (strictCount > 0) {
                return strictCount;
            }

            return normalTickets.count();
        },
        { timeout: 20_000 }
    ).toBeGreaterThan(0);

    const isStrictTicket = (await strictTickets.count()) > 0;
    const tickets = isStrictTicket ? strictTickets : normalTickets;

    await expect(tickets.first()).toBeVisible();

    const count = await tickets.count();

    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);

    for (let i = 0; i < count; i++) {
        const ticket = tickets.nth(i);

        await expect(ticket).toBeVisible();

        const moscow = ticket.getByText('Москва', { exact: true, });
        const route = isStrictTicket
            ? moscow.locator('..').locator('..')
            : moscow.locator('..').locator('..').locator('..').locator('..');
        const segments = route.locator(':scope > div');

        await expect(segments.nth(0).getByText('Москва', { exact: true })).toBeVisible();
        await expect(segments.nth(0).getByText(expectedDate, { exact: false })).toBeVisible();
        await expect(segments.nth(2).getByText('Санкт-Петербург', { exact: true })).toBeVisible();
    }
});


test('окно покупки через самые дешёвые билеты, москва — санкт-петербург', async ({ page }) => {
    await page.goto('?params=MOWLED1', {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="ticket-1"]').click();

    await expect(page.locator('[data-test-id="itinerary-segment-0"]').getByText('Москва — Санкт-Петербург')).toBeVisible();
    await expect(page.locator('[data-test-id="itinerary-segment-0-flight-0"]')).toBeVisible();

    const firstProposal = page.locator('[data-test-id^="proposal-"][data-test-price]').first();

    await expect(firstProposal).toBeVisible();
    await expect(firstProposal).toHaveAttribute('data-test-price', /^\d+$/);

    const price = Number(await firstProposal.getAttribute('data-test-price'));

    expect(price).toBeGreaterThan(0);
    await expect(firstProposal.locator('button')).toBeVisible();
});


test('окно покупки через поиск билетов, москва — санкт-петербург', async ({ page }) => {

    const { day, month, searchDate } = getSearchDate(2);
    const searchParams = `search/MOW${searchDate}LED1`;
    const expectedDate = `${day} ${MONTHS_SHORT_RU[month - 1]}`;

    await page.goto(`${searchParams}`, {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="direct-schedule-group-0"]').click();

    await expect(page.locator('[data-test-id="itinerary-segment-0"]').getByText('Москва — Санкт-Петербург')).toBeVisible();

    const flight = page.locator('[data-test-id="itinerary-segment-0-flight-0"]');

    await expect(flight).toBeVisible();

    const departureBlock = flight.locator('[data-test-id="text"]').filter({ hasText: 'Москва' }).locator('..').locator('..');

    await expect(departureBlock).toContainText(expectedDate);

    const firstProposal = page.locator('[data-test-id^="proposal-"][data-test-price]').first();

    await expect(firstProposal).toBeVisible();
    await expect(firstProposal).toHaveAttribute('data-test-price', /^\d+$/);

    const price = Number(await firstProposal.getAttribute('data-test-price'));

    expect(price).toBeGreaterThan(0);
    await expect(firstProposal.locator('button')).toBeVisible();
});


test('добавить багаж, окно покупки, москва — санкт-петербург', async ({ page }) => {

    const { searchDate } = getSearchDate(2);
    const searchParams = `search/MOW${searchDate}LED1`;

    await page.goto(`${searchParams}`, {
        waitUntil: 'domcontentloaded',
    });

    await page.locator('[data-test-id="direct-schedule-group-0"]').click();

    const modal = page.locator('[data-test-id="ticket-modal-content"]');
    const fareCard = modal.locator('[data-test-id="selected-fare-card"]');

    await expect(fareCard).toHaveAttribute('data-test-baggage', 'false');
    await expect(fareCard).toContainText('Без багажа');

    const baggageSwitch = modal.locator('[data-test-id="switch"]');
    const baggage = baggageSwitch.locator('..');
    const baggageOption = baggage.getByText('Добавить багаж');

    await expect(baggageOption).toBeVisible();
    await expect(baggageSwitch).toBeVisible();

    await baggageSwitch.click();

    await expect(fareCard).toHaveAttribute('data-test-baggage', 'true');
    await expect(fareCard).toContainText(/Багаж\s+\d+\s*кг\s*—\s*1\s*шт/);
    await expect(baggage.getByText('Выбрать багаж')).toBeVisible();
    await expect(baggage.getByText(/\d+\s*кг\s*—\s*1\s*шт/)).toBeVisible();
});