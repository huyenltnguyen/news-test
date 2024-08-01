import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { expect, describe, it, beforeAll } from "vitest";

import { SITE_MAP, getUrlsFromSitemap } from "../scripts/download-from-sitemap";

const postUrls = await getUrlsFromSitemap(SITE_MAP.posts);

const scrape = async (postUrl: string) => {
  const response = await gotScraping.get({
    url: postUrl,
  });

  return response;
};

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
