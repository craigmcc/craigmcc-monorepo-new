import { reactBase } from "@repo/vitest-config";
import { defineConfig } from "vitest/config";

const baseTest = ((reactBase as unknown) as { test?: Record<string, unknown> }).test;

export default defineConfig({
  ...reactBase,
  test: {
    ...(baseTest || {}),
    include: ["src/**/*.test.{ts,tsx}"],
  },
});

