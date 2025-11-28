const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "icon-svg");
const DIST_DIR = path.join(__dirname, "dist");
if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR);


function extractPath(svgContent) {
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]+)"/);
  return pathMatch ? pathMatch[1] : "";
}


const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith(".svg"));

let output = "const icons = {\n";

files.forEach(file => {
  const name = path.basename(file, ".svg");
  const svgContent = fs.readFileSync(path.join(ICONS_DIR, file), "utf8");
  const pathData = extractPath(svgContent);

  output += `  "${name}":[0,0,24,24,"${pathData}"],\n`;
});

output += "};\n\n";


output += `
async function getIcon(name) {
  if (!(name in icons)) {
    console.log(\`Icon "\${name}" not available\`);
    return '';
  }

  const svgDef = icons[name];

  return {
    path: svgDef[4],
    viewBox: "0 0 24 24"
  };
}

async function getIconList() {
  return Object.entries(icons).map(([name]) => ({ name }));
}

window.customIconsets = window.customIconsets || {};
window.customIconsets["phu"] = getIcon;

window.customIcons = window.customIcons || {};
window.customIcons["phu"] = { getIcon, getIconList };

// Compatibilità extra (opzionale)
Object.entries(icons).forEach(([name, values]) => {
  window.customIcons["phu"][name] = values;
});
`;

fs.writeFileSync(path.join(DIST_DIR, "custom-brand-icons.js"), output);

console.log("✅ Build completed");
console.log("📁 Generated file: dist/custom-brand-icons.js");
console.log("🔢 Total icons:", files.length);

