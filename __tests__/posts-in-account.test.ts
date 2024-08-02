import { expect, describe, it, beforeAll } from "vitest";

import { getPostsDataByAuthor } from "../utils";
import { PostsDataByAuthor, PostData } from "../types";
import { getExpectedData, HASHNODE_AUTHOR, GHOST_AUTHOR } from "../test-utils";

// For Hashnode account, find the posts from /news
const getHashnodePostsData = async () => {
  const data = await getPostsDataByAuthor({
    authorUrl: HASHNODE_AUTHOR,
    shouldWriteFile: false,
  });

  return (data as PostsDataByAuthor)[HASHNODE_AUTHOR];
};

// For Ghost account, find the posts from the archive
const getGhostPostsData = () => getExpectedData(GHOST_AUTHOR);

describe("Posts in Hashnode account", () => {
  let ghostPostsData: { [postUrl: string]: PostData };
  let hashnodePostsData: { [postUrl: string]: PostData };

  beforeAll(async () => {
    const results = await Promise.all([
      getGhostPostsData(),
      getHashnodePostsData(),
    ]);

    ghostPostsData = results[0];
    hashnodePostsData = results[1];
  });

  it("should include the posts from the Ghost account", () => {
    const ghostPosts = Object.keys(ghostPostsData);
    const hashnodePosts = Object.keys(hashnodePostsData);

    expect(hashnodePosts.length).toBeGreaterThanOrEqual(ghostPosts.length);
    expect(hashnodePosts).toEqual(expect.arrayContaining(ghostPosts));
  });
});
