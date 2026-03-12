const { defineConfig, devices } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const dotenvPath = path.join(__dirname, '.env.e2e');
if (fs.existsSync(dotenvPath)) {
  require('dotenv').config({ path: dotenvPath });
}

const port = process.env.PLAYWRIGHT_PORT || process.env.PORT || 3000;
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: true,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 300,
    },
  },
  webServer: {
    command: `${npmCmd} start`,
    cwd: __dirname,
    url: baseURL,
    env: {
      ...process.env,
      PORT: String(port),
    },
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
