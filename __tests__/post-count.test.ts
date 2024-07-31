import { expect, describe, it } from "vitest";

import { getPostsMetadataByAuthor } from "../utils";
import { AUTHOR, EXPECTED_POST_URLS } from "../test-utils";
import { PostsMetadataByAuthor } from "../types";

const postsMetadataByAuthor = await getPostsMetadataByAuthor({
  authorUrl: AUTHOR,
  shouldWriteFile: false,
});

const postsMetadata = (postsMetadataByAuthor as PostsMetadataByAuthor)[AUTHOR];

describe("Post count", () => {
  it("should match the original post count", () => {
    const postUrls = Object.keys(postsMetadata);

    expect(postUrls).toEqual(EXPECTED_POST_URLS);
  });
});
