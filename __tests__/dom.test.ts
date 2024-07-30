import { expect, describe, it } from "vitest";
import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";

import { type AllPostsMetadata, type PostMetadata } from "../types";

const __dirname = import.meta.dirname;

const getPostMetadata = async (postUrl: string): Promise<PostMetadata> => {
  const response = await gotScraping.get({
    url: `https://www.freecodecamp.org/${postUrl}`,
  });

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

const getOriginalPostsMetadata = async () => {
  const metadataJson = await readFile(
    path.resolve(__dirname, "../data/all-posts-metadata.json"),
    { encoding: "utf8" }
  );
  return JSON.parse(metadataJson);
};

const ORIGINAL_METADATA: AllPostsMetadata = await getOriginalPostsMetadata();
// Change this value when testing posts by author
const TARGET_AUTHOR = "https://www.freecodecamp.org/news/author/_staticvoid/";
const POST_URLS = Object.keys(ORIGINAL_METADATA[TARGET_AUTHOR]);

describe("Posts DOM", () => {
  it("should match the original DOM", async () => {
    for (const post of POST_URLS) {
      const { html: expectedHtml } = ORIGINAL_METADATA[TARGET_AUTHOR][post];
      const { html } = await getPostMetadata(post);
      const cloudflareAnalytics =
        /<script defer src=\"https\:\/\/static.cloudflareinsights.com\/beacon.min.js.*<\/script>/;

      expect(html.replace(cloudflareAnalytics, "")).toEqual(
        expectedHtml.replace(cloudflareAnalytics, "")
      );
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.assertions(POST_URLS.length);
  });
});
