// script/svgo.config.mjs

const inlineUseFromDefs = {
  name: "inlineUseFromDefs",
  description: "Inline <use href=\"#id\"> that references <defs><path id=\"id\">",
  fn: () => {
    // Track when we are inside <defs> without needing parent chain.
    let defsDepth = 0;

    // Collect <path id=... d=...> under defs.
    const defsPaths = new Map();

    const enterElement = (node, parentNode) => {
      const name = node.name;

      if (name === "defs") {
        defsDepth += 1;
        return;
      }

      // Collect defs paths
      if (defsDepth > 0 && name === "path") {
        const a = node.attributes || {};
        if (a.id && a.d) defsPaths.set(String(a.id), String(a.d));
        return;
      }

      // Inline uses outside defs only
      if (defsDepth === 0 && name === "use" && parentNode) {
        const a = node.attributes || {};
        const href = a.href || a["xlink:href"];
        if (typeof href !== "string" || !href.startsWith("#")) return;

        // Only allow the simplest <use> forms (no placement or transforms)
        const forbidden = ["x", "y", "width", "height", "transform"];
        for (const k of forbidden) {
          if (a[k] != null) return;
        }

        const id = href.slice(1);
        const d = defsPaths.get(id);
        if (!d) return;

        // Replace <use> with <path>
        const replacement = {
          type: "element",
          name: "path",
          attributes: {
            d,
            ...(a.fill ? { fill: a.fill } : {}),
            ...(a["fill-rule"] ? { "fill-rule": a["fill-rule"] } : {}),
            ...(a["clip-rule"] ? { "clip-rule": a["clip-rule"] } : {}),
          },
          children: [],
        };

        const kids = parentNode.children || [];
        const idx = kids.indexOf(node);
        if (idx >= 0) kids[idx] = replacement;
      }
    };

    const exitElement = (node) => {
      if (node.name === "defs") defsDepth -= 1;
    };

    return {
      element: {
        enter: enterElement,
        exit: exitElement,
      },
    };
  },
};

export default {
  multipass: true,
  floatPrecision: 3,
  plugins: [
    { name: "cleanupAttrs" },
    { name: "removeDoctype" },
    { name: "removeXMLProcInst" },
    { name: "removeComments" },
    { name: "removeMetadata" },
    { name: "removeTitle" },
    { name: "removeDesc" },
    { name: "removeEditorsNSData" },

    // Turn styles into attrs first so we can strip them deterministically.
    { name: "minifyStyles" },
    { name: "convertStyleToAttrs" },

    // Keep geometry conversions early
    { name: "convertTransform" },
    { name: "convertShapeToPath" },
    { name: "convertPathData" },

    // Inline <use> before we remove href/xlink:href and before defs cleanup.
    inlineUseFromDefs,

    // Now strip unwanted semantics.
    {
      name: "removeAttrs",
      params: {
        attrs: [
          "class",
          "style",

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

          "clip-path",
          "mask",
          "filter",

          // After inlining, refs are useless. Remove them now.
          "href",
          "xlink:href",

          // Illustrator loves overflow on <use>
          "overflow",
        ],
      },
    },

    // With <use> inlined, defs often become unused -> removable.
    { name: "removeUselessDefs" },

    { name: "removeEmptyAttrs" },
    { name: "removeHiddenElems" },
    { name: "removeEmptyText" },
    { name: "cleanupEnableBackground" },

    { name: "convertColors" },
    { name: "removeUnknownsAndDefaults" },
    { name: "removeNonInheritableGroupAttrs" },
    {
      name: "removeUselessStrokeAndFill",
      params: { removeNone: true },
    },

    { name: "removeUnusedNS" },
    { name: "cleanupIds" },
    { name: "cleanupNumericValues" },
    { name: "cleanupListOfValues" },

    { name: "moveElemsAttrsToGroup" },
    { name: "moveGroupAttrsToElems" },
    { name: "collapseGroups" },
    { name: "mergePaths" },
    { name: "sortAttrs" },

    { name: "removeDimensions" },
    { name: "removeStyleElement" },
    { name: "removeScripts" },
    { name: "removeRasterImages" },
    { name: "removeEmptyContainers" },
  ],
};
