import { test, expect } from "@playwright/test";

test.describe("Transcription feature", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Electron API so the click handler works in browser tests
    await page.addInitScript(() => {
      (
        window as unknown as { electronAPI: Record<string, unknown> }
      ).electronAPI = {
        transcription: {
          start: async () => {},
          stop: async () => {},
          getTranscript: async () => "",
        },
        getLatestContentByFile: async () => "",
        saveContentToFile: async () => {},
      };
    });

    // Navigate to app
    await page.goto("/");
    // Wait for app to load
    await page.waitForSelector('[data-testid="app-container"]', {
      timeout: 10000,
    });
  });

  test("toggle to recording", async ({ page }) => {
    // Activate recording
    await page.click('[data-testid="red-mic"]');
    // Check if the blue mic can be seen
    await expect(page.locator('[data-testid="blue-mic"]')).toBeVisible();
  });
});
