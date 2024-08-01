import { expect, describe, it } from "vitest";

import { getPostsDataByAuthor } from "../utils";
import { AUTHOR, EXPECTED_POST_URLS } from "../test-utils";
import { PostsDataByAuthor } from "../types";

const postsMetadataByAuthor = await getPostsDataByAuthor({
  authorUrl: AUTHOR,
  shouldWriteFile: false,
});

const postsMetadata = (postsMetadataByAuthor as PostsDataByAuthor)[AUTHOR];

describe("Post count", () => {
  it("should match the original post count", () => {
    const postUrls = Object.keys(postsMetadata);

    expect(postUrls).toEqual(EXPECTED_POST_URLS);
  });
});
