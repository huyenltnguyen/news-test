import { test, expect } from "@playwright/test";

test.describe("Posts content", () => {
  const postUrls = JSON.parse(process.env.RANDOM_POSTS);

  postUrls.forEach((url) => {
    test(`${url} - should display the content correctly`, async ({
      page,
      isMobile,
    }) => {
      await page.goto(url);

      // Post content
      await expect(
        page
          .getByRole("heading", { level: 1 })
          // Some articles have multiple `h1`s, so we are looking for the one with a test label.
          // (The multiple h1s issue can be addressed separately)
          .and(page.getByTestId("post-full-title"))
      ).toBeVisible();

      await expect(page.getByTestId("post-content")).toBeVisible();

      if (!isMobile) {
        await expect(
          page.getByRole("img").and(page.getByTestId("feature-image"))
        ).toBeVisible();
      }

      // Author card
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

      // Social CTA
      const socialCta = page.getByTestId("social-row-cta");
      await expect(
        socialCta.getByRole("button").and(socialCta.getByTestId("tweet-button"))
      ).toBeVisible();

      // Learn CTA
      const learnCta = page.getByTestId("learn-cta-row");
      await expect(
        learnCta.getByRole("link", { name: "Get Started" })
      ).toBeVisible();
    });
  });
});
