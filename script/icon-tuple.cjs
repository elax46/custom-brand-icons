// custom-brand-icons/script/icon-tuple.cjs
//
// The one definition of how an SVG source becomes the [x, y, w, h, path] tuple
// the pack ships. The builder writes tuples with this; verify-dist re-derives
// them from icon-svg/ and compares, which is only a real check as long as both
// sides read the format from here.

const PATH_RE = /<path[^>]*d="([^"]+)"/;
const VIEWBOX_RE = /<svg.+?viewBox="([^"]+)"/;
const DEFAULT_VIEWBOX = [0, 0, 24, 24];

function iconTuple(svgContent) {
  const viewBoxMatch = svgContent.match(VIEWBOX_RE);
  let viewBox = DEFAULT_VIEWBOX;
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
    if (parts.length !== 4 || !parts.every(Number.isFinite)) {
      throw new Error(`Invalid viewBox: "${viewBoxMatch[1]}"`);
    }
    viewBox = parts;
  }

  const pathMatch = svgContent.match(PATH_RE);
  if (!pathMatch) {
    throw new Error("no <path d=…> to take the icon from");
  }

  return [...viewBox, pathMatch[1]];
}

// Escape non-ASCII so a file holding this decodes the same as UTF-8 or as
// whatever a classic script's document charset happens to be.
function asciiJSON(value) {
  return JSON.stringify(value).replace(/[\u0080-\uffff]/g, (c) =>
    "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0")
  );
}

function iconLine(name, tuple) {
  return `  ${asciiJSON(name)}:[${tuple.slice(0, 4).join(",")},${asciiJSON(tuple[4])}],\n`;
}

module.exports = { iconTuple, iconLine, asciiJSON };
