import { expect } from '@playwright/test'; 

const username = process.env.E2E_USERNAME || 'superadmin';
const password = process.env.E2E_PASSWORD || 'admin123';
const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Login as admin user
 * @param {Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function loginAsAdmin(page) {
  await page.goto('/login');

  const loginForm = page.locator('form');
  const submitButton = loginForm.locator('button[type="submit"]');
  
  // Wait for form to be visible
  await page.getByLabel('Username').waitFor({ state: 'visible' });
  
  // Fill login form
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  
  // In React SPA flows, URL wait is more reliable than waitForNavigation.
  await submitButton.click();
  await page.waitForURL(/\/(|dashboard|tickets)$/, { timeout: 10000 });
}

/**
 * Login as custom user
 * @param {Page} page - Playwright page object
 * @param {string} uname - Username
 * @param {string} pwd - Password
 * @returns {Promise<void>}
 */
export async function loginAsUser(page, uname, pwd) {
  await page.goto('/login');
  
  await page.getByLabel('Username').waitFor({ state: 'visible' });
  await page.getByLabel('Username').fill(uname);
  await page.getByLabel('Password').fill(pwd);
  
  await Promise.all([
    page.waitForNavigation({ url: /\/(|dashboard|tickets)/ }),
    page.getByRole('button', { name: 'Login' }).click(),
  ]);
}

/**
 * Logout current user
 * @param {Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function logout(page) {
  // Click on user avatar/dropdown
  const userDropdown = page.locator('.ant-avatar');
  await userDropdown.click();
  
  // Click logout button
  await page.getByRole('menuitem', { name: /logout/i }).click();
  
  // Wait for redirect to login page
  await page.waitForURL('/login');
}

/**
 * Register a new user with unique credentials
 * @param {Page} page - Playwright page object
 * @param {Object} userData - User data
 * @returns {Promise<{username: string, email: string, password: string}>}
 */
export async function registerUser(page, userData = {}) {
  const {
    username: uname = `user_${Date.now()}`,
    email = `user_${Date.now()}@test.com`,
    password: pwd = 'TestPassword123!',
    first_name = 'Test',
    last_name = 'User',
    role = 'developer',
  } = userData;

  await page.goto('/register');
  
  await page.getByLabel('Username').waitFor({ state: 'visible' });
  
  await page.getByLabel('Username').fill(uname);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('First Name').fill(first_name);
  await page.getByLabel('Last Name').fill(last_name);

  // Select role from the currently visible Ant Design dropdown.
  const roleLabelMap = {
    developer: 'Developer',
    chef: 'Chef',
    admin: 'Admin',
  };
  const roleLabel = roleLabelMap[String(role).toLowerCase()] || String(role);
  await page.getByLabel('Role').click();
  const visibleDropdown = page
    .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
    .last();
  await expect(visibleDropdown).toBeVisible();
  await visibleDropdown.getByTitle(roleLabel, { exact: true }).click();

  await page.locator('#password').fill(pwd);
  await page.locator('#password_confirm').fill(pwd);

  await page.getByRole('button', { name: 'Register', exact: true }).click();
  await page.waitForURL(/\/(|dashboard|tickets)$/, { timeout: 10000 });
  
  return { username: uname, email, password: pwd };
}

/**
 * Verify user is logged in
 * @param {Page} page - Playwright page object
 * @param {string} expectedUsername - Expected username
 * @returns {Promise<void>}
 */
export async function expectLoggedIn(page, expectedUsername = username) {
  await page.waitForURL(/\/(|dashboard|tickets)/, { timeout: 5000 });
  await expect(page.getByText('BugTracker')).toBeVisible();
  await expect(page.getByText(expectedUsername, { exact: true })).toBeVisible();
}

/**
 * Verify user is logged out
 * @param {Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function expectLoggedOut(page) {
  await page.waitForURL('/login', { timeout: 5000 });
  await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
}

/**
 * Create a ticket
 * @param {Page} page - Playwright page object
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<number>} - Ticket ID
 */
export async function createTicket(page, ticketData = {}) {
  const {
    title = `Ticket ${Date.now()}`,
    description = 'Test ticket description',
    priority = 'Medium',
    severity = 'Medium',
  } = ticketData;

  // Navigate to create ticket page
  await page.goto('/tickets/create');
  
  // Wait for form to be visible
  await page.getByLabel('Title').waitFor({ state: 'visible' });
  
  // Fill form
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Description').fill(description);

  const selectAntdOption = async (label, value) => {
    await page.getByLabel(label).click();

    // Ant Design keeps old dropdowns in DOM; select only from the visible one.
    const visibleDropdown = page
      .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)')
      .last();

    await expect(visibleDropdown).toBeVisible();
    await visibleDropdown.getByTitle(value, { exact: true }).click();
  };

  await selectAntdOption('Priority', priority);
  await selectAntdOption('Severity', severity);
  
  // Capture ticket creation response and wait for SPA redirect to list page.
  const createTicketResponsePromise = page.waitForResponse((response) => {
    const isPost = response.request().method() === 'POST';
    const isTicketEndpoint = /\/tickets\/?$/.test(new URL(response.url()).pathname);
    return isPost && isTicketEndpoint && response.status() >= 200 && response.status() < 300;
  });

  await page.getByRole('button', { name: /Create|Submit/ }).click();
  await page.waitForURL(/\/tickets$/, { timeout: 10000 });

  const createTicketResponse = await createTicketResponsePromise;
  const createdTicket = await createTicketResponse.json();
  let ticketId = Number(
    createdTicket?.id ?? createdTicket?.ticket?.id ?? createdTicket?.data?.id
  );

  // Backend create serializer may not include id; recover it from the list row.
  if (!Number.isFinite(ticketId) || ticketId <= 0) {
    const createdRow = page.locator('tr').filter({ hasText: title }).first();
    await expect(createdRow).toBeVisible({ timeout: 10000 });
    const idText = (await createdRow.locator('td').first().innerText()).trim();
    ticketId = Number(idText);
  }

  if (!Number.isFinite(ticketId) || ticketId <= 0) {
    throw new Error('Ticket created but id could not be resolved from API response or tickets table.');
  }

  return ticketId;
}

/**
 * Add comment to ticket
 * @param {Page} page - Playwright page object
 * @param {string} text - Comment text
 * @param {number} [ticketId] - Optional ticket ID fallback when URL does not include it
 * @returns {Promise<{id: number | null, text: string}>}
 */
export async function addComment(page, text, ticketId) {
  const commentInput = page.getByPlaceholder(/comment|message/i).first();

  if (await commentInput.isVisible().catch(() => false)) {
    await commentInput.fill(text);
    await page.getByRole('button', { name: /Post|Send|Comment/i }).click();
    await page.getByText(text, { exact: true }).waitFor({ state: 'visible' });
    return { id: null, text };
  }

  const token = await page.evaluate(() => localStorage.getItem('token'));
  if (!token) {
    throw new Error('Cannot create comment: missing auth token in localStorage.');
  }

  const ticketIdFromUrl = Number(page.url().match(/\/tickets\/(\d+)/)?.[1]);
  const targetTicketId = Number(ticketId ?? ticketIdFromUrl);

  if (!Number.isFinite(targetTicketId) || targetTicketId <= 0) {
    throw new Error('Cannot create comment: no valid ticket id available.');
  }

  const createResponse = await page.request.post(`${apiBaseUrl}/comments/ticket/${targetTicketId}/`, {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    data: {
      ticket: targetTicketId,
      text,
    },
  });

  expect(createResponse.ok()).toBeTruthy();

  const createdComment = await createResponse.json();

  let found = false;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const listResponse = await page.request.get(`${apiBaseUrl}/comments/ticket/${targetTicketId}/`, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    expect(listResponse.ok()).toBeTruthy();
    const listPayload = await listResponse.json();
    const comments = Array.isArray(listPayload) ? listPayload : (listPayload.results || []);
    found = comments.some((comment) => (comment?.text || '').trim() === text.trim());

    if (found) break;
    await page.waitForTimeout(500);
  }

  expect(found).toBeTruthy();

  return { id: createdComment?.id ?? null, text };
}

/**
 * Check for console errors
 * @param {Page} page - Playwright page object
 * @returns {Promise<string[]>} - Array of error messages
 */
export async function getConsoleErrors(page) {
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  return errors;
}