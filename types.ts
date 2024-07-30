export type Metadata = Array<{
  tagName: string;
  attributes: {
    [name: string]: string;
  };
  scriptContent?: string;
}>;

/**
 * Example:
 * {
 *   "path/to/post-one": {
 *     metadata: [
 *       { tagName, attributes },
 *       { tagName, attributes, scriptContent },
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
 *           { tagName, attributes, scriptContent },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       }
 *     }
 *   }
 * }
 */
export type PostsMetadataByAuthor = Record<string, PostMetadata>;

/**
 * Example:
 * {
 *   {
 *     "path/to/author-one": {
 *       "path/to/post-one": {
 *         metadata: [
 *           { tagName, attributes },
 *           { tagName, attributes, scriptContent },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       },
 *       "path/to/post-two": {
 *         metadata: [
 *           { tagName, attributes },
 *           { tagName, attributes, scriptContent },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       },
 *     },
 *     "path/to/author-two": {
 *       "path/to/post-one": {
 *         metadata: [
 *           { tagName, attributes },
 *           { tagName, attributes, scriptContent },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       },
 *       "path/to/post-two": {
 *         metadata: [
 *           { tagName, attributes },
 *           { tagName, attributes, scriptContent },
 *         ],
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       },
 *     }
 *   }
 * }
 */
export type AllPostsMetadata = Record<string, PostsMetadataByAuthor>;
