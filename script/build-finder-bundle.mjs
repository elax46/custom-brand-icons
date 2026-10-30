#!/usr/bin/env node
// custom-brand-icons/script/build-finder-bundle.mjs
// Run:
//   node script/build-finder-bundle.mjs [<out_file>]   (default: stdout)
//
// The icon finder page loads the pack as a classic script and reads a global
// `icons` object synchronously, which the chunked entry cannot provide. This
// re-assembles the single-file form the finder expects out of the chunks in
// dist/ -- so what the finder serves is the same icon data the release ships,
// rather than a second build from a second source.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST_DIR = path.join(REPO_ROOT, "dist");
const ENTRY_NAME = "custom-brand-icons.js";

const entryPath = path.join(DIST_DIR, ENTRY_NAME);
if (!fs.existsSync(entryPath)) {
  console.error(`❌ ${path.relative(REPO_ROOT, entryPath)} not found. Run: npm run build`);
  process.exit(1);
}

// Take the chunk order from the entry rather than from the directory listing,
// so the assembled file keeps the pack's own ordering.
const context = vm.createContext({ window: {}, console, URL });
new vm.Script(fs.readFileSync(entryPath, "utf8"), { filename: ENTRY_NAME })
  .runInContext(context, { timeout: 10000 });
const { CHUNKS } = context;
if (!Array.isArray(CHUNKS) || CHUNKS.length === 0) {
  console.error(`❌ ${ENTRY_NAME} lists no chunks; it was not produced by the current builder.`);
  process.exit(1);
}

const lines = CHUNKS.map((specifier) => {
  const file = path.join(DIST_DIR, specifier.split("?")[0]);
  const body = fs.readFileSync(file, "utf8");
  const inner = body.replace(/^export default \{\n/, "").replace(/\};\n$/, "");
  if (inner === body) {
    console.error(`❌ ${path.basename(file)} is not a chunk this script can unwrap.`);
    process.exit(1);
  }
  return inner;
}).join("");

// The pre-chunking shape, which is what the finder page was written against.
const bundle = `var icons = {
${lines}};


async function getIcon(name) {
  if (!(name in icons)) {
    console.log(\`Icon "\${name}" not available\`);
    return '';
  }

  var svgDef = icons[name];
  var primaryPath = svgDef[4];
  return {
    path: primaryPath,
    viewBox: svgDef[0] + " " + svgDef[1] + " " + svgDef[2] + " " + svgDef[3]
  }
}

async function getIconList() {
  return Object.entries(icons).map(([icon]) => ({
    name: icon
  }));
}

window.customIconsets = window.customIconsets || {};
window.customIconsets["phu"] = getIcon;

window.customIcons = window.customIcons || {};
window.customIcons["phu"] = { getIcon, getIconList };
`;

const outFile = process.argv[2];
if (outFile) {
  fs.writeFileSync(outFile, bundle);
  const kb = (Buffer.byteLength(bundle) / 1024).toFixed(1);
  console.log(`✅ ${outFile}: ${CHUNKS.length} chunks assembled, ${kb} KB`);
} else {
  process.stdout.write(bundle);
}
