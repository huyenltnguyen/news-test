import { expect, describe, it, beforeAll } from "vitest";
import * as cheerio from "cheerio";

import { getTestData } from "../test-utils";

const { HASHNODE_POSTS_DATA, EXPECTED_POSTS_DATA, EXPECTED_POST_URLS } =
  await getTestData();

// ------------------------------
// Tests
// ------------------------------
describe.each([
  "https://www.freecodecamp.org//news/how-to-sign-and-validate-json-web-tokens/",
])("%s - Post metadata", (url) => {
  const { html: expectedHtml } = EXPECTED_POSTS_DATA[url];
  const { html } = HASHNODE_POSTS_DATA[url];

  let $html: ReturnType<typeof cheerio.load>;
  let $expectedHtml: ReturnType<typeof cheerio.load>;

  beforeAll(() => {
    $html = cheerio.load(html);
    $expectedHtml = cheerio.load(expectedHtml);
  });

  it("should have the correct <title>", () => {
    const query = "title";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).text()).toBeTruthy();
    expect($html(query).text()).toEqual($expectedHtml(query).text());
  });

  it("should have the correct <meta> description", () => {
    const query = "meta[name='description']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <link> canonical", () => {
    const query = "link[rel='canonical']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> generator", () => {
    const query = "meta[name='generator']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:site_name", () => {
    const query = "meta[property='og:site_name']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:type", () => {
    const query = "meta[property='og:type']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:title", () => {
    const query = "meta[property='og:title']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:description", () => {
    const query = "meta[property='og:description']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:url", () => {
    const query = "meta[property='og:url']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:image", () => {
    const query = "meta[property='og:image']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:image:width", () => {
    const query = "meta[property='og:image:width']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> og:image:height", () => {
    const query = "meta[property='og:image:height']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> article:published_time", () => {
    const query = "meta[property='article:published_time']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> article:modified_time", () => {
    const query = "meta[property='article:modified_time']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> article:tag", () => {
    const query = "meta[property='article:tag']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual($expectedHtml(query).length);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> article:publisher", () => {
    const query = "meta[property='article:publisher']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:card", () => {
    const query = "meta[name='twitter:card']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:title", () => {
    const query = "meta[name='twitter:title']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:description", () => {
    const query = "meta[name='twitter:description']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:url", () => {
    const query = "meta[name='twitter:url']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:image", () => {
    const query = "meta[name='twitter:image']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:label1", () => {
    const query = "meta[name='twitter:label1']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:data1", () => {
    const query = "meta[name='twitter:data1']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:label2", () => {
    const query = "meta[name='twitter:label2']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:data2", () => {
    const query = "meta[name='twitter:data2']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:site", () => {
    const query = "meta[name='twitter:site']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct <meta> twitter:creator", () => {
    const query = "meta[name='twitter:creator']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());
  });

  it("should have the correct JSON-LD", () => {
    const query = "script[type='application/ld+json']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);

    expect($html(query).attr()).toBeTruthy();
    expect($html(query).attr()).toEqual($expectedHtml(query).attr());

    expect($html(query).text()).toBeTruthy();
    expect($html(query).text()).toEqual($expectedHtml(query).text());
  });
});
