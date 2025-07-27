import { test, expect } from "@playwright/test";

test.describe("Theme Button", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto("/");
    // Wait for app to load
    await page.waitForSelector('[data-testid="app-container"]', {
      timeout: 10000,
    });
  });

  test("toggle from dark to light theme", async ({ page }) => {
    // Check initial theme by looking at the logo src
    const logo = page.locator('[data-testid="inkFlow-logo"]');
    await expect(logo).toHaveAttribute("src", /InkFlowBlack\.png$/);

    // Open the settings drawer by clicking the settings button
    await page.click('[data-testid="setting-button"]');

    // Wait for the drawer to open and the theme toggle to be visible
    await page.waitForSelector("text=Toggle Theme", { timeout: 5000 });

    // Click the theme toggle button
    await page.click("text=Toggle Theme");

    // Confirm we're now in light theme by checking the logo changed to white
    await expect(logo).toHaveAttribute("src", /InkFlowWhite\.png$/);
  });

  test("toggle from light to dark theme", async ({ page }) => {
    // Open the settings drawer by clicking the settings button
    await page.click('[data-testid="setting-button"]');

    // Wait for the drawer to open and the theme toggle to be visible
    await page.waitForSelector("text=Toggle Theme", { timeout: 5000 });

    // First toggle to light theme
    await page.click("text=Toggle Theme");

    // Confirm we're in light theme by checking the logo
    const logo = page.locator('[data-testid="inkFlow-logo"]');
    await expect(logo).toHaveAttribute("src", /InkFlowWhite\.png$/);

    // Toggle back to dark theme
    await page.click('[data-testid="setting-button"]');
    await page.waitForSelector("text=Toggle Theme", { timeout: 5000 });
    await page.click("text=Toggle Theme");

    // Confirm we're back in dark theme by checking the logo
    await expect(logo).toHaveAttribute("src", /InkFlowBlack\.png$/);
  });

  test("theme toggle persists after drawer close and reopen", async ({
    page,
  }) => {
    // Open the settings drawer
    await page.click('[data-testid="setting-button"]');
    await page.waitForSelector("text=Toggle Theme", { timeout: 5000 });

    // Toggle to light theme
    await page.click("text=Toggle Theme");

    // Confirm we're in light theme by checking the logo
    const logo = page.locator('[data-testid="inkFlow-logo"]');
    await expect(logo).toHaveAttribute("src", /InkFlowWhite\.png$/);

    // Close the drawer by pressing escape
    await page.keyboard.press("Escape");

    // Wait for drawer to close
    await page.waitForSelector("text=Toggle Theme", {
      state: "hidden",
      timeout: 5000,
    });

    // Reopen the drawer
    await page.click('[data-testid="setting-button"]');
    await page.waitForSelector("text=Toggle Theme", { timeout: 5000 });

    // Confirm theme state persisted (should still be light theme)
    await expect(logo).toHaveAttribute("src", /InkFlowWhite\.png$/);
  });
});
