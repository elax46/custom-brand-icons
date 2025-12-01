const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "icon-svg");
const DIST_DIR = path.join(__dirname, "dist");
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);

function extractPath(svgContent) {
  const m = svgContent.match(/<path[^>]*d="([^"]+)"/);
  return m ? m[1] : "";
}

const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith(".svg"));

let output = "var icons = {\n";

files.forEach(file => {
  const name = path.basename(file, ".svg");
  const svgContent = fs.readFileSync(path.join(ICONS_DIR, file), "utf8");
  const pathData = extractPath(svgContent);

  output += `  "${name}":[0,0,24,24,${JSON.stringify(pathData)}],\n`;
});

output += "};\n\n";

output += `
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

fs.writeFileSync(path.join(DIST_DIR, "custom-brand-icons.js"), output);

console.log("✅ Build completed");
console.log("📁 Generated file: dist/custom-brand-icons.js");
console.log("🔢 Total icons:", files.length);


