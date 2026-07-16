// One-off content extraction script: parses the WordPress WXR export
// (demo-data/content.xml) and produces per-page Elementor JSON trees under
// content/pages/*.json, downloading referenced remote images into
// public/images/. Not part of the app runtime - run manually with:
//   node scripts/extract-content.mjs [pageTitle ...]

import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const XML_PATH = path.join(ROOT, "demo-data", "content.xml");
const OUT_DIR = path.join(__dirname, "..", "content", "pages");
const IMG_DIR = path.join(__dirname, "..", "public", "images");

const DEFAULT_PAGES = [
  "Home",
  "About Us",
  "Our Services",
  "Our Team",
  "Price Page",
  "FAQs page",
  "Choose Us",
  "Testimonial",
  "Work Process",
  "Blog",
  "Contact",
];

function extractItems(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  return items.map((it) => {
    const postType = (it.match(
      /<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/,
    ) || [])[1];
    const title = (it.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
      [])[1];
    const postId = (it.match(
      /<wp:post_id>(\d+)<\/wp:post_id>/,
    ) || [])[1];
    const metaRe =
      /<wp:meta_key><!\[CDATA\[(.*?)\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/g;
    const meta = {};
    let m;
    while ((m = metaRe.exec(it))) {
      meta[m[1]] = m[2];
    }
    const excerpt = (it.match(
      /<excerpt:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/excerpt:encoded>/,
    ) || [])[1];
    const content = (it.match(
      /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/,
    ) || [])[1];
    const postDate = (it.match(
      /<wp:post_date><!\[CDATA\[([\s\S]*?)\]\]><\/wp:post_date>/,
    ) || [])[1];
    const link = (it.match(/<link>([\s\S]*?)<\/link>/) || [])[1];
    const categories = [...it.matchAll(
      /<category domain="category"[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g,
    )].map((m) => m[1]);
    return { postType, title, postId, meta, excerpt, content, postDate, link, categories, raw: it };
  });
}

// Matches both images and the .webm/.mp4 clips used as hover/background
// "video" media (e.g. tx_service_section's handshake card) - anything under
// wp-content/uploads needs to be downloaded and localized the same way, or
// rewriteInternalLinks() below strips the domain off the untouched URL and
// leaves a relative path that 404s against this app (no matching route).
function collectImageUrls(node, acc) {
  if (node == null) return;
  if (typeof node === "string") {
    if (/^https?:\/\/[^\s"]+\/wp-content\/uploads\/[^\s"]+\.(webp|png|jpe?g|svg|gif|webm|mp4)$/i.test(node)) {
      acc.add(node);
    }
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((n) => collectImageUrls(n, acc));
    return;
  }
  if (typeof node === "object") {
    Object.values(node).forEach((v) => collectImageUrls(v, acc));
  }
}

function replaceUrls(node, map) {
  if (typeof node === "string") {
    return map.has(node) ? map.get(node) : node;
  }
  if (Array.isArray(node)) {
    return node.map((n) => replaceUrls(n, map));
  }
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = replaceUrls(v, map);
    }
    return out;
  }
  return node;
}

// Node's fetch() hangs indefinitely against this host in the sandboxed dev
// environment (TLS proxy quirk). curl completes reliably even though it
// sometimes prints a spurious timeout warning after the file is fully
// written, so shell out to curl instead and trust the resulting file size.
async function downloadImage(url) {
  const filename = decodeURIComponent(path.basename(new URL(url).pathname));
  const dest = path.join(IMG_DIR, filename);
  const localPath = `/images/${filename}`;
  if (existsSync(dest)) return localPath;
  try {
    await execFileAsync("curl", [
      "-sS",
      "-m",
      "30",
      "--retry",
      "2",
      url,
      "-o",
      dest,
    ]);
  } catch {
    // curl sometimes exits non-zero even after writing the full file
    // (see note above) - fall through to the size check below.
  }
  if (!existsSync(dest) || (await stat(dest)).size === 0) {
    console.warn(`  ! failed to download ${url}`);
    return url;
  }
  const size = (await stat(dest)).size;
  console.log(`  downloaded ${filename} (${size} bytes)`);
  return localPath;
}

function findFirstWidget(nodes) {
  for (const n of nodes || []) {
    if (n.elType === "widget") return n;
    if (n.elements) {
      const found = findFirstWidget(n.elements);
      if (found) return found;
    }
  }
  return null;
}

// Some tab/section widgets reference a nested Elementor Library template by
// post ID (e.g. `"template": "248"`) instead of inlining content. Resolve
// those by pulling the first widget's settings out of the referenced
// elementor_library post and attaching it as `resolved_template`.
function resolveTemplates(node, itemsById) {
  if (Array.isArray(node)) {
    node.forEach((n) => resolveTemplates(n, itemsById));
    return;
  }
  if (node && typeof node === "object") {
    if (typeof node.template === "string" && /^\d+$/.test(node.template)) {
      const templateItem = itemsById.get(node.template);
      const dataStr = templateItem?.meta["_elementor_data"];
      if (dataStr) {
        try {
          const templateTree = JSON.parse(dataStr);
          const widget = findFirstWidget(templateTree);
          if (widget) {
            node.resolved_template = { widgetType: widget.widgetType, settings: widget.settings };
          }
        } catch {
          // ignore malformed nested template data
        }
      }
    }
    Object.values(node).forEach((v) => resolveTemplates(v, itemsById));
  }
}

const SITE_BASE = "https://themexriver.com/wp/nimo";

// Internal links in the demo content point at the original WP install;
// rewrite them to site-relative paths so nav works against this app.
function rewriteInternalLinks(node) {
  if (typeof node === "string") {
    if (node.startsWith(SITE_BASE)) {
      const rest = node.slice(SITE_BASE.length);
      return rest === "" ? "/" : rest;
    }
    return node;
  }
  if (Array.isArray(node)) return node.map(rewriteInternalLinks);
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = rewriteInternalLinks(v);
    return out;
  }
  return node;
}

// Some demo post content is double HTML-encoded in the WXR source itself
// (e.g. post 1179's content:encoded starts "&lt;p class=..." instead of
// "<p class=..."), so decode entities before stripping tags - otherwise
// the leftover "&lt;p class=..." shows up literally in the rendered excerpt.
function decodeEntities(str) {
  return (str || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(html) {
  return decodeEntities(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// tx_post_grid pulls from a live WP_Query the theme has no equivalent for
// here. The widget can either show the N latest posts, or (as this demo
// content actually uses - `show_post_by: "selected"`) a hand-curated list
// with its own per-post image/title overrides (`selected_list_post`),
// falling back to the real post's own excerpt/date/category. Reproduce
// both modes and inject the result as `resolved_posts`.
function resolvePostGrids(node, allPosts, itemsById) {
  if (Array.isArray(node)) {
    node.forEach((n) => resolvePostGrids(n, allPosts, itemsById));
    return;
  }
  if (node && typeof node === "object") {
    if (node.widgetType === "tx_post_grid") {
      const settings = node.settings;
      if (settings.show_post_by === "selected" && Array.isArray(settings.selected_list_post)) {
        node.settings.resolved_posts = settings.selected_list_post.map((sel) => {
          const real = itemsById.get(String(sel.post_id));
          return {
            id: sel.post_id,
            title: sel.title || real?.title || "",
            image: sel.image?.url || null,
            excerpt: stripHtml(real?.excerpt) || stripHtml(real?.content).slice(0, 140) + "...",
            date: real?.postDate ? real.postDate.slice(0, 10) : "",
            category: real?.categories?.[0] || "",
            slug: slugify(sel.title || real?.title || String(sel.post_id)),
          };
        });
      } else {
        const count = Number(settings.posts_per_page) || 4;
        node.settings.resolved_posts = allPosts.slice(0, count).map((p) => ({
          id: p.postId,
          title: p.title,
          image: null,
          excerpt: stripHtml(p.excerpt) || stripHtml(p.content).slice(0, 140) + "...",
          date: p.postDate ? p.postDate.slice(0, 10) : "",
          category: p.categories?.[0] || "",
          slug: slugify(p.title),
        }));
      }
    }
    Object.values(node).forEach((v) => resolvePostGrids(v, allPosts, itemsById));
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function processTree(tree, label, itemsById, allPosts) {
  resolveTemplates(tree, itemsById);
  resolvePostGrids(tree, allPosts, itemsById);

  const urls = new Set();
  collectImageUrls(tree, urls);
  console.log(`"${label}": ${urls.size} image(s) referenced`);

  const map = new Map();
  for (const url of urls) {
    const local = await downloadImage(url);
    map.set(url, local);
  }

  const rewritten = replaceUrls(tree, map);
  return rewriteInternalLinks(rewritten);
}

async function writeJson(name, data) {
  const outPath = path.join(OUT_DIR, `${name}.json`);
  await writeFile(outPath, JSON.stringify(data, null, 2));
  console.log(`  -> ${path.relative(process.cwd(), outPath)}`);
}

async function main() {
  const wanted = process.argv.slice(2);
  const targetTitles = wanted.length ? wanted : DEFAULT_PAGES;

  console.log(`Reading ${XML_PATH}...`);
  const xml = await readFile(XML_PATH, "utf-8");
  const items = extractItems(xml);
  const itemsById = new Map(items.map((it) => [it.postId, it]));
  const pages = items.filter(
    (it) => it.postType === "page" && targetTitles.includes(it.title),
  );
  const allPosts = items
    .filter((it) => it.postType === "post")
    .sort((a, b) => (b.postDate || "").localeCompare(a.postDate || ""));

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(IMG_DIR, { recursive: true });

  for (const title of targetTitles) {
    const page = pages.find((p) => p.title === title);
    if (!page) {
      console.warn(`Page not found in XML: "${title}"`);
      continue;
    }
    const dataStr = page.meta["_elementor_data"];
    if (!dataStr) {
      console.warn(`No _elementor_data for page "${title}" (post ${page.postId})`);
      continue;
    }
    let tree;
    try {
      tree = JSON.parse(dataStr);
    } catch (e) {
      console.warn(`Failed to parse _elementor_data JSON for "${title}": ${e.message}`);
      continue;
    }

    const rewritten = await processTree(tree, title, itemsById, allPosts);
    await writeJson(slugify(title), rewritten);
  }

  // Individual CPT posts (e.g. a single "services" post) that carry their
  // own `_elementor_data` directly, rather than living on a shared page -
  // extracted by post ID since they're not `postType === "page"`.
  for (const [name, postId] of [["digital-strategy-marketing", "147"], ["alfred-noble", "75"]]) {
    const item = itemsById.get(postId);
    const dataStr = item?.meta["_elementor_data"];
    if (!dataStr) {
      console.warn(`No _elementor_data for ${name} (post ${postId})`);
      continue;
    }
    const tree = JSON.parse(dataStr);
    const rewritten = await processTree(tree, name, itemsById, allPosts);
    await writeJson(name, rewritten);
  }

  // Default header (post 1459, "Header 1") / footer (post 1566, "Footer 1")
  // per demo-data/codestar.json's header_style/footer_style options.
  for (const [name, postId] of [["header", "1459"], ["footer", "1566"]]) {
    const item = itemsById.get(postId);
    const dataStr = item?.meta["_elementor_data"];
    if (!dataStr) {
      console.warn(`No _elementor_data for ${name} (post ${postId})`);
      continue;
    }
    const tree = JSON.parse(dataStr);
    const rewritten = await processTree(tree, name, itemsById, allPosts);
    await writeJson(name, rewritten);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
