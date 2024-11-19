/// <reference types="vitest" />
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    wasm(),
    topLevelAwait()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  base: "/",
  assetsInclude: "**/*.obj"
})
