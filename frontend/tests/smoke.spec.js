const { test, expect } = require('@playwright/test');

const username = process.env.E2E_USERNAME || 'superadmin';
const password = process.env.E2E_PASSWORD || 'admin123';

test('login works', async ({ page }, testInfo) => {
  test.setTimeout(120000);
  page.setDefaultTimeout(15000);
  page.setDefaultNavigationTimeout(15000);
  const runId = `${Date.now()}-${testInfo.workerIndex}`;
  const ticketTitle = `Test Playwright ${runId}`;
  const ticketDescription = `Description Test Playwright ${runId}`;

  await test.step('Open home and go to login', async () => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL('/login');
  });

  await test.step('Login form', async () => {
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    const [loginRequest] = await Promise.all([
      page.waitForRequest((request) => {
        return request.url().includes('/auth/login/') && request.method() === 'POST';
      }),
      page.locator('form').getByRole('button', { name: 'Login' }).click(),
    ]);

    const loginResponse = await loginRequest.response();
    if (!loginResponse) {
      throw new Error('Login request failed without response. Is the backend running?');
    }
    expect(loginResponse.ok()).toBeTruthy();
  });

  await test.step('Go to Tickets and open create form', async () => {
    await page.waitForURL(/\/$/, { timeout: 15000 });
    await expect(page.getByText('BugTracker')).toBeVisible();
    await expect(page.getByText(username, { exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Tickets' }).click();
    await page.waitForURL(/\/tickets/, { timeout: 15000 });

    await page.getByRole('button', { name: 'New Ticket' }).click();
    await Promise.race([
      page.waitForURL(/\/tickets\/create/, { timeout: 15000 }),
      page.getByText('Create New Ticket').waitFor({ state: 'visible', timeout: 15000 }),
    ]);
    await expect(page.getByText('Create New Ticket')).toBeVisible({ timeout: 15000 });
  });

  await test.step('Fill ticket form', async () => {
    await page.getByLabel('Title').fill(ticketTitle);
    await page.getByLabel('Description').fill(ticketDescription);

    await page.getByLabel('Assign to').click();
    const assigneeDropdown = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    await expect(assigneeDropdown).toBeVisible({ timeout: 15000 });
    const preferredAssignee = assigneeDropdown.locator('.ant-select-item-option', {
      hasText: new RegExp(username, 'i'),
    });
    if ((await preferredAssignee.count()) > 0) {
      await preferredAssignee.first().click();
    } else {
      await assigneeDropdown.locator('.ant-select-item-option').first().click();
    }

    await page.getByLabel('Priority').click();
    const priorityOption = page
      .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .locator('.ant-select-item-option', { hasText: 'Low' });
    await expect(priorityOption).toBeVisible({ timeout: 15000 });
    await priorityOption.click();

    await page.getByLabel('Severity').click();
    const severityOption = page
      .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .locator('.ant-select-item-option', { hasText: 'High' });
    await expect(severityOption).toBeVisible({ timeout: 15000 });
    await severityOption.click();

    await page.getByLabel('Due Date').fill('2026-03-26');
    await page.keyboard.press('Tab');
  });

  await test.step('Create ticket and verify in list', async () => {
    const createContainer = page
      .locator('.ant-card, .ant-modal-content, .ant-drawer-content')
      .filter({ has: page.getByLabel('Title') })
      .first();
    const createButton = createContainer.locator('button[type="submit"]');
    await expect(createButton).toBeVisible({ timeout: 15000 });
    await expect(createButton).toBeEnabled({ timeout: 15000 });
    const [createResponse] = await Promise.all([
      page.waitForResponse((response) => {
        return response.url().includes('/tickets/') && response.request().method() === 'POST';
      }),
      createButton.click(),
    ]);

    expect(createResponse.ok()).toBeTruthy();

    const searchInput = page.getByPlaceholder('Search tickets...');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill(ticketTitle);
    const matchingRows = page.getByRole('row', { name: new RegExp(ticketTitle) });
    await expect(matchingRows.first()).toBeVisible({ timeout: 15000 });
  });
});
// 