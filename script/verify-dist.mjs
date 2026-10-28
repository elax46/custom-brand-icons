#!/usr/bin/env node
// custom-brand-icons/script/verify-dist.mjs
// Run:
//   node script/verify-dist.mjs
//
// Drives the built pack the way a browser does -- loads the entry, then asks it
// for every icon -- and compares each answer against the SVG it came from.
// Comparing names is not enough: a dist/ left stale by an edited SVG still has
// all the right names. Exits non-zero if the build is incomplete, stale, or
// would not render.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { iconTuple } = require("./icon-tuple.cjs");

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST_DIR = path.join(REPO_ROOT, "dist");
const ICONS_DIR = path.join(REPO_ROOT, "icon-svg");
const ENTRY_NAME = "custom-brand-icons.js";
const CHUNK_RE = /^cbi-\d+\.js$/;
const HASH_LENGTH = 8;
const PREFIX = "phu";

const problems = [];
const fail = (problem) => problems.push(problem);
const die = (message) => {
  console.error(`❌ ${message}`);
  process.exit(1);
};

const entryPath = path.join(DIST_DIR, ENTRY_NAME);
if (!fs.existsSync(entryPath)) die(`${path.relative(REPO_ROOT, entryPath)} not found. Run: npm run build`);
if (!fs.existsSync(ICONS_DIR)) die(`${path.relative(REPO_ROOT, ICONS_DIR)} not found. Run from a full checkout.`);

// What the icons should be, taken from the sources rather than from the build.
const expected = new Map();
for (const file of fs.readdirSync(ICONS_DIR).filter((f) => f.endsWith(".svg"))) {
  const name = path.basename(file, ".svg");
  if (name.normalize("NFC") !== name) {
    fail(`${file} is not NFC-normalised, so dashboards cannot reference it by name`);
  }
  try {
    expected.set(name, iconTuple(fs.readFileSync(path.join(ICONS_DIR, file), "utf8")));
  } catch (err) {
    fail(`${file}: ${err.message}`);
  }
}
if (expected.size === 0) die(`${path.relative(REPO_ROOT, ICONS_DIR)} holds no SVG sources`);

// The entry is a classic script, so evaluating it in a bare context exposes its
// top-level CHUNKS/MANIFEST. With no `document` it loads nothing here.
const context = vm.createContext({ window: {}, console, URL });
try {
  new vm.Script(fs.readFileSync(entryPath, "utf8"), { filename: ENTRY_NAME })
    .runInContext(context, { timeout: 10000 });
} catch (err) {
  die(`${ENTRY_NAME} does not evaluate: ${err.message}`);
}
const { CHUNKS, MANIFEST } = context;
if (!Array.isArray(CHUNKS) || !MANIFEST) die(`${ENTRY_NAME} defines no CHUNKS/MANIFEST; it was not produced by the current builder.`);
if (CHUNKS.length === 0) fail("the entry lists no chunks at all");

// Chunk files: named the way the release glob expects, hashed to the bytes the
// entry was built against, and each holding exactly the icons the manifest says.
const referenced = new Set();
for (const [index, specifier] of CHUNKS.entries()) {
  const [filename, query] = specifier.split("?");
  if (referenced.has(filename)) fail(`${filename} is listed more than once in CHUNKS`);
  referenced.add(filename);

  if (!CHUNK_RE.test(filename)) {
    fail(`"${filename}" is not a cbi-<n>.js chunk, so the release would not publish it`);
    continue;
  }
  const declared = (query ?? "").replace(/^v=/, "");
  if (!new RegExp(`^[0-9a-f]{${HASH_LENGTH}}$`).test(declared)) {
    fail(`${filename} declares "${query}" rather than a ${HASH_LENGTH}-character content hash`);
    continue;
  }

  const file = path.join(DIST_DIR, filename);
  if (!fs.existsSync(file)) {
    fail(`${filename} is referenced by the entry but missing`);
    continue;
  }
  const actual = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").slice(0, HASH_LENGTH);
  if (actual !== declared) {
    fail(`${filename} does not match the hash the entry expects (${declared} vs ${actual}) — mismatched build`);
  }
}

// Anything else matching the release glob would ship and never be loaded.
for (const file of fs.readdirSync(DIST_DIR)) {
  if (file !== ENTRY_NAME && file.startsWith("cbi-") && !referenced.has(file)) {
    fail(`${file} is not referenced by the entry — stale chunk from an earlier build`);
  }
}

// Now the part that matters: load the pack as a consumer and ask it for every
// icon. Imported as a module, its own dynamic import() resolves the chunks.
globalThis.window = {};
try {
  await import(pathToFileURL(entryPath).href);
} catch (err) {
  die(`${ENTRY_NAME} does not load: ${err.message}`);
}

const iconsets = globalThis.window.customIconsets ?? {};
const packs = globalThis.window.customIcons ?? {};
const pack = packs[PREFIX];
if (typeof iconsets[PREFIX] !== "function") fail(`the entry does not register window.customIconsets["${PREFIX}"]`);
if (!pack || typeof pack.getIcon !== "function" || typeof pack.getIconList !== "function") {
  die(`the entry does not register window.customIcons["${PREFIX}"] with getIcon/getIconList`);
}

let wrong = 0;
for (const [name, tuple] of expected) {
  const got = await pack.getIcon(name).catch((err) => `threw ${err.message}`);
  if (typeof got !== "object" || got === null) {
    if (wrong++ < 5) fail(`getIcon("${name}") returned ${JSON.stringify(got)} instead of icon data`);
    continue;
  }
  const wantViewBox = tuple.slice(0, 4).join(" ");
  if (got.path !== tuple[4] || got.viewBox !== wantViewBox) {
    if (wrong++ < 5) {
      fail(`getIcon("${name}") does not match icon-svg/${name}.svg — dist/ is stale; run npm run build`);
    }
  }
}
if (wrong > 5) fail(`…and ${wrong - 5} more icons disagree with their sources`);

const listed = (await pack.getIconList()).map((entry) => entry.name);
for (const name of listed) {
  if (!expected.has(name)) fail(`getIconList() offers "${name}", which has no SVG source`);
}
if (listed.length !== expected.size) {
  fail(`getIconList() offers ${listed.length} icons but there are ${expected.size} SVG sources`);
}

if (problems.length) {
  console.error("❌ dist/ is not shippable:");
  for (const problem of problems.slice(0, 20)) console.error(`   - ${problem}`);
  if (problems.length > 20) console.error(`   …and ${problems.length - 20} more`);
  process.exit(1);
}

console.log(`✅ ${ENTRY_NAME} plus ${CHUNKS.length} chunks load, hashes match, and all ${expected.size} icons match their sources`);
