import { writeFile, readFile, readdir } from "fs/promises";
import path from "path";

import { type AllPostsMetadata } from "../types";

const __dirname = import.meta.dirname;

const createSample = async () => {
  const metadataJson = await readFile(
    path.resolve(__dirname, "../data/all-posts-metadata.json"),
    { encoding: "utf8" }
  );
  const metadata = JSON.parse(metadataJson);

  await writeFile(
    path.resolve(__dirname, "../data/sample.json"),
    JSON.stringify({
      "https://www.freecodecamp.org/news/author/_staticvoid/":
        metadata["https://www.freecodecamp.org/news/author/_staticvoid/"],
    })
  );

  console.log("Sample file created");
};

// The `all-posts-metadata.json` file is too large for VS Code to handle.
// Run this function to confirm the file contains the expected data.
const confirmAllAuthorsWereDownloaded = async () => {
  const authorsJson = await readFile(
    path.resolve(__dirname, "../data-from-sitemap/authors.json"),
    { encoding: "utf8" }
  );
  const authors: string[] = JSON.parse(authorsJson);

  const authorFiles = await readdir(
    path.resolve(__dirname, "../posts-metadata-by-author")
  );

  console.log(`
    authors from sitenmap: ${authors.length}
    author files: ${authorFiles.length}
  `);
};

await confirmAllAuthorsWereDownloaded();
// await createSample();
