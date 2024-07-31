import { expect, describe, it } from "vitest";

import { getPostsMetadataByAuthor } from "../utils";
import {
  AUTHOR,
  EXPECTED_POSTS_METADATA,
  EXPECTED_POST_URLS,
} from "./test-utils";
import { PostsMetadataByAuthor } from "../types";

const postsMetadataByAuthor = await getPostsMetadataByAuthor({
  authorUrl: AUTHOR,
  shouldWriteFile: false,
});

const postsMetadata = (postsMetadataByAuthor as PostsMetadataByAuthor)[AUTHOR];

// ------------------------------
// Assertion helpers
// ------------------------------
const areObjectsEqual = (obj1, obj2) => {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  const keys = Object.keys(obj1);

  for (const key of keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

describe("Posts metadata", () => {
  it("should have correct metadata", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { metadata: expectedMetadata } = EXPECTED_POSTS_METADATA[url];
      const { metadata } = postsMetadata[url];

      expect(metadata.length).toEqual(expectedMetadata.length);

      // Check if the elements exist and match the ones in the original object
      for (const element of metadata) {
        const elementExists = expectedMetadata.some(
          ({
            tagName: expectedTagName,
            attributes: expectedAttributes,
            scriptContent: expectedScriptContent,
          }) => {
            if (expectedTagName !== element.tagName) {
              return false;
            }

            return (
              areObjectsEqual(expectedAttributes, element.attributes) &&
              expectedScriptContent === element.scriptContent
            );
          }
        );

        // This is for debugging
        if (!elementExists) {
          console.log("element:", element);
        }

        expect(elementExists).toBe(true);
      }
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });
});
