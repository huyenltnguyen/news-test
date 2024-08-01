import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { writeFile } from "fs/promises";
import path from "path";

const __dirname = import.meta.dirname;

export const SITE_MAP = {
  pages: "https://www.freecodecamp.org/news/sitemap-pages.xml",
  posts: "https://www.freecodecamp.org/news/sitemap-posts.xml",
  authors: "https://www.freecodecamp.org/news/sitemap-authors.xml",
  tags: "https://www.freecodecamp.org/news/sitemap-tags.xml",
};

export const getUrlsFromSitemap = async (sitemapLink: string) => {
  const response = await gotScraping.get({
    url: sitemapLink,
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

const downloadUrlsFromSitemap = async () => {
  for (const item in SITE_MAP) {
    const urls = await getUrlsFromSitemap(SITE_MAP[item]);

    await writeFile(
      path.resolve(__dirname, `../data-from-sitemap/${item}.json`),
      JSON.stringify(urls)
    );
  }

  console.log("Download completed.");
};

// --------- Execution ---------
await downloadUrlsFromSitemap();
