/**
 * Generates a URL-friendly, lowercase, hyphen-separated slug from any text.
 *
 * @param {string} text The text to slugify
 * @returns {string} The URL-friendly slug
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word characters except -
    .replace(/\-\-+/g, '-')         // Replace multiple consecutive - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}
