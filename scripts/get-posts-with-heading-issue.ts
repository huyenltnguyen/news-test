import { readFile, writeFile, appendFile, readdir, rm } from "fs/promises";
import path from "path";
import { type ReportResult } from "../types";
import { existsSync } from "fs";

const __dirname = import.meta.dirname;
const REPORT_DIR = path.resolve(__dirname, "../__tests__/report");

const getTestsByAuthor = async () => {
  const files = await readdir(REPORT_DIR);
  const jsonFiles = files.filter(
    (file) =>
      file.startsWith("posts-with-heading-issue") && file.endsWith("json")
  );
  const allTests: Array<ReportResult> = [];

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

  console.log("🚀 ~ testCount ~ testCount:", testCount);

  return testsByAuthor;
};

const writeToFile = async () => {
  const mdFile = path.resolve(
    __dirname,
    `${REPORT_DIR}/posts-with-heading-issue.md`
  );
  const authors = await getTestsByAuthor();

  if (existsSync(mdFile)) {
    await rm(mdFile);
    await writeFile(mdFile, "");
  }

  for (const author in authors) {
    const posts = authors[author].map((post) => `${post}`).join("\n");

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
