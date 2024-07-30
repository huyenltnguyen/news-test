import { expect, describe, it } from "vitest";
import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { readFile } from "fs/promises";
import path from "path";

import { type AllPostsMetadata } from "../types";

const __dirname = import.meta.dirname;

const getPostMetadata = async (postUrl: string) => {
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
    for (const post of POST_URLS) {
      const { metadata: expectedMetadata } =
        ORIGINAL_METADATA[TARGET_AUTHOR][post];
      const { metadata } = await getPostMetadata(post);

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

        expect(elementExists).toBe(true);
      }
    }

    // Sanity check to ensure that at least one assertion was called, since the test involves async operations.
    expect.hasAssertions();
  });
});
