import { test, expect } from "@playwright/test";

test.describe("Markdown Editor", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Electron API so the click handler works in browser tests
    await page.addInitScript(() => {
      (
        window as unknown as { electronAPI: Record<string, unknown> }
      ).electronAPI = {
        saveFile: async () => {},
        saveContentToFile: async () => {},
        getLatestContentByFile: async () => "",
        getFiles: async () => [],
        deleteFile: async () => {},
      };
    });

    // Navigate to app
    await page.goto("/");
    // Wait for app to load
    await page.waitForSelector('[data-testid="app-container"]', {
      timeout: 10000,
    });
  });

  test("should be able to create a new note and type in the editor", async ({
    page,
  }) => {
    // Step 1: Create a new note
    await page.click('[data-testid="add-file-icon"]');

    // Wait for the popover to appear
    await page.waitForSelector('[data-testid="add-file-text"]', {
      timeout: 5000,
    });

    // Type the note name
    await page.fill('[data-testid="add-file-text"]', "Test Note 1");

    // Press Enter to create the note
    await page.press('[data-testid="add-file-text"]', "Enter");

    // Step 2: Wait for the editor to be ready
    await page.waitForSelector('[data-testid="editor"]', { timeout: 5000 });

    // Wait for the popover to close
    await page.waitForSelector('[data-testid="add-file-text"]', {
      state: "hidden",
      timeout: 5000,
    });

    // Step 3: Focus and type in the editor
    const editor = page.locator('[data-testid="editor"]');
    const proseMirror = editor.locator(".ProseMirror");

    // Click to focus the editor
    await proseMirror.click();

    // Clear any existing content and type new content
    await page.keyboard.press("Control+a"); // Select all
    await page.keyboard.press("Delete"); // Clear
    await page.keyboard.type("Hello, this is a test note!");

    // Step 4: Verify the content was typed
    await expect(proseMirror).toContainText("Hello, this is a test note!");
  });

  test("should be able to edit existing content in the editor", async ({
    page,
  }) => {
    // Step 1: Create a new note first
    await page.click('[data-testid="add-file-icon"]');
    await page.waitForSelector('[data-testid="add-file-text"]', {
      timeout: 5000,
    });
    await page.fill('[data-testid="add-file-text"]', "Editable Note");
    await page.press('[data-testid="add-file-text"]', "Enter");

    // Wait for editor to be ready
    await page.waitForSelector('[data-testid="editor"]', { timeout: 5000 });
    await page.waitForSelector('[data-testid="add-file-text"]', {
      state: "hidden",
      timeout: 5000,
    });

    // Step 2: Type initial content
    const proseMirror = page.locator('[data-testid="editor"] .ProseMirror');
    await proseMirror.click();
    await page.keyboard.type("Initial content");

    // Verify initial content
    await expect(proseMirror).toContainText("Initial content");

    // Step 3: Edit the content
    await page.keyboard.press("Home"); // Go to beginning
    await page.keyboard.type("Updated: ");

    // Verify edited content
    await expect(proseMirror).toContainText("Updated: Initial content");
  });
});
