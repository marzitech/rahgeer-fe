import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests for the pure logic under lib/.
 *
 * Node environment, no DOM: what goes wrong on this site is not whether a
 * heading renders, it is the content layer — a backend that is down, a
 * field that arrived empty, a shape that changed. Those are pure
 * functions, and they are what stands between an API hiccup and a blank
 * home page.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
});
