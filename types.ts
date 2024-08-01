export type PostData = { html: string };

/**
 * Example:
 * {
 *   {
 *     "path/to/author-one": {
 *       "path/to/post-one": {
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       },
 *       "path/to/post-two": {
 *         html: "<!DOCTYPE html><html lang="en">..."
 *       }
 *     }
 *   }
 * }
 */
export type PostsDataByAuthor = {
  [authorUrl: string]: Record<string, PostData>;
};
