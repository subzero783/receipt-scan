/**
 * Safe navigation utility to wrap window.location modifications.
 * This enables clean testing/mocking in JSDOM/Jest environments without read-only errors.
 */
export const navigateTo = (url) => {
  if (typeof window !== "undefined") {
    window.location.assign(url);
  }
};
