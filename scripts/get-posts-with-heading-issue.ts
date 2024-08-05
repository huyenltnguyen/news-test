import { readFile, writeFile, appendFile } from "fs/promises";
import path from "path";
import { JsonTestResults } from "vitest/reporters";

const __dirname = import.meta.dirname;

const parseTestReport = async () => {
  const json = await readFile(
    path.resolve(__dirname, "../__tests__/report/report.json"),
    { encoding: "utf8" }
  );

  const results: JsonTestResults = JSON.parse(json);

  const failedTests: string[] = results.testResults[0].assertionResults.reduce(
    (acc, curr) => {
      if (curr.status !== "failed") {
        return acc;
      }

      const match = curr.fullName.match(/https.*\//);
      acc.push(match ? match[0] : "");

      return acc;
    },
    [] as string[]
  );

  return failedTests;
};

const parseCustomTestReport = async () => {
  const json = await readFile(
    path.resolve(__dirname, "../__tests__/report/report.json"),
    { encoding: "utf8" }
  );

  const results: Array<{ author: string | null; post: string }> =
    JSON.parse(json);

  return results;
};

const writeFailedTestsToFile = async () => {
  const failedTests = await parseCustomTestReport();

  await writeFile(
    path.resolve(
      __dirname,
      "../__tests__/report/posts-with-heading-issue.json"
    ),
    JSON.stringify(failedTests)
  );

  console.log("Added failed tests to posts-with-heading-issue.json");
};

// --------- Execution ---------
await writeFailedTestsToFile();

// const files = [
//   "../__tests__/report/posts-with-heading-issue-0-1000.json",
//   "../__tests__/report/posts-with-heading-issue-1000-3000.json",
//   "../__tests__/report/posts-with-heading-issue-3000-6000.json",
//   "../__tests__/report/posts-with-heading-issue-6000-9000.json",
//   "../__tests__/report/posts-with-heading-issue-9000-12000.json",
// ];

// const getAllTests = async () => {
//   for (const file of files) {
//     const json = await readFile(path.resolve(__dirname, file), {
//       encoding: "utf8",
//     });
//     const tests = JSON.parse(json);

//     for (const test of tests) {
//       await appendFile(
//         path.resolve(
//           __dirname,
//           "../__tests__/report/posts-with-heading-issue.md"
//         ),
//         `${test}
//   `
//       );
//     }
//   }

//   console.log("Added failed tests to posts-with-heading-issue.md");
// };

// await getAllTests();
