import { test, expect } from "@playwright/test";

test.describe("Chat Interface", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app
    await page.goto("/");
    // Wait for app to load
    await page.waitForSelector('[data-testid="app-container"]', {
      timeout: 10000,
    });
  });

  test("This should open the AI chat interface", async ({ page }) => {
    // Click the AI chat bot button on the right tool bar
    await page.click('[data-testid="chat-button"]');
    // Verify that the chat is visible to user
    await expect(page.locator('[data-testid="chat-container"]')).toBeVisible();
  });

  test("If the chatbot response to a prompt by user", async ({ page }) => {
    // Opens the AI chatbot
    await page.click('[data-testid="chat-button"]');
    // Type in message
    const testMessage = "Hi, what is 1 + 1?";
    await page.locator('[data-testid="chat-textfield"]').type(testMessage);
    // Send the message
    await expect(
      page.locator('[data-testid="chat-send-button"]'),
    ).toBeEnabled();
    await page.click('[data-testid="chat-send-button"]');
    // Verify that user message appears in chat
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();
    // Wait for the AI to reply (10 seconds), and check if there is any new response
    await expect(page.locator(".message-content").nth(-1)).toBeVisible({
      timeout: 10000,
    });
  });

  test("chatbot deletes context, and start fresh after closing it", async ({
    page,
  }) => {
    // Opens the AI chatbot
    await page.click('[data-testid="chat-button"]');
    // Type in message
    const testMessage = "Hi, what is 1 + 1?";
    await page.locator('[data-testid="chat-textfield"]').type(testMessage);
    // Send the message
    await expect(
      page.locator('[data-testid="chat-send-button"]'),
    ).toBeEnabled();
    await expect(page.locator(`text=${testMessage}`)).toBeVisible();
    // Wait for the AI to reply (10 seconds)
    await page.waitForTimeout(10000);
    // Close the AI chat interface
    await page.click('[data-testid="chat-button"]');
    // Reopens the AI chat interface, "initial message should appear: Hello! I'm your AI assistant..."
    await page.click('[data-testid="chat-button"]');
    await expect(page.locator(".message-content")).toHaveText(
      "Hello! I'm your AI assistant. How can I help you today?",
    );
  });
});
