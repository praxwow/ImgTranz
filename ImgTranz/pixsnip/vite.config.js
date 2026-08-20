import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, copyFileSync, mkdirSync, cpSync, existsSync } from "fs";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Copies the extension's static, non-bundled files into dist/ after Vite
// finishes bundling the JS/WASM entry points.
function copyStaticFiles() {
  return {
    name: "copy-static-files",
    closeBundle() {
      const out = resolve(__dirname, "dist");
      mkdirSync(out, { recursive: true });
      copyFileSync(resolve(__dirname, "public/manifest.json"), resolve(out, "manifest.json"));
      copyFileSync(resolve(__dirname, "src/background/background.js"), resolve(out, "background.js"));
      copyFileSync(resolve(__dirname, "src/content/content.js"), resolve(out, "content.js"));
      if (existsSync(resolve(__dirname, "public/icons"))) {
        cpSync(resolve(__dirname, "public/icons"), resolve(out, "icons"), { recursive: true });
      }
    }
  };
}

export default defineConfig({
  plugins: [wasm(), topLevelAwait(), copyStaticFiles()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "esnext",
    modulePreload: false,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
        offscreen: resolve(__dirname, "offscreen.html"),
        sandbox: resolve(__dirname, "sandbox.html")
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  }
});
