import { convertPixels } from "./assets/vtracer.js";

// Eagerly import dependencies
let ortModulePromise = import("./assets/ort.min-CPnt1UZA.js");
let bgRemovalPromise = import("./assets/index-BpfW_F5b.js").then(async (mod) => {
  if (mod.__tla) await mod.__tla;
  return mod;
});
let vtracerReadyPromise = import("./assets/vtracer.js");

function postProgress(id, step, percent) {
  window.parent.postMessage({ id, type: "PROCESS_PROGRESS", step, percent }, "*");
}

window.addEventListener("message", async (event) => {
  const { id, type, payload } = event.data || {};
  if (type !== "PROCESS_SANDBOX" || !id) return;

  try {
    const { sourceBlob, output, ortWasmDir } = payload;

    postProgress(id, "Initializing AI models...", 12);

    const ort = (await ortModulePromise).default;
    if (ortWasmDir && ort?.env?.wasm) {
      try { Object.defineProperty(ort.env.wasm, "wasmPaths",  { configurable: true, get: () => ortWasmDir, set() {} }); } catch {}
      try { Object.defineProperty(ort.env.wasm, "numThreads", { configurable: true, get: () => 1, set() {} }); } catch {}
      ort.env.debug    = false;
      ort.env.logLevel = "error";
    }

    let currentPct = 20;
    postProgress(id, "AI extracting subject...", currentPct);
    const progressTimer = setInterval(() => {
      if (currentPct < 85) {
        currentPct += currentPct < 55 ? 4 : currentPct < 75 ? 2 : 1;
        postProgress(id, "AI extracting subject...", currentPct);
      }
    }, 180);

    const { removeBackground } = await bgRemovalPromise;
    const cutoutBlob = await removeBackground(sourceBlob, {
      model: "medium",
      output: { format: "image/png", quality: 1 }
    });

    clearInterval(progressTimer);

    if (output === "png") {
      postProgress(id, "Finalizing PNG download...", 96);
      window.parent.postMessage({ id, ok: true, cutoutBlob, output: "png" }, "*");
    } else {
      postProgress(id, "Tracing vector paths with VTracer...", 88);
      const cutBmp = await createImageBitmap(cutoutBlob);
      const w = cutBmp.width;
      const h = cutBmp.height;
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(cutBmp, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);

      const svgString = await traceCleanCutout(imgData, w, h);
      postProgress(id, "Finalizing SVG...", 98);
      window.parent.postMessage({ id, ok: true, svgString, output: "svg" }, "*");
    }
  } catch (err) {
    console.error("[ImgTranz Sandbox] Error:", err);
    window.parent.postMessage({ id, ok: false, error: err?.message ?? String(err) }, "*");
  }
});

// ─────────────────────────────────────────────────────────────
// denoiseForVector (Edge-preserving bilateral color smoother)
// ─────────────────────────────────────────────────────────────
function denoiseForVector(imgData, w, h) {
  const src = imgData.data;
  const out = new Uint8ClampedArray(src.length);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a   = src[idx + 3];

      if (a < 70) { out[idx+3] = 0; continue; }

      const r = src[idx], g = src[idx+1], b = src[idx+2];
      let sumR = r, sumG = g, sumB = b, cnt = 1;

      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const ni = (ny * w + nx) * 4;
          if (src[ni+3] < 70) continue;
          const nr = src[ni], ng = src[ni+1], nb = src[ni+2];
          const d2 = (r-nr)*(r-nr) + (g-ng)*(g-ng) + (b-nb)*(b-nb);
          if (d2 < 576) { // 24² threshold: preserves exact brand hues while removing noise
            sumR += nr; sumG += ng; sumB += nb; cnt++;
          }
        }
      }

      out[idx]   = (sumR / cnt + 0.5) | 0;
      out[idx+1] = (sumG / cnt + 0.5) | 0;
      out[idx+2] = (sumB / cnt + 0.5) | 0;
      out[idx+3] = 255;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────
// traceCleanCutout (VTracer WASM with High Color Precision)
// ─────────────────────────────────────────────────────────────
async function traceCleanCutout(imgData, origWidth, origHeight) {
  const MAX_DIM = 1200;
  let w = origWidth, h = origHeight;
  let data = imgData;

  if (w > MAX_DIM || h > MAX_DIM) {
    const scale = MAX_DIM / Math.max(w, h);
    w = Math.round(w * scale);
    h = Math.round(h * scale);
    const tmp = new OffscreenCanvas(w, h);
    const ctx = tmp.getContext("2d");
    const full = new OffscreenCanvas(origWidth, origHeight);
    full.getContext("2d").putImageData(imgData, 0, 0);
    ctx.drawImage(full, 0, 0, w, h);
    data = ctx.getImageData(0, 0, w, h);
  }

  const cleanData = denoiseForVector(data, w, h);

  return await convertPixels(cleanData, w, h, {
    preset:          "poster",
    clustering:      "color-cluster",
    hierarchical:    "stacked",
    mode:            "spline",
    colorPrecision:  7,    // High color precision: keeps vibrant distinct hues
    layerDifference: 10,   // Low layer difference: cleanly separates nearby colors
    filterSpeckle:   4,    // Keeps small crisp dots (like VAIO dots)
    cornerThreshold: 55,   // Sharp corners on typography and logos
    lengthThreshold: 3.5,  // Smooth continuous curves
    spliceThreshold: 40,
    maxIterations:   8,
    pathPrecision:   4
  });
}

window.parent.postMessage({ type: "SANDBOX_READY" }, "*");
