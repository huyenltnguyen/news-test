import { expect, describe, it } from "vitest";

import { getTestData } from "../test-utils";

const { HASHNODE_POSTS_DATA, EXPECTED_POSTS_DATA } = await getTestData();

describe("Hashnode post count", () => {
  it("should include the posts from the Ghost account", () => {
    const ghostPosts = Object.keys(EXPECTED_POSTS_DATA);
    const hashnodePosts = Object.keys(HASHNODE_POSTS_DATA);

    expect(hashnodePosts.length).toBeGreaterThanOrEqual(ghostPosts.length);
    expect(hashnodePosts).toEqual(expect.arrayContaining(ghostPosts));
  });
});
