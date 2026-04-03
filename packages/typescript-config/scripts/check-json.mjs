import { readFileSync } from "node:fs";

// Keep this list aligned with the exported tsconfig files in package.json.
const files = ["base.json", "nextjs.json", "node.json", "react-library.json"];

for (const file of files) {
  // Parse-only validation: ensures JSON is well-formed.
  JSON.parse(readFileSync(file, "utf8"));
}


