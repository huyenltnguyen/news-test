import { test, expect } from "@playwright/test";

test("Match snapshots", async ({ page }) => {
  await page.goto("https://www.freecodecamp.org/news/create-24-css-projects/");
  await expect(page).toHaveScreenshot({ fullPage: true });
});
