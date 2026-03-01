// custom-brand-icons/script/normalize-icons.mjs
// Run:
//   node script/normalize-icons.mjs [<in_dir> <out_dir>] [--clean] [--vrt]
//
// Defaults (if <in_dir> and <out_dir> omitted):
//   in_dir  = custom-brand-icons/icon-svg
//   out_dir = in_dir (in-place)
//
// Options:
//   --clean   Run SVGO -> normalize -> SVGO using script/svgo.config.mjs
//   --vrt     Create script/vrt.png using ImageMagick montage
//
// Guarantees:
// - viewBox="0 0 24 24"
// - geometry scaled to fit within MAX_GEO x MAX_GEO (aspect preserved)
// - geometry centered at (12,12)
// - paths only output, baked coordinates, no transforms
// - fill is fixed to BRAND_FILL

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import fg from "fast-glob";
import { parse, stringify } from "svgson";
import svgpath from "svgpath";
import { svgPathBbox } from "svg-path-bbox";

// -------------------- Normalization parameters --------------------
const VIEW = 24;
const MAX_GEO = 22;
const TARGET_C = VIEW / 2;

const BRAND_FILL = "#44739e";
const ROUND_DECIMALS = 3;

// Policy: filled geometry only
const ALLOW_FILL_NONE = false;

// Fail-fast attributes that violate “geometry-only” or make bbox unreliable.
// Applied to *all* nodes (svg/g/path/defs/use/etc).
const FORBIDDEN_ANY = new Set([
  "transform",
  "style",
  "class",
  "opacity",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-opacity",
  "vector-effect",
  "paint-order",
  "filter",
  "mask",
  "clip-path",
  "display",
  "visibility",
  "marker-start",
  "marker-mid",
  "marker-end",
  // References / instancing (fail fast rather than resolving)
  "href",
  "xlink:href",
]);

// Elements outright refused (because they require instancing/defs resolution)
const FORBIDDEN_ELEMS = new Set([
  "defs",
  "symbol",
  "use",
]);

// -------------------- Repo paths / defaults --------------------
const __filename = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(__filename);            // .../custom-brand-icons/script
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");       // .../custom-brand-icons
const DEFAULT_ICON_DIR = path.join(REPO_ROOT, "icon-svg");
const SVGO_CONFIG = path.join(SCRIPT_DIR, "svgo.config.mjs");

// -------------------- Helpers --------------------
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function rmDir(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dst) {
  rmDir(dst);
  ensureDir(dst);
  fs.cpSync(src, dst, { recursive: true });
}

function isSamePath(a, b) {
  const ra = path.resolve(a);
  const rb = path.resolve(b);
  return process.platform === "win32"
    ? ra.toLowerCase() === rb.toLowerCase()
    : ra === rb;
}

function mkTmp(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function normKey(k) {
  return String(k).toLowerCase();
}

function normName(n) {
  return String(n || "").toLowerCase();
}

// -------------------- CLI parsing --------------------
function parseArgs(argv) {
  const flags = new Set();
  const positional = [];

  for (const a of argv) {
    if (a === "--clean" || a === "--vrt" || a === "--help" || a === "-h") {
      flags.add(a);
    } else if (a.startsWith("--")) {
      throw new Error(`Unknown option: ${a}`);
    } else {
      positional.push(a);
    }
  }

  if (flags.has("--help") || flags.has("-h")) {
    return { help: true };
  }

  const inDir = positional[0] || DEFAULT_ICON_DIR;
  const outDir = positional[1] || inDir; // default in-place
  return {
    help: false,
    inDir,
    outDir,
    clean: flags.has("--clean"),
    vrt: flags.has("--vrt"),
  };
}

function printUsage() {
  const rel = path.relative(REPO_ROOT, DEFAULT_ICON_DIR) || "icon-svg";
  console.log(
    [
      "Usage:",
      "  node script/normalize-icons.mjs [<in_dir> <out_dir>] [--clean] [--vrt]",
      "",
      "Defaults:",
      `  in_dir  = ${rel}`,
      "  out_dir = in_dir (in-place)",
      "",
      "Options:",
      "  --clean   SVGO -> normalize -> SVGO using script/svgo.config.mjs",
      "  --vrt     Create script/vrt.png with ImageMagick montage",
      "",
    ].join("\n")
  );
}

// -------------------- External tools --------------------
function exeName(name) {
  return process.platform === "win32" ? `${name}.cmd` : name;
}

function runSvgo(inDir, outDir) {
  const local = path.join(REPO_ROOT, "node_modules", ".bin", exeName("svgo"));
  const svgoExe = fs.existsSync(local) ? local : exeName("svgo");

  ensureDir(outDir);

  const args = ["-r", "-f", inDir, "-o", outDir, "--config", SVGO_CONFIG];

  const res = spawnSync(svgoExe, args, {
    cwd: REPO_ROOT,
    stdio: "inherit",
    shell: false,
  });

  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`SVGO failed with exit code ${res.status}`);
}

function runMontage(iconDirAbs, outPngAbs) {
  const svgs = fg.sync(["*.svg"], { cwd: iconDirAbs, onlyFiles: true })
    .map((f) => path.join(iconDirAbs, f));

  if (!svgs.length) throw new Error(`No SVGs found for VRT in ${iconDirAbs}`);

  // Use montage from PATH. If you need Windows-specific exe lookup, enforce it here.
  const montageExe = "montage";

  ensureDir(path.dirname(outPngAbs));

  const args = [
    "-geometry", "+0+0",
    "-tile", "24x",
    ...svgs,
    outPngAbs,
  ];

  const res = spawnSync(montageExe, args, {
    cwd: SCRIPT_DIR,
    stdio: "inherit",
    shell: false,
  });

  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`montage failed with exit code ${res.status}`);
}

// -------------------- SVG normalization core --------------------
function assertNoForbidden(node) {
  const name = normName(node?.name);
  if (FORBIDDEN_ELEMS.has(name)) {
    throw new Error(`Forbidden element <${name}> detected (defs/use not supported).`);
  }
  const attrs = node?.attributes || {};
  for (const k of Object.keys(attrs)) {
    if (FORBIDDEN_ANY.has(normKey(k))) {
      throw new Error(`Forbidden attribute on <${name || "?"}>: ${k}`);
    }
  }
}

function collectPaths(node, out) {
  if (!node) return;
  assertNoForbidden(node);

  if (normName(node.name) === "path" && node.attributes?.d) out.push(node);

  const kids = node.children || [];
  for (const c of kids) collectPaths(c, out);
}

function isFillNone(p) {
  const v = (p.attributes?.fill ?? "").toString().trim().toLowerCase();
  return v === "none";
}

function computeAggregateBBox(paths) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let contrib = 0;

  for (const p of paths) {
    const d = String(p.attributes?.d || "").trim();
    if (!d) continue;

    if (!ALLOW_FILL_NONE && isFillNone(p)) {
      throw new Error(`fill="none" found on a path; not allowed by policy`);
    }

    const [x0, y0, x1, y1] = svgPathBbox(d);
    if (![x0, y0, x1, y1].every(Number.isFinite)) continue;

    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
    contrib++;
  }

  if (contrib === 0) {
    throw new Error("No valid path bounding box could be computed (empty/invalid d?).");
  }

  const w = maxX - minX;
  const h = maxY - minY;

  // For filled icons, zero-area geometry is invalid (would require stroke).
  if (!(w > 0 && h > 0)) {
    throw new Error(
      `Degenerate geometry (zero-area) not allowed for filled icons: width=${w}, height=${h}`
    );
  }

  return { minX, minY, maxX, maxY, w, h };
}

function normalizePathAttrs(p, newD) {
  const attrsIn = p.attributes || {};
  const fillRaw = (attrsIn.fill ?? "").toString().trim().toLowerCase();

  if (!ALLOW_FILL_NONE && fillRaw === "none") {
    throw new Error(`fill="none" not allowed by policy`);
  }

  const out = { d: newD };
  out.fill = (fillRaw === "none") ? "none" : BRAND_FILL;

  // Preserve explicit rules if present (don’t guess semantics).
  if (attrsIn["fill-rule"]) out["fill-rule"] = attrsIn["fill-rule"];
  if (attrsIn["clip-rule"]) out["clip-rule"] = attrsIn["clip-rule"];

  return out;
}

function normalizeOne(svgAst) {
  if (!svgAst || normName(svgAst.name) !== "svg") {
    throw new Error("Root is not <svg>.");
  }

  const paths = [];
  collectPaths(svgAst, paths);

  if (!paths.length) {
    throw new Error("No geometry found. Path collection returned 0 elements.");
  }

  const bb = computeAggregateBBox(paths);

  const s = Math.min(MAX_GEO / bb.w, MAX_GEO / bb.h);
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;

  const processedChildren = paths.map((p) => {
    const d0 = String(p.attributes?.d || "").trim();
    if (!d0) throw new Error("Encountered empty path d during processing.");

    const newD = svgpath(d0)
      .translate(-cx, -cy)
      .scale(s)
      .translate(TARGET_C, TARGET_C)
      .abs()
      .round(ROUND_DECIMALS)
      .toString();

    return {
      name: "path",
      type: "element",
      attributes: normalizePathAttrs(p, newD),
      children: [],
    };
  });

  return {
    name: "svg",
    type: "element",
    attributes: {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: `0 0 ${VIEW} ${VIEW}`,
    },
    children: processedChildren,
  };
}

async function normalizeDir(inDir, outDir) {
  ensureDir(outDir);

  const files = await fg(["**/*.svg"], { cwd: inDir, onlyFiles: true });
  if (!files.length) throw new Error(`No SVGs found in ${inDir}`);

  let ok = 0;
  const failures = [];

  for (const rel of files) {
    const inPath = path.join(inDir, rel);
    const outPath = path.join(outDir, rel);
    ensureDir(path.dirname(outPath));

    try {
      const xml = fs.readFileSync(inPath, "utf8");
      // lowercased: true makes element names stable for comparisons
      const ast = await parse(xml, { lowercased: true });

      const outAst = normalizeOne(ast);
      const outXml = stringify(outAst);

      fs.writeFileSync(outPath, outXml, "utf8");
      ok++;
    } catch (e) {
      failures.push({
        file: rel,
        err: String(e && e.message ? e.message : e),
      });
    }
  }

  console.log(`normalize: OK ${ok}/${files.length}`);
  if (failures.length) {
    console.log("normalize: Failures:");
    for (const f of failures) console.log(` - ${f.file}: ${f.err}`);
    throw new Error(`Normalization failed for ${failures.length} file(s).`);
  }
}

// -------------------- Main orchestration --------------------
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const inDirAbs = path.resolve(args.inDir);
  const outDirAbs = path.resolve(args.outDir);

  const temps = [];
  const inPlace = isSamePath(inDirAbs, outDirAbs);

  // Always stage final output in a temp dir when:
  // - inPlace, OR
  // - --clean (because we must avoid half-processed final dir)
  const needFinalStage = inPlace || args.clean;
  const finalStage = needFinalStage ? mkTmp("cbi-final-") : outDirAbs;
  if (needFinalStage) temps.push(finalStage);

  try {
    if (args.clean) {
      const svgo1 = mkTmp("cbi-svgo1-");
      const norm = mkTmp("cbi-norm-");
      const svgo2 = mkTmp("cbi-svgo2-");
      temps.push(svgo1, norm, svgo2);

      console.log("clean: svgo pass 1");
      runSvgo(inDirAbs, svgo1);

      console.log("clean: normalize");
      await normalizeDir(svgo1, norm);

      console.log("clean: svgo pass 2");
      runSvgo(norm, svgo2);

      console.log("clean: stage final");
      copyDir(svgo2, finalStage);
    } else {
      console.log("normalize: start");
      await normalizeDir(inDirAbs, finalStage);
    }

    // Commit stage -> outDirAbs if we staged.
    if (needFinalStage) {
      console.log("finalize: write output");
      copyDir(finalStage, outDirAbs);
    }

    if (args.vrt) {
      const vrtOut = path.join(SCRIPT_DIR, "vrt.png");
      console.log(`vrt: creating ${path.relative(REPO_ROOT, vrtOut)}`);
      runMontage(outDirAbs, vrtOut);
    }

    console.log("done");
  } finally {
    // Always clean all temps, regardless of failure point.
    for (const t of temps) rmDir(t);
  }
}

main().catch((e) => {
  console.error(e && e.message ? e.message : e);
  process.exit(1);
});
