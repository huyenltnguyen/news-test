import { expect, describe, it } from "vitest";

import { getPostsMetadataByAuthor } from "../utils";
import {
  AUTHOR,
  EXPECTED_POSTS_METADATA,
  EXPECTED_POST_URLS,
} from "../test-utils";
import { Metadata, PostsMetadataByAuthor } from "../types";

const postsMetadataByAuthor = await getPostsMetadataByAuthor({
  authorUrl: AUTHOR,
  shouldWriteFile: false,
});

const postsMetadata = (postsMetadataByAuthor as PostsMetadataByAuthor)[AUTHOR];

// ------------------------------
// Assertion helpers
// ------------------------------
const areObjectsEqual = (obj1, obj2) => {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  const keys = Object.keys(obj1);

  for (const key of keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

const getTitle = (metadata: Metadata) =>
  metadata.find((item) => item.tagName === "title");

const getMetaDescription = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.name === "description"
  );

const getLinkCanonical = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "link" &&
      item.attributes.rel &&
      item.attributes.rel === "canonical"
  );

const getMetaGenerator = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.name === "generator"
  );

const getMetaOGSitename = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.property === "og:site_name"
  );

const getMetaOGType = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.property === "og:type"
  );

const getMetaOGTitle = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.property === "og:title"
  );

const getMetaOGDescription = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.property === "og:description"
  );

const getMetaOGUrl = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.property === "og:url"
  );

const getMetaOGImage = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.property === "og:image"
  );

const getMetaOGImageWidth = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.property === "og:image:width"
  );

const getMetaOGImageHeight = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.property === "og:image:height"
  );

const getMetaArticlePublishedTime = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" &&
      item.attributes.property === "article:published_time"
  );

const getMetaArticleModifiedTime = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" &&
      item.attributes.property === "article:modified_time"
  );

const getMetaArticleTag = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.property === "article:tag"
  );

const getMetaArticlePublisher = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" &&
      item.attributes.property === "article:publisher"
  );

const getMetaTwitterCard = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.name === "twitter:card"
  );

const getMetaTwitterTitle = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:title"
  );

const getMetaTwitterDescription = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:description"
  );

const getMetaTwitterUrl = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.name === "twitter:url"
  );

const getMetaTwitterImage = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:image"
  );

const getMetaTwitterLabel1 = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:label1"
  );

const getMetaTwitterData1 = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:data1"
  );

const getMetaTwitterLabel2 = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:label2"
  );

const getMetaTwitterData2 = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:data2"
  );

const getMetaTwitterSite = (metadata: Metadata) =>
  metadata.find(
    (item) => item.tagName === "meta" && item.attributes.name === "twitter:site"
  );

const getMetaTwitterCreator = (metadata: Metadata) =>
  metadata.find(
    (item) =>
      item.tagName === "meta" && item.attributes.name === "twitter:creator"
  );

// ------------------------------
// Tests
// ------------------------------
describe.each(EXPECTED_POST_URLS)("Posts metadata", (url) => {
  const { metadata: expectedMetadata } = EXPECTED_POSTS_METADATA[url];
  const { metadata } = postsMetadata[url];

  // it("should have correct metadata", () => {
  //   expect(metadata.length).toEqual(expectedMetadata.length);

  //   // Check if the elements exist and match the ones in the original object
  //   for (const element of metadata) {
  //     const elementExists = expectedMetadata.some(
  //       ({
  //         tagName: expectedTagName,
  //         attributes: expectedAttributes,
  //         scriptContent: expectedScriptContent,
  //       }) => {
  //         if (expectedTagName !== element.tagName) {
  //           return false;
  //         }

  //         return (
  //           areObjectsEqual(expectedAttributes, element.attributes) &&
  //           expectedScriptContent === element.scriptContent
  //         );
  //       }
  //     );

  //     // This is for debugging
  //     if (!elementExists) {
  //       console.log("element:", element);
  //     }

  //     expect(elementExists).toBe(true);
  //   }
  // });

  it("should have the correct <title>", () => {
    expect(getTitle(metadata)).toBeTruthy();
    expect(getTitle(metadata)).toEqual(getTitle(expectedMetadata));
  });

  it("should have the correct <meta> description", () => {
    expect(getMetaDescription(metadata)).toBeTruthy();
    expect(getMetaDescription(metadata)).toEqual(
      getMetaDescription(expectedMetadata)
    );
  });

  it("should have the correct <link> canonical", () => {
    expect(getLinkCanonical(metadata)).toBeTruthy();
    expect(getLinkCanonical(metadata)).toEqual(
      getLinkCanonical(expectedMetadata)
    );
  });

  it("should have the correct <meta> generator", () => {
    expect(getMetaGenerator(metadata)).toBeTruthy();
    expect(getMetaGenerator(metadata)).toEqual(
      getMetaGenerator(expectedMetadata)
    );
  });

  it("should have the correct <meta> og:site_name", () => {
    expect(getMetaOGSitename(metadata)).toBeTruthy();
    expect(getMetaOGSitename(metadata)).toEqual(
      getMetaOGSitename(expectedMetadata)
    );
  });

  it("should have the correct <meta> og:type", () => {
    expect(getMetaOGType(metadata)).toBeTruthy();
    expect(getMetaOGType(metadata)).toEqual(getMetaOGType(expectedMetadata));
  });

  it("should have the correct <meta> og:title", () => {
    expect(getMetaOGTitle(metadata)).toBeTruthy();
    expect(getMetaOGTitle(metadata)).toEqual(getMetaOGTitle(expectedMetadata));
  });

  it("should have the correct <meta> og:description", () => {
    expect(getMetaOGDescription(metadata)).toBeTruthy();
    expect(getMetaOGDescription(metadata)).toEqual(
      getMetaOGDescription(expectedMetadata)
    );
  });

  it("should have the correct <meta> og:url", () => {
    expect(getMetaOGUrl(metadata)).toBeTruthy();
    expect(getMetaOGUrl(metadata)).toEqual(getMetaOGUrl(expectedMetadata));
  });

  it("should have the correct <meta> og:image", () => {
    expect(getMetaOGImage(metadata)).toBeTruthy();
    expect(getMetaOGImage(metadata)).toEqual(getMetaOGImage(expectedMetadata));
  });

  it("should have the correct <meta> og:image:width", () => {
    expect(getMetaOGImageWidth(metadata)).toBeTruthy();
    expect(getMetaOGImageWidth(metadata)).toEqual(
      getMetaOGImageWidth(expectedMetadata)
    );
  });

  it("should have the correct <meta> og:image:height", () => {
    expect(getMetaOGImageHeight(metadata)).toBeTruthy();
    expect(getMetaOGImageHeight(metadata)).toEqual(
      getMetaOGImageHeight(expectedMetadata)
    );
  });

  it("should have the correct <meta> article:published_time", () => {
    expect(getMetaArticlePublishedTime(metadata)).toBeTruthy();
    expect(getMetaArticlePublishedTime(metadata)).toEqual(
      getMetaArticlePublishedTime(expectedMetadata)
    );
  });

  it("should have the correct <meta> article:modified_time", () => {
    expect(getMetaArticleModifiedTime(metadata)).toBeTruthy();
    expect(getMetaArticleModifiedTime(metadata)).toEqual(
      getMetaArticleModifiedTime(expectedMetadata)
    );
  });

  it("should have the correct <meta> article:tag", () => {
    expect(getMetaArticleTag(metadata)).toBeTruthy();
    expect(getMetaArticleTag(metadata)).toEqual(
      getMetaArticleTag(expectedMetadata)
    );
  });

  it("should have the correct <meta> article:publisher", () => {
    expect(getMetaArticlePublisher(metadata)).toBeTruthy();
    expect(getMetaArticlePublisher(metadata)).toEqual(
      getMetaArticlePublisher(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:card", () => {
    expect(getMetaTwitterCard(metadata)).toBeTruthy();
    expect(getMetaTwitterCard(metadata)).toEqual(
      getMetaTwitterCard(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:title", () => {
    expect(getMetaTwitterTitle(metadata)).toBeTruthy();
    expect(getMetaTwitterTitle(metadata)).toEqual(
      getMetaTwitterTitle(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:description", () => {
    expect(getMetaTwitterDescription(metadata)).toBeTruthy();
    expect(getMetaTwitterDescription(metadata)).toEqual(
      getMetaTwitterDescription(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:url", () => {
    expect(getMetaTwitterUrl(metadata)).toBeTruthy();
    expect(getMetaTwitterUrl(metadata)).toEqual(
      getMetaTwitterUrl(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:image", () => {
    expect(getMetaTwitterImage(metadata)).toBeTruthy();
    expect(getMetaTwitterImage(metadata)).toEqual(
      getMetaTwitterImage(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:label1", () => {
    expect(getMetaTwitterLabel1(metadata)).toBeTruthy();
    expect(getMetaTwitterLabel1(metadata)).toEqual(
      getMetaTwitterLabel1(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:data1", () => {
    expect(getMetaTwitterData1(metadata)).toBeTruthy();
    expect(getMetaTwitterData1(metadata)).toEqual(
      getMetaTwitterData1(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:label2", () => {
    expect(getMetaTwitterLabel2(metadata)).toBeTruthy();
    expect(getMetaTwitterLabel2(metadata)).toEqual(
      getMetaTwitterLabel2(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:data2", () => {
    expect(getMetaTwitterData2(metadata)).toBeTruthy();
    expect(getMetaTwitterData2(metadata)).toEqual(
      getMetaTwitterData2(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:site", () => {
    expect(getMetaTwitterSite(metadata)).toBeTruthy();
    expect(getMetaTwitterSite(metadata)).toEqual(
      getMetaTwitterSite(expectedMetadata)
    );
  });

  it("should have the correct <meta> twitter:creator", () => {
    expect(getMetaTwitterCreator(metadata)).toBeTruthy();
    expect(getMetaTwitterCreator(metadata)).toEqual(
      getMetaTwitterCreator(expectedMetadata)
    );
  });
});
