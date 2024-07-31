import { test, expect } from "@playwright/test";
import { readFile } from "fs/promises";
import path from "path";

import { PostMetadata, type PostsMetadataByAuthor } from "../types";

const __dirname = import.meta.dirname;

const getExpectedMetadata = async (
  author: string
): Promise<Record<string, PostMetadata>> => {
  const username = author.match(
    /(?<=https:\/\/www.freecodecamp.org\/news\/author\/).*(?=\/)/
  );

  const metadataJson = await readFile(
    path.resolve(__dirname, `../posts-metadata-by-author/${username}.json`),
    { encoding: "utf8" }
  );

  const metadata: PostsMetadataByAuthor = JSON.parse(metadataJson);

  // The metadata in the file is grouped under a key, which is the author URL.
  // Extract the nested metadata here to make the tests a little easier to read.
  return metadata[author];
};

// Change this value when testing posts by author
const AUTHOR = "https://www.freecodecamp.org/news/author/kris/";
const EXPECTED_METADATA = await getExpectedMetadata(AUTHOR);
const POST_URLS = Object.keys(EXPECTED_METADATA);

// Keeping this test in case we need a mechanism to query the DOM with ease.
// Note that Playwright tests run very slowly compared to the Vitest ones.
test.describe.skip("Posts content", () => {
  test("should display the content correctly", async ({ page }) => {
    for (const url of POST_URLS) {
      // const { html: expectedHtml } = EXPECTED_METADATA[url];

      await page.goto(url);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByTestId("author-card")).toHaveCount(2);

      const authorLink = page
        .getByRole("link")
        .and(page.getByTestId("profile-link"));
      await expect(authorLink).toHaveCount(2);
      await expect(authorLink.first()).toHaveAttribute("href", AUTHOR);
      await expect(authorLink.last()).toHaveAttribute("href", AUTHOR);

      await expect(
        page.getByRole("img").and(page.getByTestId("feature-image"))
      ).toBeVisible();
      await expect(page.getByTestId("post-content")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Say Thanks" })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Get Started", exact: true })
      ).toBeVisible();
    }
  });
});
