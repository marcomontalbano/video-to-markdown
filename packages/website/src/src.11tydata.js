export default {
  permalink: ({ page }) => `/${page.filePathStem}.${page.outputFileExtension}`,
};
