import { expect, describe, it } from "vitest";

import { getPostsMetadataByAuthor } from "../utils";
import {
  AUTHOR,
  EXPECTED_POSTS_METADATA,
  EXPECTED_POST_URLS,
} from "../test-utils";
import { PostsMetadataByAuthor } from "../types";

const postsMetadataByAuthor = await getPostsMetadataByAuthor({
  authorUrl: AUTHOR,
  shouldWriteFile: false,
});

const postsMetadata = (postsMetadataByAuthor as PostsMetadataByAuthor)[AUTHOR];

// ------------------------------
// Assertion helpers
// ------------------------------
const getHeading = (html: string) => {
  const match = html.match(/<h1.*data-test-label="post-full-title">.*<\/h1>/);
  return match ? match[0] : null;
};

const getAuthorCard = (html: string) => {
  const match = html.match(
    /<section.*data-test-label="author-card">([\s\S]*?)<\/section>/
  );
  return match ? match[0] : null;
};

const getAuthorLink = (html: string) => {
  const match = html.match(
    /<a.*data-test-label="profile-link".*>([\s\S]*?)<\/a>/
  );
  return match ? match[0] : null;
};

const getContent = (html: string) => {
  const match = html.match(
    /<section.*data-test-label="post-content">([\s\S]*?)<\/section>/
  );
  return match ? match[0] : null;
};

const getFeatureImage = (html: string) => {
  const match = html.match('<img.*data-test-label="feature-image".*?>');
  return match ? match[0] : null;
};

const getTweetButton = (html: string) => {
  const match = html.match(
    '<button.*data-test-label="tweet-button".*>.*?</button>'
  );
  return match ? match[0] : null;
};

// This test is probably flaky / can have false negatives since it compares strings
// rather than querying the elements and looking for their attributes.
describe("Posts content", () => {
  it("should have the correct heading", () => {
    for (const url of EXPECTED_POST_URLS) {
      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getHeading(html)).toBeTruthy();
      expect(getHeading(html)).toEqual(getHeading(expectedHtml));
    }
  });

  it("should have the correct author card", () => {
    for (const url of EXPECTED_POST_URLS) {
      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getAuthorCard(html)).toBeTruthy();
      expect(getAuthorCard(html)).toEqual(getAuthorCard(expectedHtml));
    }
  });

  it("should have the correct author link", () => {
    for (const url of EXPECTED_POST_URLS) {
      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getAuthorLink(html)).toBeTruthy();
      expect(getAuthorLink(html)).toEqual(getAuthorLink(expectedHtml));
    }
  });

  // Skipping this one as it can cause the test flaky.
  // It is because of the `min-width` attribute set to the posts' images,
  // which can return different width values.
  it.skip("should have the correct content", () => {
    for (const url of EXPECTED_POST_URLS) {
      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getContent(html)).toBeTruthy();
      expect(getContent(html)).toEqual(getContent(expectedHtml));
    }
  });

  it("should have the correct feature image", () => {
    for (const url of EXPECTED_POST_URLS) {
      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getFeatureImage(html)).toBeTruthy();
      expect(getFeatureImage(html)).toEqual(getFeatureImage(expectedHtml));
    }
  });

  it("should have the correct tweet button", () => {
    for (const url of EXPECTED_POST_URLS) {
      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getTweetButton(html)).toBeTruthy();
      expect(getTweetButton(html)).toEqual(getTweetButton(expectedHtml));
    }
  });
});
