import { readFile } from "fs/promises";
import path from "path";
import "dotenv/config";

import { type PostsDataByAuthor, type PostData } from "./types";
import { getUsername } from "./utils";

const __dirname = import.meta.dirname;

export const getExpectedData = async (
  authorUrl: string
): Promise<{ [postUrl: string]: PostData }> => {
  const username = getUsername(authorUrl);

  const json = await readFile(
    path.resolve(__dirname, `./posts-data-by-author/${username}.json`),
    { encoding: "utf8" }
  );
  const data: PostsDataByAuthor = JSON.parse(json);

  // The data in the file is grouped under a key, which is the author URL.
  // Extract the nested data here to make the tests a little easier to read.
  return data[authorUrl];
};

// Change this value when testing posts by author
export const AUTHOR =
  process.env.AUTHOR || "https://www.freecodecamp.org/news/author/quincy/";
export const EXPECTED_POSTS_DATA = await getExpectedData(AUTHOR);
export const EXPECTED_POST_URLS = Object.keys(EXPECTED_POSTS_DATA);

const randomIndex = (max: number) => Math.floor(Math.random() * max);

export const getRandomPosts = async (postCount: number) => {
  const json = await readFile(
    path.resolve(__dirname, `./data-from-sitemap/posts.json`),
    { encoding: "utf8" }
  );

  const posts = JSON.parse(json);
  const len = posts.length;

  const randomPosts: string[] = [];

  while (randomPosts.length < postCount) {
    randomPosts.push(posts[randomIndex(len)]);
  }
  return randomPosts;
};
