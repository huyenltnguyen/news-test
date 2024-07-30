import { expect, describe, it } from "vitest";
import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";

import { type PostsMetadataByAuthor, type PostMetadata } from "../types";

const __dirname = import.meta.dirname;

const getPostMetadata = async (postUrl: string) => {
  const response = await gotScraping.get({
    url: `https://www.freecodecamp.org/${postUrl}`,
  });

  if (!response.ok || response.statusCode !== 200) {
    throw new Error(`Failed to fetch ${postUrl}`);
  }

  const html = response.body;

  const $ = cheerio.load(html);

  const metadata = $("head")
    .children()
    .toArray()
    .map((child) => {
      const scriptContent = child.name === "script" ? $(child).text() : null;

      return {
        tagName: child.name,
        attributes: child.attribs,
        ...(scriptContent && { scriptContent }),
      };
    });

  return { metadata, html };
};

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
const EXPECTED_POSTS_METADATA = await getExpectedMetadata(AUTHOR);
const POST_URLS = Object.keys(EXPECTED_POSTS_METADATA);

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

// ------------------------------
// Actual tests
// ------------------------------
// This test is probably flaky / can have false negatives since it compares strings
// rather than querying the elements and looking for their attributes.
describe("Posts content", () => {
  it("should match the original heading", async () => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = await getPostMetadata(url);

      expect(getHeading(html)).toBeTruthy();
      expect(getHeading(html)).toEqual(getHeading(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original author card", async () => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = await getPostMetadata(url);

      expect(getAuthorCard(html)).toBeTruthy();
      expect(getAuthorCard(html)).toEqual(getAuthorCard(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original author link", async () => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = await getPostMetadata(url);

      expect(getAuthorLink(html)).toBeTruthy();
      expect(getAuthorLink(html)).toEqual(getAuthorLink(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original content", async () => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = await getPostMetadata(url);

      expect(getContent(html)).toBeTruthy();
      expect(getContent(html)).toEqual(getContent(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original feature image", async () => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = await getPostMetadata(url);

      expect(getFeatureImage(html)).toBeTruthy();
      expect(getFeatureImage(html)).toEqual(getFeatureImage(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });

  it("should match the original tweet button", async () => {
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
      const { html } = await getPostMetadata(url);

      expect(getTweetButton(html)).toBeTruthy();
      expect(getTweetButton(html)).toEqual(getTweetButton(expectedHtml));
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });
});
