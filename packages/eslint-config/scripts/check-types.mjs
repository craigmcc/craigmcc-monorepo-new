import { spawnSync } from "node:child_process";

// Validate syntax of exported config modules in this package.
const files = ["base.js", "next.js", "react-library.js"];

for (const file of files) {
  // Use Node's parser directly so this stays dependency-light.
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });
  // Fail fast so CI output points at the first broken file.
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}


