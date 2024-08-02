import { expect, describe, it, beforeAll } from "vitest";
import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";

import { getRandomPosts } from "../test-utils";

const randomPosts = await getRandomPosts(10);

const scrape = async (postUrl: string) => {
  const response = await gotScraping.get({
    url: postUrl,
  });

  return response;
};

describe.each(randomPosts)("%s - Random post", (url) => {
  let response;
  let html;
  let $: ReturnType<typeof cheerio.load>;

  beforeAll(async () => {
    response = await scrape(url);

    html = response.body;
    $ = cheerio.load(html);
  });

  it("should be available", () => {
    expect(response.ok).toBe(true);
    expect(response.statusCode).toEqual(200);
  });

  it("should have an h1", () => {
    const el = $("h1[data-test-label='post-full-title']");

    expect(el).toBeTruthy();
    expect(el.length).toEqual(1);
    expect(el.text()).toBeTruthy();
  });

  it("should have a content section", () => {
    const el = $("section[data-test-label='post-content']");

    expect(el).toBeTruthy();
    expect(el.length).toEqual(1);
    expect(el.text()).toBeTruthy();
  });

  it("should have a feature image", () => {
    const el = $("img[data-test-label='feature-image']");

    expect(el).toBeTruthy();
    expect(el.length).toEqual(1);
    expect(el.attr("alt")).toBeTruthy();
    expect(el.attr("src")).toBeTruthy();
  });

  it("should have a tweet button", () => {
    const el = $("button[data-test-label='tweet-button']");

    expect(el).toBeTruthy();
    expect(el.length).toEqual(1);
    expect(el.text()).toBeTruthy();
  });

  it("should have a link to /learn", () => {
    const el = $("a[id=learn-to-code-cta]");

    expect(el).toBeTruthy();
    expect(el.length).toEqual(1);
    expect(el.attr("href")).toEqual("https://www.freecodecamp.org/learn/");
    expect(el.attr("target")).toEqual("_blank");
    expect(el.text()).toEqual("Get started");
  });

  it("should have author cards", ({ skip }) => {
    const el = $("section[data-test-label='author-card']");

    // Some posts don't have this element
    if (!el.length) {
      skip();
    }

    expect(el).toBeTruthy();
    expect(el.length).toEqual(2);
  });

  it("should have author images", ({ skip }) => {
    const el = $("img[data-test-label='profile-image']");

    // Some posts don't have this element
    if (!el.length) {
      skip();
    }

    expect(el).toBeTruthy();
    expect(el.length).toEqual(2);

    el.each((_, e) => {
      expect($(e).attr("alt")).toBeTruthy();
      expect($(e).attr("src")).toBeTruthy();
    });
  });

  it("should have author links", ({ skip }) => {
    const el = $("a[data-test-label='profile-link']");

    // Some posts don't have this element
    if (!el.length) {
      skip();
    }

    expect(el).toBeTruthy();
    expect(el.length).toEqual(2);

    el.each((_, e) => {
      expect($(e).attr("href")).toBeTruthy();
      expect($(e).text()).toBeTruthy();
    });
  });
});
