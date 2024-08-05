import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { expect, describe, it, beforeAll } from "vitest";
import "dotenv/config";

const { POST_LIST_START_IDX, POST_LIST_END_IDX } = process.env;

const scrape = async (postUrl: string) => {
  const response = await gotScraping.get({
    url: postUrl,
  });

  return response;
};

const getPostUrls = async () => {
  const response = await gotScraping.get({
    url: "https://www.freecodecamp.org/news/sitemap-posts.xml",
  });
  const xml = response.body;

  const $ = cheerio.load(xml);

  // .map() returns a jQuery object,
  // we need to use `.toArray()` to convert the value to an array.
  const urls = $("url loc")
    .map((_, el) => $(el).text())
    .toArray();

  // Split this array into multiple batches as the amount of test cases would overwhelm Vitest.
  const start = POST_LIST_START_IDX ? Number(POST_LIST_START_IDX) : 0;
  const end = POST_LIST_END_IDX ? Number(POST_LIST_END_IDX) : 100;
  return urls.slice(start, end);
};

const postUrls = await getPostUrls();
// const postUrls = [
//   "https://www.freecodecamp.org/news/introduction-to-linux/",
//   "https://www.freecodecamp.org/news/how-two-friends-changed-careers-learned-to-code-and-built-a-startup-e40c0b060de8/",
//   "https://www.freecodecamp.org/news/how-to-build-an-event-app-with-node-js/",
// ];

describe.each(postUrls)("%s - Post heading one", (url) => {
  let response;
  let html;
  let $: ReturnType<typeof cheerio.load>;

  beforeAll(async () => {
    response = await scrape(url);

    html = response.body;
    $ = cheerio.load(html);
  });

  it("should have a single h1", () => {
    const h1 = $("h1");

    expect(h1).toBeTruthy();
    expect(h1.length).toEqual(1);
  });
});
