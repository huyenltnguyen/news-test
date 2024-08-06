import { readFile, writeFile, appendFile, readdir, rm } from "fs/promises";
import path from "path";
import { type ReportResult } from "../types";
import { existsSync } from "fs";

const __dirname = import.meta.dirname;
const REPORT_DIR = path.resolve(__dirname, "../__tests__/report");

const getTestsByAuthor = async (): Promise<Record<string, ReportResult[]>> => {
  const files = await readdir(REPORT_DIR);
  const jsonFiles = files.filter(
    (file) =>
      file.startsWith("posts-with-heading-issue") && file.endsWith("json")
  );
  const allTests: ReportResult[] = [];

  for (const jsonFile of jsonFiles) {
    const json = await readFile(
      path.resolve(__dirname, `${REPORT_DIR}/${jsonFile}`),
      {
        encoding: "utf8",
      }
    );
    const tests = JSON.parse(json);

    allTests.push(...tests);
  }

  const testsByAuthor = allTests.reduce((acc, curr) => {
    const post = curr.post;
    const author = curr.author || "no-author-slug";

    if (!acc[author]) {
      acc[author] = [post];
    } else {
      acc[author].push(post);
    }

    return acc;
  }, {});

  const testCount = Object.keys(testsByAuthor).reduce((acc, curr) => {
    const count = testsByAuthor[curr].length;
    acc += count;
    return acc;
  }, 0);

  console.log("Test count:", testCount);

  return testsByAuthor;
};

const writeToFile = async () => {
  const mdFile = path.resolve(
    __dirname,
    `${REPORT_DIR}/posts-with-heading-issue.md`
  );
  const testsByAuthor = await getTestsByAuthor();

  // Sort author username alphabetically
  const authors = Object.keys(testsByAuthor).sort((author1, author2) => {
    return author1.localeCompare(author2);
  });

  if (existsSync(mdFile)) {
    await rm(mdFile);
    await writeFile(mdFile, "");
  }

  for (const author of authors) {
    const posts = testsByAuthor[author].map((post) => `${post}`).join("\n");

    await appendFile(
      mdFile,
      `${author}
${posts}

`
    );
  }

  console.log("Added failed tests to posts-with-heading-issue.md");
};

// --------- Execution ---------
await writeToFile();
