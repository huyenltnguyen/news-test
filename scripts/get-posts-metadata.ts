import { readFile } from "fs/promises";
import path from "path";

import { getPostsMetadataByAuthor } from "../utils";

const __dirname = import.meta.dirname;

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
    await getPostsMetadataByAuthor({
      authorUrl: author,
      shouldWriteFile: true,
    });
  }

  console.log("All posts metadata downloaded.");
};

// --------- Execution ---------
await getAllPostsMetadata();

// await getPostsMetadataByAuthor({
//   authorUrl: "https://www.freecodecamp.org/news/author/kris/",
//   shouldWriteFile: true,
// });
