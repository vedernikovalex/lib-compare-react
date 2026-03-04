import { readFileSync } from "fs";

const ROOT = "/Users/alexandervedernikov/Documents/Personal/lib-compare-react/";

function extractData(file) {
  const html = readFileSync("docs/bundles/" + file + ".html", "utf8");
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  for (const s of scripts) {
    const m = s[1].match(/const data = ({[\s\S]*?});\s*$/m);
    if (m) return JSON.parse(m[1]);
  }
  return null;
}

function categorize(id) {
  const path = id.replace(ROOT, "").replace(/^\0/, "");
  if (path.startsWith("vite/") || path.startsWith("commonjsHelpers"))
    return "vite/runtime";
  if (path.includes("node_modules")) {
    const nm = path.split("node_modules/")[1];
    const parts = nm.split("/");
    // scoped package e.g. @mui/material
    const pkg = parts[0].startsWith("@") ? parts[0] + "/" + parts[1] : parts[0];
    return pkg;
  }
  if (path.includes("packages/shared")) return "[shared]";
  if (path.includes("apps/")) return "[app code]";
  return "[other]";
}

function analyze(file) {
  const data = extractData(file);
  const groups = {};

  for (const [metaUid, meta] of Object.entries(data.nodeMetas)) {
    const category = categorize(meta.id);
    if (!groups[category]) groups[category] = { rendered: 0, gzip: 0 };
    for (const partUid of Object.values(meta.moduleParts)) {
      const part = data.nodeParts[partUid];
      if (part) {
        groups[category].rendered += part.renderedLength || 0;
        groups[category].gzip += part.gzipLength || 0;
      }
    }
  }

  const total = Object.values(groups).reduce(
    (acc, g) => ({
      rendered: acc.rendered + g.rendered,
      gzip: acc.gzip + g.gzip,
    }),
    { rendered: 0, gzip: 0 },
  );

  const sorted = Object.entries(groups)
    .sort((a, b) => b[1].rendered - a[1].rendered)
    .filter(([, v]) => v.rendered > 1000);

  return { total, sorted };
}

// Top packages to highlight per app
const UI_PKG = {
  antd: ["antd", "@ant-design/icons-svg", "@ant-design/icons", "rc-"],
  chakra: ["@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion"],
  mui: ["@mui/material", "@mui/system", "@mui/utils", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
};

for (const [app, file] of [["AntD", "antd"], ["Chakra", "chakra"], ["MUI", "mui"]]) {
  const { total, sorted } = analyze(file);
  const kb = (b) => (b / 1024).toFixed(1).padStart(8);

  console.log("\n" + "=".repeat(60));
  console.log("  " + app);
  console.log("=".repeat(60));
  console.log(
    "  TOTAL".padEnd(42) +
      kb(total.rendered) +
      " kB  " +
      kb(total.gzip) +
      " kB (gzip)",
  );
  console.log("-".repeat(60));
  console.log("  Module / package".padEnd(42) + "  Parsed    Gzip");
  console.log("-".repeat(60));

  // group rc-* packages together for AntD
  const merged = {};
  for (const [name, sizes] of sorted) {
    const key = name.startsWith("rc-") ? "rc-* (AntD internals)" : name;
    if (!merged[key]) merged[key] = { rendered: 0, gzip: 0 };
    merged[key].rendered += sizes.rendered;
    merged[key].gzip += sizes.gzip;
  }

  for (const [name, sizes] of Object.entries(merged).sort(
    (a, b) => b[1].rendered - a[1].rendered,
  )) {
    const pct = ((sizes.rendered / total.rendered) * 100).toFixed(1).padStart(5);
    console.log(
      ("  " + name).padEnd(42) +
        kb(sizes.rendered) +
        " kB  " +
        kb(sizes.gzip) +
        " kB  " +
        pct +
        "%",
    );
  }
}
