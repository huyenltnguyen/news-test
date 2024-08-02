import { readFile, readdir } from "fs/promises";
import path from "path";

const __dirname = import.meta.dirname;

const confirmAllAuthorsWereDownloaded = async () => {
  const authorsJson = await readFile(
    path.resolve(__dirname, "../data-from-sitemap/authors.json"),
    { encoding: "utf8" }
  );
  const authors: string[] = JSON.parse(authorsJson);

  const authorFiles = await readdir(
    path.resolve(__dirname, "../posts-data-by-author")
  );

  console.log(`
    authors from sitemap: ${authors.length}
    author files: ${authorFiles.length}
  `);
};

await confirmAllAuthorsWereDownloaded();
