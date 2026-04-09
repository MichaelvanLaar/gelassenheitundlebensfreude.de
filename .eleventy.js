const fs = require("node:fs");
const path = require("node:path");
const markdownIt = require("markdown-it");

/**
 * Eleventy configuration for gelassenheitundlebensfreude.de.
 *
 * See openspec/changes/bootstrap-site/design.md §D-08 for the repo layout
 * and §D-03 for the URL scheme (`/<category-slug>/<article-slug>/`).
 */

// Fixed category slugs — see design.md §D-03.
const CATEGORY_SLUGS = [
  "gelassene-produktivitaet",
  "innere-staerke",
  "leichte-balance",
  "verbunden-kommunizieren",
];

// Required front-matter fields on every article.
const REQUIRED_ARTICLE_FIELDS = [
  "title",
  "category",
  "slug",
  "metaDescription",
  "headerImage",
  "teaserImage",
];

// Root of the read-only source-article directory (CON-006).
const ARTICLE_SOURCE_DIR = path.resolve(__dirname, "docs/requirements/content/articles");

/** Strip YAML front matter from a source Markdown file, returning only the body. */
function readArticleBody(sourceFile) {
  const absolute = path.join(ARTICLE_SOURCE_DIR, sourceFile);
  if (!fs.existsSync(absolute)) {
    throw new Error(
      `Article source not found: ${sourceFile} (expected at ${absolute}). ` +
        `Check the sourceFile front-matter value.`,
    );
  }
  const raw = fs.readFileSync(absolute, "utf8");
  // If the source has front matter, strip it; otherwise return as-is.
  const fmMatch = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  return fmMatch ? raw.slice(fmMatch[0].length) : raw;
}

module.exports = function (eleventyConfig) {
  // Passthrough copy: fonts, favicons, logo, generated image assets, robots.txt.
  eleventyConfig.addPassthroughCopy({ "src/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Markdown: typographer on, HTML allowed for inline <picture> shortcode output.
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
  eleventyConfig.setLibrary("md", md);

  // Content ingestion: for each article stub under src/content/articles/, if the
  // body is empty, pull it from docs/requirements/content/articles/<sourceFile>.
  // Source files are read-only per CON-006; this preprocessor does not modify them.
  eleventyConfig.addPreprocessor("article-body", "md", (data, content) => {
    const inputPath = data.page && data.page.inputPath ? data.page.inputPath : "";
    if (!inputPath.includes("/content/articles/")) return;
    if (!data.sourceFile) return;
    const bodyIsEmpty = !content || content.trim() === "";
    if (!bodyIsEmpty) return;
    return readArticleBody(data.sourceFile);
  });

  // Build-time validator: fail the build on missing fields or invalid category.
  eleventyConfig.addCollection("articles", (collectionApi) => {
    const articles = collectionApi.getFilteredByGlob("src/content/articles/**/*.md");
    const errors = [];
    const seenSlugs = new Set();
    for (const item of articles) {
      const file = item.inputPath;
      for (const field of REQUIRED_ARTICLE_FIELDS) {
        if (!item.data[field]) {
          errors.push(`${file}: missing required field "${field}"`);
        }
      }
      if (item.data.category && !CATEGORY_SLUGS.includes(item.data.category)) {
        errors.push(
          `${file}: category "${item.data.category}" is not one of ${CATEGORY_SLUGS.join(", ")}`,
        );
      }
      if (item.data.slug) {
        const key = `${item.data.category}/${item.data.slug}`;
        if (seenSlugs.has(key)) {
          errors.push(`${file}: duplicate slug "${key}"`);
        }
        seenSlugs.add(key);
      }
    }
    if (errors.length > 0) {
      throw new Error(`Article front-matter validation failed:\n  - ${errors.join("\n  - ")}`);
    }
    return articles;
  });

  // Per-category collections, keyed by canonical slug.
  for (const slug of CATEGORY_SLUGS) {
    eleventyConfig.addCollection(`articles_${slug.replace(/-/g, "_")}`, (collectionApi) =>
      collectionApi
        .getFilteredByGlob("src/content/articles/**/*.md")
        .filter((item) => item.data.category === slug),
    );
  }

  // Reading-time filter: word count / 200 wpm, rounded up.
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return 0;
    const words = String(content).trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
