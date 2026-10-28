const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const { iconTuple, iconLine, asciiJSON } = require("./script/icon-tuple.cjs");

const ICONS_DIR = path.join(__dirname, "icon-svg");
const DIST_DIR = path.join(__dirname, "dist");
const ENTRY_NAME = "custom-brand-icons.js";

// -------------------- Chunking parameters --------------------
// Icons are packed alphabetically into chunks of at most CHUNK_BYTES, so the
// number of chunks is whatever that yields; the build prints it. Changing the
// budget moves every boundary and so invalidates every chunk for every user,
// which is a one-time cost.
const CHUNK_BYTES = 145 * 1024;
const HASH_LENGTH = 8;

if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

const files = fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg")).sort();

// Read every icon into a [x, y, w, h, path] tuple.
const entries = files.map((file) => {
  const name = path.basename(file, ".svg").normalize("NFC");
  try {
    const line = iconLine(name, iconTuple(fs.readFileSync(path.join(ICONS_DIR, file), "utf8")));
    return { name, line, bytes: Buffer.byteLength(line, "utf8") };
  } catch (err) {
    throw new Error(`${file}: ${err.message}`);
  }
});

if (entries.length === 0) {
  throw new Error(`no SVG sources in ${path.relative(__dirname, ICONS_DIR)}`);
}

// Pack alphabetically to a byte budget. This keeps chunk sizes even and gives
// each chunk a run of neighbouring names, which compresses better than a
// scattered set; it also isolates the handful of very large icons into chunks
// that a page is unlikely to ask for.
const chunks = [[]];
let used = 0;
for (const entry of entries) {
  if (used + entry.bytes > CHUNK_BYTES && chunks[chunks.length - 1].length) {
    chunks.push([]);
    used = 0;
  }
  chunks[chunks.length - 1].push(entry);
  used += entry.bytes;
}

// Stable filenames with the content hash in the import query. HACS only clears
// the install directory on uninstall, so hashed filenames would accumulate there.
const manifest = {};
const written = chunks.map((chunk, index) => {
  const body = Buffer.from(
    "export default {\n" + chunk.map((e) => e.line).join("") + "};\n",
    "utf8"
  );
  const hash = crypto.createHash("sha256").update(body).digest("hex").slice(0, HASH_LENGTH);
  const filename = `cbi-${index}.js`;
  fs.writeFileSync(path.join(DIST_DIR, filename), body);
  chunk.forEach((e) => {
    manifest[e.name] = index;
  });
  return { filename, specifier: `${filename}?v=${hash}`, size: body.length };
});

// Entry: manifest plus the on-demand loader.
const entrySource = `var CHUNKS = ${JSON.stringify(written.map((c) => c.specifier))};

// Classic scripts expose their URL here, and chunks sit beside it; as a module
// document.currentScript is null and "./" resolves against this file's own URL.
// import.meta would not parse in a classic script.
var BASE = (typeof document !== "undefined" && document.currentScript)
  ? new URL("./", document.currentScript.src).href
  : "./";

var MANIFEST = ${asciiJSON(manifest)};

// Chunk index -> promise of its icon data; the settled promise is the cache.
var chunkPromises = new Map();
var chunkAttempts = new Map();

function loadChunk(index) {
  var pending = chunkPromises.get(index);
  if (!pending) {
    // A URL that failed to load can stay failed in the browser's module map, so
    // a retry has to ask for a different URL to be sure of a fresh fetch.
    var attempt = chunkAttempts.get(index) || 0;
    pending = import(BASE + CHUNKS[index] + (attempt ? "&r=" + attempt : ""))
      .then(function (module) {
        return module.default;
      })
      .catch(function (err) {
        chunkAttempts.set(index, attempt + 1);
        chunkPromises.delete(index);
        throw err;
      });
    chunkPromises.set(index, pending);
  }
  return pending;
}

async function getIcon(name) {
  if (!Object.prototype.hasOwnProperty.call(MANIFEST, name)) {
    console.log(\`Icon "\${name}" not available\`);
    return '';
  }

  var svgDef;
  try {
    var icons = await loadChunk(MANIFEST[name]);
    svgDef = icons[name];
  } catch (err) {
    console.error(\`Icon "\${name}" could not be loaded\`, err);
    return '';
  }

  if (!svgDef) {
    // Manifest and chunks are emitted together, so the files are mismatched.
    console.error(\`Icon "\${name}" is missing from its chunk; the icon pack files are out of sync\`);
    return '';
  }

  var primaryPath = svgDef[4];
  return {
    path: primaryPath,
    viewBox: svgDef[0] + " " + svgDef[1] + " " + svgDef[2] + " " + svgDef[3]
  }
}

async function getIconList() {
  return Object.keys(MANIFEST).map((icon) => ({
    name: icon
  }));
}

window.customIconsets = window.customIconsets || {};
window.customIconsets["phu"] = getIcon;

window.customIcons = window.customIcons || {};
window.customIcons["phu"] = { getIcon, getIconList };
`;

fs.writeFileSync(path.join(DIST_DIR, ENTRY_NAME), entrySource);

// Drop chunks this build did not write, so a lower CHUNK_COUNT never leaves
// orphans to be committed and shipped. Other files in dist/ are left alone.
const keep = new Set(written.map((c) => c.filename));
const orphans = fs
  .readdirSync(DIST_DIR)
  .filter((f) => /^cbi-\d+\.js$/.test(f) && !keep.has(f));
orphans.forEach((f) => fs.unlinkSync(path.join(DIST_DIR, f)));

const kb = (n) => (n / 1024).toFixed(1) + " KB";
const chunkSizes = written.map((c) => c.size);
const sorted = [...chunkSizes].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];

console.log("✅ Build completed");
console.log(`📁 Generated: dist/${ENTRY_NAME} + ${written.length} chunks`);
console.log("🔢 Total icons:", entries.length);
console.log("📦 Chunks:", written.length, `(budget ${kb(CHUNK_BYTES)} each)`);
console.log("📐 Chunk size: min", kb(sorted[0]), "· median", kb(median), "· max", kb(sorted[sorted.length - 1]));
console.log("🪶 Entry size:", kb(Buffer.byteLength(entrySource, "utf8")));
console.log("🧱 Chunk total:", (chunkSizes.reduce((a, b) => a + b, 0) / 1024 / 1024).toFixed(2), "MB");
if (orphans.length) console.log("🧹 Removed stale chunks:", orphans.join(", "));
