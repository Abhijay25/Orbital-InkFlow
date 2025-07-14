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
    // Confirm we're in dark theme
    await expect(page.locator('[data-testid="lightModeIcon"]')).toBeVisible();
    // Click toggle
    await page.click('[data-testid="lightModeIcon"]');
    // Confirm we're in light theme
    await expect(
      page.locator('[data-testid="bedtimeSharpIcon"]'),
    ).toBeVisible();
  });

  test("toggle from light to dark theme", async ({ page }) => {
    // Click toggle
    await page.click('[data-testid="lightModeIcon"]');
    // Confirm we're in light theme
    await expect(
      page.locator('[data-testid="bedtimeSharpIcon"]'),
    ).toBeVisible();
    // Click toggle
    await page.click('[data-testid="bedtimeSharpIcon"]');
    // Confirm we're in dark theme
    await expect(page.locator('[data-testid="lightModeIcon"]')).toBeVisible();
  });
});
