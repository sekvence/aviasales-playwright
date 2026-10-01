import { test, expect } from '@playwright/test';
import { getSearchDate } from '../helpers/helpers.ts';


test('фильтр авиасейлс соответствует предложениям в карточках, москва — санкт-петербург', async ({ page }) => {

    test.setTimeout(60_000);

    const { searchDate } = getSearchDate(2);
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

    const countBeforeFilter = await tickets.count();

    expect(countBeforeFilter).toBeGreaterThan(0);

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
    const input = checkbox.locator('input');
    
    await expect(checkbox).toBeVisible();
    await expect(input).toBeAttached();

    await checkbox.click();

    await expect(input).toBeChecked();
    await expect(tickets.first()).toBeVisible();

    const count = await tickets.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {

        const ticket = tickets.nth(i);

        await expect(ticket).toBeVisible();

        await ticket.click();

        const drawer = page.locator('[data-test-id="drawer-content"]');

        await expect(drawer).toBeVisible();
        await expect(drawer.getByText('Напрямую у Авиасейлс', { exact: true })).toBeVisible();

        await page.keyboard.press('Escape');

        await expect(drawer).toBeHidden();
    }
});