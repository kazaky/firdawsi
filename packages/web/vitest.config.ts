import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@firdawsi/geometry": fileURLToPath(new URL("../geometry/src/index.ts", import.meta.url)),
      "@firdawsi/tokens": fileURLToPath(new URL("../tokens/src/index.ts", import.meta.url)),
      "@firdawsi/tokens/css": fileURLToPath(new URL("../tokens/generated/tokens.css", import.meta.url)),
      "@firdawsi/shape": fileURLToPath(new URL("../shape/src/index.ts", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
