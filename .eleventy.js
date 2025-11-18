
module.exports = function (eleventyConfig) {
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addGlobalData("permalink", "{{ page.filePathStem }}.html");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.setTemplateFormats([
    "html",
    "njk",
    "txt",
    "js",
    "css",
    "xml",
    "json",
  ]);
  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
