import { test, expect } from '@playwright/test';
import { getSearchDate, MONTHS_SHORT_RU } from '../helpers/helpers.ts';


test('покупка билета через авиасейлс, москва — санкт-петербург', async ({ page, context }) => {

    test.setTimeout(60_000);

    const { day, month, searchDate } = getSearchDate(2);

    const searchParams = `search/MOW${searchDate}LED1`;
    const expectedDate = `${day} ${MONTHS_SHORT_RU[month - 1]}`;

    let departureAirport;
    let arrivalAirport;

    await page.goto(searchParams, {
        waitUntil: 'domcontentloaded',
    });

    const agentsFilter = page.locator('[data-test-id="filter-group-agents_side_group"]');

    await expect(agentsFilter).toBeVisible();
    await expect(agentsFilter).toBeEnabled();

    const setFilter = page.locator('[data-test-id="set-filter-agents"]');

    await expect.poll(
        async () => {
            await agentsFilter.click();
            return setFilter.isVisible();
        },
        { timeout: 10_000 }
    ).toBe(true);

    const aviasalesFilter = page.locator('[data-test-id="set-filter-row-aviasales|1"]');

    const checkbox = aviasalesFilter.locator('[data-test-id="checkbox"]');
    const input = aviasalesFilter.locator('[data-test-id="checkbox"] input');
    
    await expect(checkbox).toBeVisible();
    await expect(input).toBeAttached();

    await checkbox.click();

    await expect(input).toBeChecked();

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
    const firstTicket = tickets.first();

    await firstTicket.click({ trial: true });
    await expect(firstTicket).toBeVisible();
    await expect(firstTicket).toBeEnabled();

    const moscow = firstTicket.getByText('Москва', { exact: true, });

    const route = isStrictTicket
        ? moscow.locator('..').locator('..')
        : moscow.locator('..').locator('..').locator('..').locator('..');
    const segments = route.locator(':scope > div');
    const airports = segments.nth(1).locator('[data-test-id="text"]').filter({ hasText: /^[A-Z]{3}$/ });

    await firstTicket.click();

    const drawer = page.locator('[data-test-id="drawer-content"]');

    await expect(drawer).toBeVisible();

    const aviasalesProposal = drawer.locator('[data-test-id^="proposal-"]').filter({ hasText: 'Напрямую у Авиасейлс', }).first();

    await expect(aviasalesProposal).toBeVisible();

    const buyButton = aviasalesProposal.locator('[data-test-id$="-button"]');

    await expect(buyButton).toBeVisible();


    departureAirport = isStrictTicket
        ? await airports.nth(0).textContent()
        : await route.locator('[data-test-id$="route-origin-iata"]').textContent();
    arrivalAirport = isStrictTicket
        ? await airports.nth(1).textContent()
        : await route.locator('[data-test-id$="route-destination-iata"]').textContent();

    const newPagePromise = context.waitForEvent('page');

    await buyButton.click();

    const newPage = await newPagePromise;

    await expect(newPage).toHaveURL(/\/booking/);

    const bookingUrl = new URL(newPage.url());

    expect(bookingUrl.searchParams.get('adults')).toBe('1');
    expect(bookingUrl.searchParams.get('children')).toBe('0');
    expect(bookingUrl.searchParams.get('infants')).toBe('0');

    expect(bookingUrl.searchParams.get('departure_city')).toBe('Москва');
    expect(bookingUrl.searchParams.get('arrival_city')).toBe('Санкт-Петербург');

    await newPage.waitForLoadState('domcontentloaded');

    expect(newPage.url()).toContain('aviasales.ru/booking');

    await expect(newPage.locator('[data-test-id="informer-panel-departure-time-iata"]')).toContainText(departureAirport!);
    await expect(newPage.locator('[data-test-id="informer-panel-arrival-time-iata"]')).toContainText(arrivalAirport!);
    await expect(newPage.locator('[data-test-id="informer-panel-departure-date"]')).toContainText(expectedDate);
    await expect(newPage.locator('[data-test-id="passengers-form"]')).toHaveCount(1);

});

