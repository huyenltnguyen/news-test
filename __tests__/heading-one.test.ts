import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { expect, describe, it, beforeAll } from "vitest";

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

  return urls;
};

const postUrls = await getPostUrls();

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
