import { expect } from '@playwright/test'; 

const username = process.env.E2E_USERNAME || 'superadmin';
const password = process.env.E2E_PASSWORD || 'admin123';

/**
 * Login as admin user
 * @param {Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function loginAsAdmin(page) {
  await page.goto('/login');
  
  // Wait for form to be visible
  await page.getByLabel('Username').waitFor({ state: 'visible' });
  
  // Fill login form
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  
  // Click login button and wait for navigation
  await Promise.all([
    page.waitForNavigation({ url: '/' }),
    page.getByRole('button', { name: 'Login' }).click(),
  ]);
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
  await page.getByLabel('Role').click();
  await page.getByRole('option', { name: role }).click();
  await page.getByLabel('Password').fill(pwd);
  await page.getByLabel('Confirm Password').fill(pwd);
  
  await Promise.all([
    page.waitForNavigation({ url: /\/(|dashboard)/ }),
    page.getByRole('button', { name: 'Register' }).click(),
  ]);
  
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
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
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
    priority = 'medium',
    severity = 'low',
  } = ticketData;

  // Navigate to create ticket page
  await page.goto('/tickets/create');
  
  // Fill form
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Description').fill(description);
  await page.getByLabel('Priority').click();
  await page.getByRole('option', { name: priority }).click();
  await page.getByLabel('Severity').click();
  await page.getByRole('option', { name: severity }).click();
  
  // Submit and wait for ticket page
  await Promise.all([
    page.waitForNavigation({ url: /\/tickets\/\d+/ }),
    page.getByRole('button', { name: /Create|Submit/ }).click(),
  ]);
  
  // Extract ticket ID from URL
  const ticketId = page.url().match(/\/tickets\/(\d+)/)[1];
  return parseInt(ticketId);
}

/**
 * Add comment to ticket
 * @param {Page} page - Playwright page object
 * @param {string} text - Comment text
 * @returns {Promise<void>}
 */
export async function addComment(page, text) {
  await page.getByPlaceholder(/comment|message/i).fill(text);
  await page.getByRole('button', { name: /Post|Send|Comment/i }).click();
  
  // Wait for comment to appear
  await page.getByText(text).waitFor({ state: 'visible' });
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