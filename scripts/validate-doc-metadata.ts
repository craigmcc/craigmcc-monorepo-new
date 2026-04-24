import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as url from "node:url";

import { parseComponentMeta } from "@repo/docs-schema";

const args = new Set(process.argv.slice(2));
const app = args.has("--app") ? process.argv[process.argv.indexOf("--app") + 1] : undefined;

if (app !== "daisy-ui-docs") {
  throw new Error("Only --app daisy-ui-docs is supported in the initial scaffold.");
}

const scriptDir = path.dirname(url.fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const metaDir = path.join(rootDir, "apps/daisy-ui-docs/src/content/meta");

async function main() {
  const files = (await fs.readdir(metaDir)).filter((entry) => entry.endsWith(".json"));

  for (const file of files) {
    const fullPath = path.join(metaDir, file);
    const raw = await fs.readFile(fullPath, "utf8");
    parseComponentMeta(JSON.parse(raw));
  }

  // eslint-disable-next-line no-console
  console.log(`Validated ${files.length} metadata files in ${metaDir}`);
}

void main();

