import { readFile, writeFile } from "fs/promises";
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

const writeFailedTestsToFile = async () => {
  const failedTests = await parseTestReport();

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
