import { reactBase } from "@repo/vitest-config";
import { defineConfig } from "vitest/config";

const baseTest = (reactBase as { test?: Record<string, unknown> }).test;

export default defineConfig({
  ...reactBase,
  test: {
    ...(baseTest || {}),
    include: ["test/**/*.test.{ts,tsx}"],
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
});

