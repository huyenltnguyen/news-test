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
    for (const url of POST_URLS) {
      console.log("URL:", url);

      const { metadata: expectedMetadata } = EXPECTED_POSTS_METADATA[url];
      const { metadata } = await getPostMetadata(url);

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
