export type Metadata = Array<{
  tagName: string;
  attributes: {
    [name: string]: string;
  };
  content: string;
}>;

/**
 * Example:
 * {
 *   "path/to/post-one": {
 *     metadata: [
 *       { tagName, attributes },
 *       { tagName, attributes, content },
 *     ],
 *     html: "<!DOCTYPE html><html lang="en">..."
 *   }
 * }
 */
export type PostMetadata = { metadata: Metadata; html: string };

/**
 * Example:
 * {
 *   {
 *     "path/to/author-one": {
 *       "path/to/post-one": {
 *         metadata: [
 *           { tagName, attributes },
 *           { tagName, attributes, content },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       },
 *       "path/to/post-two": {
 *         metadata: [
 *           { tagName, attributes },
 *           { tagName, attributes, content },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       }
 *     }
 *   }
 * }
 */
export type PostsMetadataByAuthor = {
  [authorUrl: string]: Record<string, PostMetadata>;
};
