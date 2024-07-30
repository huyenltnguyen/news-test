import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import { writeFileSync } from "fs";
import path from "path";

const scrape = async () => {
  // Download HTML with Got Scraping
  // const response = await gotScraping.get({
  //   url: "https://www.freecodecamp.org/news/sitemap-pages.xml",
  // });
  // const html = response.body;
  // // Parse HTML with Cheerio
  // const $ = cheerio.load(html);
  // const links = $("url loc");
  // console.log("🚀 ~ scrape ~ links:", links);
};

await scrape();
