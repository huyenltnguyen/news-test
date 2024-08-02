import { readFile } from "fs/promises";
import path from "path";
import "dotenv/config";

import { type PostsDataByAuthor, type PostData } from "./types";
import { getPostsDataByAuthor, getUsername } from "./utils";

const __dirname = import.meta.dirname;

export const GHOST_AUTHOR =
  process.env.GHOST_AUTHOR ||
  "https://www.freecodecamp.org/news/author/quincylarson";
export const HASHNODE_AUTHOR =
  process.env.HASHNODE_AUTHOR ||
  "https://www.freecodecamp.org/news/author/quincy";

// For Ghost account, find the posts from the archive
const getExpectedData = async (
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

// For Hashnode account, find the posts from /news
const getHashnodePostsData = async () => {
  const data = await getPostsDataByAuthor({
    authorUrl: HASHNODE_AUTHOR,
    shouldWriteFile: false,
  });

  return (data as PostsDataByAuthor)[HASHNODE_AUTHOR];
};

// Move these into a function so that unrelated tests don't need to `await` unnecessarily
export const getTestData = async () => {
  const [HASHNODE_POSTS_DATA, EXPECTED_POSTS_DATA] = await Promise.all([
    getHashnodePostsData(),
    getExpectedData(GHOST_AUTHOR),
  ]);

  const EXPECTED_POST_URLS = Object.keys(EXPECTED_POSTS_DATA);

  return { HASHNODE_POSTS_DATA, EXPECTED_POSTS_DATA, EXPECTED_POST_URLS };
};

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
