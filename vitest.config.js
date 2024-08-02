import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["__tests__/**/*.test.ts"],
    testTimeout: 60 * 1000,
    hookTimeout: 60 * 1000,
  },
});
