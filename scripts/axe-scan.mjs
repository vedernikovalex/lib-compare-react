import { execSync } from "child_process";
import { mkdirSync } from "fs";

const date = new Date().toISOString().slice(0, 10);

const apps = [
  { name: "antd", port: 3001 },
  { name: "chakra", port: 3002 },
  { name: "mui", port: 3003 },
];

const routes = ["/", "/dashboard", "/kanban"];

const routeSlug = (route) =>
  route === "/" ? "home" : route.replace("/", "");

for (const app of apps) {
  for (const route of routes) {
    const url = `http://localhost:${app.port}${route}`;
    const outDir = `docs/results/${date}/${app.name}/axe`;
    const outFile = `${outDir}/${routeSlug(route)}.json`;

    mkdirSync(outDir, { recursive: true });

    console.log(`Scanning ${url} ...`);
    try {
      execSync(
        `npx @axe-core/cli ${url} --save ${outFile} --timeout 15000 --chromedriver-path ~/.browser-driver-manager/chromedriver/mac_arm-145.0.7632.117/chromedriver-mac-arm64/chromedriver`,
        { stdio: "inherit" }
      );
    } catch {
      // axe-core/cli exits with code 1 when violations found — not an error
    }

    console.log(`  -> saved ${outFile}\n`);
  }
}

console.log(`\nAll scans complete. Results in docs/results/${date}/`);
