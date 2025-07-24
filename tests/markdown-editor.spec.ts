import { test, expect } from "@playwright/test";

test.describe("Markdown Editor", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto("/");
    // Wait for page to load with a shorter timeout
    await page.waitForLoadState("domcontentloaded");
    // Give the app a moment to initialize
    await page.waitForTimeout(2000);
  });

  test("should be able to type in the markdown editor", async ({ page }) => {
    // Create a new note
    await page.click('[data-testid="addFileIcon"]');
    await page.keyboard.type("Test Note 1");
    await page.press('[data-testid="addFileText"]', "Enter");
    // Wait for the dialog to close and editor to be ready
    await page.waitForSelector('[data-testid="editor"]', { timeout: 5000 });
    // Wait for any modal/popover to disappear
    await page.waitForTimeout(1000);
    // Try to close any open modal by pressing Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    // Try clicking on the ProseMirror content area directly
    const proseMirror = page.locator('[data-testid="editor"] .ProseMirror');
    await proseMirror.click();
    // Type content using keyboard
    await page.keyboard.type("content 123");
    // Wait a bit for the content to be processed
    await page.waitForTimeout(500);
    // Verify that there is content written in the editor
    await expect(proseMirror).toContainText("content 123");
  });
});
