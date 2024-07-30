import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { writeFile, readFile } from "fs/promises";
import path from "path";

import { type PostMetadata, type Metadata } from "../types";

const __dirname = import.meta.dirname;

const getPostMetadata = async (
  postUrl: string
): Promise<{ [postUrl: string]: PostMetadata }> => {
  const response = await gotScraping.get({
    url: `https://www.freecodecamp.org/${postUrl}`,
  });

  const html = response.body;

  const $ = cheerio.load(html);

  const metadata: Metadata = $("head")
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

  return { [postUrl]: { metadata, html } };
};

const getPostsMetadataByAuthor = async (authorUrl: string) => {
  const response = await gotScraping.get({
    url: authorUrl,
  });
  const html = response.body;

  const $ = cheerio.load(html);

  // Go to the author page and find their posts
  const postUrls = $("h2.post-card-title a")
    .map((_, el) => $(el).prop("href"))
    .toArray();

  const promises = postUrls.map((url) => getPostMetadata(url));
  const postsMetadata = await Promise.all(promises);
  // `postsMetadata` is an array of objects.
  // We merge the objects into one, with `authorUrl` as the key.
  // return { [authorUrl]: Object.assign({}, ...postsMetadata) };

  const username = authorUrl.match(
    /(?<=https:\/\/www.freecodecamp.org\/news\/author\/).*(?=\/)/
  );
  const data = { [authorUrl]: Object.assign({}, ...postsMetadata) };

  if (username) {
    await writeFile(
      path.resolve(
        __dirname,
        `../posts-metadata-by-author/${username[0]}.json`
      ),
      JSON.stringify(data)
    );
  }
};

/**
 * This function:
 * - Iterates through the `authors` array
 * - Visits each author page and query the author's post URLs
 * - Visits each post URL and pulls all metadata in the `head` tag
 */
const getAllPostsMetadata = async () => {
  const authorsJson = await readFile(
    path.resolve(__dirname, "../data-from-sitemap/authors.json"),
    { encoding: "utf8" }
  );
  const authors: string[] = JSON.parse(authorsJson);

  // Ideally we should parallelize this operation, but running all requests at once causes a timeout error.
  // So to be safe, we query the posts of each author one by one.
  for (const author of authors) {
    await getPostsMetadataByAuthor(author);
  }

  console.log("Get all posts metadata completed.");
};

// --------- Execution ---------
await getAllPostsMetadata();
