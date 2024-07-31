import { test, expect } from "@playwright/test";
import { readFile } from "fs/promises";
import path from "path";

const __dirname = import.meta.dirname;

const randomIndex = (max: number) => Math.floor(Math.random() * max);

const getRandomPosts = async () => {
  const json = await readFile(
    path.resolve(__dirname, `../data-from-sitemap/posts.json`),
    { encoding: "utf8" }
  );

  const posts = JSON.parse(json);
  const len = posts.length;

  const randomPosts: string[] = [];

  while (randomPosts.length < 20) {
    randomPosts.push(posts[randomIndex(len)]);
  }
  return randomPosts;
};

const POST_URLS = await getRandomPosts();

// Keeping this test in case we need a mechanism to query the DOM with ease.
// Note that Playwright tests run very slowly compared to the Vitest ones.
test.describe("Posts content", () => {
  test("should display the content correctly", async ({ page, isMobile }) => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      await page.goto(url);

      await expect(
        page
          .getByRole("heading", { level: 1 })
          // Some articles have multiple `h1`s, so we are looking for the one with a test label.
          // (The multiple h1s issue can be addressed separately)
          .and(page.getByTestId("post-full-title"))
      ).toBeVisible();

      await expect(page.getByTestId("post-content")).toBeVisible();
      await expect(
        page.getByRole("button").and(page.getByTestId("tweet-button"))
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Get Started" })
      ).toBeVisible();

      const authorCard = page.getByTestId("author-card");
      const hasAuthorCard = !!(await authorCard.all()).length;

      if (hasAuthorCard) {
        await expect(page.getByTestId("author-card")).toHaveCount(2);
        await expect(
          page.getByRole("img").and(page.getByTestId("profile-image"))
        ).toHaveCount(2);

        const authorLink = page
          .getByRole("link")
          .and(page.getByTestId("profile-link"));
        await expect(authorLink).toHaveCount(2);
      }

      if (!isMobile) {
        await expect(
          page.getByRole("img").and(page.getByTestId("feature-image"))
        ).toBeVisible();
      }
    }
  });
});
