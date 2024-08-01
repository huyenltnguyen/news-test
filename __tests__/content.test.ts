import { expect, describe, it, beforeAll } from "vitest";
import * as cheerio from "cheerio";

import { getPostsMetadataByAuthor } from "../utils";
import {
  AUTHOR,
  EXPECTED_POSTS_METADATA,
  EXPECTED_POST_URLS,
} from "../test-utils";
import { PostsMetadataByAuthor } from "../types";

const postsMetadataByAuthor = await getPostsMetadataByAuthor({
  authorUrl: AUTHOR,
  shouldWriteFile: false,
});

const postsMetadata = (postsMetadataByAuthor as PostsMetadataByAuthor)[AUTHOR];

describe.each(EXPECTED_POST_URLS)("%s - Post content", (url) => {
  const { html: expectedHtml } = EXPECTED_POSTS_METADATA[url];
  const { html } = postsMetadata[url];

  let $html: ReturnType<typeof cheerio.load>;
  let $expectedHtml: ReturnType<typeof cheerio.load>;

  beforeAll(() => {
    $html = cheerio.load(html);
    $expectedHtml = cheerio.load(expectedHtml);
  });

  it("should have the correct heading", () => {
    const query = "h1[data-test-label='post-full-title']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);
    expect($html(query).text()).toEqual($expectedHtml(query).text());
  });

  it("should have the correct content", () => {
    const query = "section[data-test-label='post-content']";

    expect($html(query)).toBeTruthy();

    expect($html(query).length).toEqual(1);
    expect($html(query).text()).toEqual($expectedHtml(query).text());
  });

  it("should have the correct author card", () => {
    const query = "section[data-test-label='author-card']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(2);
    expect($html(query).text()).toEqual($expectedHtml(query).text());
  });

  it("should have the correct author link", () => {
    const query = "a[data-test-label='profile-link']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(2);
    expect($html(query).attr("href")).toEqual(
      $expectedHtml(query).attr("href")
    );
    expect($html(query).text()).toEqual($expectedHtml(query).text());
  });

  it("should have the correct feature image", () => {
    const query = "img[data-test-label='feature-image']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);
    expect($html(query).attr("src")).toEqual($expectedHtml(query).attr("src"));
    expect($html(query).attr("alt")).toEqual($expectedHtml(query).attr("alt"));
  });

  it("should have the correct tweet button", () => {
    const query = "button[data-test-label='tweet-button']";

    expect($html(query)).toBeTruthy();
    expect($html(query).length).toEqual(1);
    expect($html(query).attr("onclick")).toEqual(
      $expectedHtml(query).attr("onclick")
    );
  });
});
