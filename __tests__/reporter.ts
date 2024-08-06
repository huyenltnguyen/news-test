import { File } from "vitest";
import { JsonReporter } from "vitest/reporters";
import * as cheerio from "cheerio";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

import { getPostData } from "../utils";
import { existsSync } from "fs";

interface Result {
  post: string;
  author: string | null;
}

const __dirname = import.meta.dirname;

// This reporter is used only for the heading one test
// Implementation reference: https://github.com/dotnetautor/vitest-bamboo-reporter/blob/main/src/bamboo-reporter.ts
export default class MyDefaultReporter extends JsonReporter {
  async onFinished(files?: File[]): Promise<void> {
    const results: Array<Result> = [];

    const file = files?.find(({ name }) => name.includes("heading-one"));

    if (!file) {
      throw new Error("Test file cannot be found");
    }

    // Find the name of the tests that failed, extract the post URL from the test name
    const postUrls = file.tasks.reduce((acc, curr) => {
      if (curr.result?.state === "fail") {
        const url = curr.name.match(/https.*?(?=\s)/);
        acc.push(url ? url[0] : "");
      }

      return acc;
    }, [] as string[]);

    // Go to each post and find the author slug
    for (const url of postUrls) {
      const response = await getPostData(url);

      const $ = cheerio.load(response[url].html);
      const author = $("a[data-test-label='profile-link']");
      const authorPath = author.attr("href");

      results.push({
        post: url,
        author: authorPath
          ? `https://www.freecodecamp.org/${authorPath}`
          : null,
      });
    }

    if (!existsSync(path.resolve(__dirname, "./report"))) {
      await mkdir(path.resolve(__dirname, "./report"));
    }

    await writeFile(
      path.resolve(__dirname, "./report/report.json"),
      JSON.stringify(results)
    );

    this.ctx.logger.log("Number of failed tests:", results.length);
    this.ctx.logger.log("Test results", results);
  }
}
