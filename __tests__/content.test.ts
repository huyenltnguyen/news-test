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
  it("should match the original heading", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getHeading(html)).toBeTruthy();
      expect(getHeading(html)).toEqual(getHeading(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original author card", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getAuthorCard(html)).toBeTruthy();
      expect(getAuthorCard(html)).toEqual(getAuthorCard(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original author link", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getAuthorLink(html)).toBeTruthy();
      expect(getAuthorLink(html)).toEqual(getAuthorLink(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original content", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getContent(html)).toBeTruthy();
      expect(getContent(html)).toEqual(getContent(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original feature image", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getFeatureImage(html)).toBeTruthy();
      expect(getFeatureImage(html)).toEqual(getFeatureImage(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original tweet button", async () => {
    for (const url of EXPECTED_POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = postsMetadata[url];

      expect(getTweetButton(html)).toBeTruthy();
      expect(getTweetButton(html)).toEqual(getTweetButton(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });
});
