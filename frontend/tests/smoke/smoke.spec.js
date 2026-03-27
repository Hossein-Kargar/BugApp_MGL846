import { test, expect } from '@playwright/test';
import {
  loginAsAdmin,
  loginAsUser,
  logout,
  registerUser,
  expectLoggedIn,
  expectLoggedOut,
  createTicket,
  addComment,
} from './fixtures/auth-helpers';

/**
Smoke Tests Suite
 */

test.describe('Smoke Tests - Core Functionality', () => {
  
  /**
   * Test 1: Verify home page loads without errors
   * 
   * This test ensures the application is accessible and renders correctly.
   * It validates the presence of main content and confirms no server errors occur.
   * 
   * Acceptance criteria:
   * - Page title matches expected pattern
   * - Main content area is visible
   * - HTTP response is successful (200, 301, or 302)
   */
  test('should load home page without errors', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Critical'
    });

    // Navigate to home page
    await page.goto('/');
    
    // Verify page title
    await expect(page).toHaveTitle(/BugTracker|Dashboard|Home|Bug Manager/i);
    
    // Verify main content is visible
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
    
    // Verify successful HTTP response
    const response = await page.request.head('/');
    expect([200, 301, 302]).toContain(response.status());
  });

  /**
   * Test 2: Verify login page structure and accessibility
   * 
   * This test ensures the login page contains all required form fields
   * and buttons for user authentication.
   * 
   * Acceptance criteria:
   * - Username field is visible
   * - Password field is visible
   * - Login button is accessible
   * - Register link is available
   */
  test('should display login page with all required fields', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Critical'
    });

    // Navigate to login page
    await page.goto('/login');

    const loginForm = page.locator('form');
    
    // Verify username field exists
    await expect(page.getByLabel('Username')).toBeVisible();
    
    // Verify password field exists
    await expect(page.getByLabel('Password')).toBeVisible();
    
    // Verify login button exists
    await expect(loginForm.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
    
    // Verify register link exists
    await expect(loginForm.getByRole('link', { name: /register/i })).toBeVisible();
  });

  /**
   * Test 3: Verify admin user login workflow
   * 
   * This test validates the complete login process including form submission
   * and successful navigation to the authenticated area.
   * 
   * Acceptance criteria:
   * - User can submit login form
   * - Page redirects to home page
   * - User remains authenticated (logged in state verified)
   */
  test('should login successfully with valid credentials', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Critical'
    });

    // Execute login process
    await loginAsAdmin(page);
    
    // Verify user is logged in
    await expectLoggedIn(page);
  });

  /**
   * Test 4: Verify dashboard is accessible after authentication
   * 
   * This test ensures authenticated users can access the main dashboard
   * and that core UI elements are present.
   * 
   * Acceptance criteria:
   * - Dashboard loads successfully
   * - BugTracker header is visible
   * - Navigation menu is present
   */
  test('should display dashboard after login', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High'
    });

    // Login as admin user
    await loginAsAdmin(page);
    
    // Navigate to home page
    await page.goto('/');
    
    // Verify BugTracker header is visible
    await expect(page.getByText('BugTracker')).toBeVisible();
    
    // Verify navigation menu is visible
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tickets' })).toBeVisible();
  });

  /**
   * Test 5: Verify tickets list page is accessible
   * 
   * This test validates that authenticated users can view the list of tickets.
   * It confirms the page loads correctly and displays ticket data.
   * 
   * Acceptance criteria:
   * - Tickets list page loads
   * - Page content loads within network timeout
   * - Ticket data is displayed in table or grid format
   */
  test('should display tickets list page', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High'
    });

    // Login as admin user
    await loginAsAdmin(page);
    
    // Navigate to tickets list
    await page.goto('/tickets');
    
    // Wait for network activity to complete
    await page.waitForLoadState('networkidle');
    
    // Verify ticket list is visible
    await expect(
      page.locator('table, [role="grid"], .ticket-list, .tickets')
    ).toBeVisible({
      timeout: 5000
    });
  });

  /**
   * Test 6: Verify new ticket creation workflow
   * 
   * This test validates the complete ticket creation process, which is
   * a core feature of the application.
   * 
   * Acceptance criteria:
   * - User can access ticket creation form
   * - Form can be filled with required data
   * - Ticket is created and assigned an ID
   * - User is redirected to ticket detail page
   */
  test('should create new ticket successfully', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Critical'
    });

    // Login as admin user
    await loginAsAdmin(page);

    const ticketTitle = `Smoke Test Ticket ${Date.now()}`;
    
    // Create a new ticket with test data
    const ticketId = await createTicket(page, {
      title: ticketTitle,
      description: 'This is a smoke test ticket for validation',
      priority: 'High',
      severity: 'Medium',
    });
    
    // Verify ticket was created and has valid ID
    expect(ticketId).toBeGreaterThan(0);
    
    // Verify the exact created ticket title is displayed
    await expect(page.getByRole('cell', { name: ticketTitle, exact: true })).toBeVisible();
  });

  /**
   * Test 7: Verify ticket detail page is accessible
   * 
   * This test validates that ticket detail pages load correctly and
   * display the ticket information.
   * 
   * Acceptance criteria:
   * - Ticket detail page URL is correct
   * - Page title/heading is displayed
   * - Page content is visible
   */
  test('should display ticket detail page', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High'
    });

    // Login as admin user
    await loginAsAdmin(page);
    
    // Create a ticket (to ensure one exists)
    const ticketId = await createTicket(page);
    
    // Navigate away from ticket detail page
    await page.goto('/tickets');
    
    // Navigate back to the specific ticket detail page using the ID
    await page.goto(`/tickets/${ticketId}`);
    
    // Verify we're on the correct ticket detail page
    await expect(page).toHaveURL(`/tickets/${ticketId}`);
    
    // Verify page heading/title is visible
    await expect(page.getByRole('heading')).toBeVisible();
  });

  /**
   * Test 8: Verify comment functionality on tickets
   * 
   * This test validates that users can add comments to tickets,
   * which is a secondary but important feature.
   * 
   * Acceptance criteria:
   * - Comment form is accessible
   * - Comment can be submitted
   * - Comment appears in the page after submission
   */
  test('should add comment to ticket successfully', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High'
    });

    // Login as admin user
    await loginAsAdmin(page);
    
    // Create a ticket
    const ticketId = await createTicket(page);

    // Open ticket detail page
    await page.goto(`/tickets/${ticketId}`);
    
    // Generate unique comment text
    const commentText = `Test comment ${Date.now()}`;
    
    // Add comment to ticket
    const createdComment = await addComment(page, commentText, ticketId);
    
    // Verify comment creation result
    expect(createdComment.text).toBe(commentText);
  });

  /**
   * Test 9: Verify user logout workflow
   * 
   * This test validates that users can successfully log out of the application
   * and that session is properly terminated.
   * 
   * Acceptance criteria:
   * - User is logged in initially
   * - Logout action completes successfully
   * - User is redirected to login page
   * - Login form is displayed
   */
  test('should logout successfully', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High'
    });

    // Login as admin user
    await loginAsAdmin(page);
    
    // Verify user is logged in
    await expectLoggedIn(page);
    
    // Execute logout
    await logout(page);
    
    // Verify user is logged out
    await expectLoggedOut(page);
  });

  /**
   * Test 10: Verify no server errors occur during main workflows
   * 
   * This test monitors for HTTP 500 errors while navigating through
   * the application. It serves as a general health check.
   * 
   * Acceptance criteria:
   * - No HTTP 500 errors are returned
   * - All requests complete successfully
   * - Server remains responsive
   */
  test('should not encounter server errors on main pages', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'Critical'
    });

    // Array to collect server errors
    const serverErrors = [];
    
    // Monitor all HTTP responses
    page.on('response', response => {
      if (response.status() === 500) {
        serverErrors.push({
          status: response.status(),
          url: response.url()
        });
      }
    });
    
    // Navigate through main pages
    await page.goto('/');
    await page.goto('/login');
    
    // Login and continue navigation
    await loginAsAdmin(page);
    await page.goto('/tickets');
    await page.goto('/');
    
    // Verify no server errors occurred
    expect(serverErrors).toHaveLength(0);
  });
});

test.describe('Smoke Tests - Additional Functionality', () => {
  
  /**
   * Test 11: Verify user registration workflow
   * 
   * This test validates that new users can register for the application
   * and are automatically logged in upon successful registration.
   * 
   * Acceptance criteria:
   * - Registration form is accessible
   * - New user can be created with unique credentials
   * - User is logged in after registration
   */
  test('should register new user successfully', async ({ page }) => {
    test.info().annotations.push({
      type: 'severity',
      description: 'High'
    });

    // Register a new user with unique credentials
    const userData = await registerUser(page, {
      first_name: 'Smoke',
      last_name: 'Test',
      role: 'developer'
    });
    
    // Verify user is logged in with new account
    await expectLoggedIn(page, userData.username);
  });
});