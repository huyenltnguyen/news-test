import { readFile } from "fs/promises";
import path from "path";
import "dotenv/config";

import { type PostsMetadataByAuthor, type PostMetadata } from "./types";
import { getUsername } from "./utils";

const __dirname = import.meta.dirname;

export const getExpectedMetadata = async (
  authorUrl: string
): Promise<{ [postUrl: string]: PostMetadata }> => {
  const username = getUsername(authorUrl);

  const metadataJson = await readFile(
    path.resolve(__dirname, `./posts-metadata-by-author/${username}.json`),
    { encoding: "utf8" }
  );
  const metadata: PostsMetadataByAuthor = JSON.parse(metadataJson);

  // The metadata in the file is grouped under a key, which is the author URL.
  // Extract the nested metadata here to make the tests a little easier to read.
  return metadata[authorUrl];
};

// Change this value when testing posts by author
export const AUTHOR =
  process.env.AUTHOR || "https://www.freecodecamp.org/news/author/quincy/";
export const EXPECTED_POSTS_METADATA = await getExpectedMetadata(AUTHOR);
export const EXPECTED_POST_URLS = Object.keys(EXPECTED_POSTS_METADATA);

const randomIndex = (max: number) => Math.floor(Math.random() * max);

export const getRandomPosts = async () => {
  const json = await readFile(
    path.resolve(__dirname, `./data-from-sitemap/posts.json`),
    { encoding: "utf8" }
  );

  const posts = JSON.parse(json);
  const len = posts.length;

  const randomPosts: string[] = [];

  while (randomPosts.length < 20) {
    randomPosts.push(posts[randomIndex(len)]);
  }
  return randomPosts;
};
