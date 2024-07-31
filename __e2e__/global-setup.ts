import type { FullConfig } from "@playwright/test";
import { getRandomPosts } from "../test-utils";

async function globalSetup(config: FullConfig) {
  // Generate the list globally as Playwright doesn't allow randomization during test execution.
  // See https://github.com/microsoft/playwright/issues/28987
  const RANDOM_POSTS = await getRandomPosts();
  process.env.RANDOM_POSTS = JSON.stringify(RANDOM_POSTS);
}

export default globalSetup;
