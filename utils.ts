import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { writeFile } from "fs/promises";
import path from "path";

import {
  type PostsMetadataByAuthor,
  type PostMetadata,
  type Metadata,
} from "./types";

const __dirname = import.meta.dirname;

export const getUsername = (authorUrl: string) => {
  // Rename the username so that we can save the data into separate files.
  if (authorUrl === "https://www.freecodecamp.org/news/author/ihechikara/") {
    return "ihechikara-ghost";
  }

  if (authorUrl === "https://www.freecodecamp.org/news/author/Ihechikara/") {
    return "ihechikara-hashnode";
  }

  const match = authorUrl.match(
    /(?<=https:\/\/www.freecodecamp.org\/news\/author\/).*(?=\/)/
  );

  return match ? match[0] : "";
};

export const getPostMetadata = async (
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
    .map((child) => ({
      tagName: child.name,
      attributes: child.attribs,
      content: $(child).text(),
    }));

  return { [postUrl]: { metadata, html } };
};

export const getPostsMetadataByAuthor = async ({
  authorUrl,
  shouldWriteFile,
}: {
  authorUrl: string;
  shouldWriteFile: boolean;
}): Promise<undefined | PostsMetadataByAuthor> => {
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

  const username = getUsername(authorUrl);

  if (!username) {
    throw new Error("Failed to parse username");
  }

  // `postsMetadata` is an array of objects.
  // We merge the objects into one, with `authorUrl` as the key.
  const data = { [authorUrl]: Object.assign({}, ...postsMetadata) };

  if (shouldWriteFile) {
    await writeFile(
      path.resolve(__dirname, `./posts-metadata-by-author/${username}.json`),
      JSON.stringify(data)
    );

    console.log(`Author posts downloaded. Author URL: ${authorUrl}`);
    return;
  }

  return data;
};
