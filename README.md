# ImgTranz
100% on-device, privacy-first Chrome Extension for instant background cutout (PNG), SVG vector tracing (WASM), and WebP to PNG conversion directly from your right-click menu.
---
## 🚀 Overview
**ImgTranz** is a lightweight, ultra-fast Chrome extension that brings professional background removal, high-precision SVG vector tracing, and lossless image conversion directly into your browser's right-click context menu.
Unlike other tools that upload your images to third-party cloud servers, **ImgTranz runs 100% locally on your machine** using WebAssembly (WASM) and on-device neural acceleration. Zero bandwidth used, zero data uploaded, and 100% private.
---
## ✨ Features
- ✂️ **Instant Subject Cutout → Transparent PNG**
  - High-accuracy AI subject segmentation with flawless edge detection.
  - Perfect color preservation for logos, icons, graphic art, products, and photos.
- ⚡ **Raster to Clean Vector → Scalable SVG**
  - Powered by **VTracer WASM** (high-speed Rust-compiled vectorizer).
  - Generates smooth, organic cubic Bézier spline paths with high color fidelity.
- 🔄 **Convert WebP → Transparent PNG**
  - Direct, lossless alpha-preserving conversion in **under 100ms**.
  - Say goodbye to unsupported WebP format headaches.
- 🔒 **100% Private & Fully Offline**
  - No API keys, no subscription tiers, no accounts, and no telemetry.
  - All processing is isolated inside Chrome's sandboxed offscreen environment.
- 🎨 **Minimal & Modern UI**
  - Seamless right-click integration.
  - Non-intrusive in-page floating progress bar toast.
  - Compact dark navy popup.
---
## 🖱️ Context Menu Workflow
Simply right-click any image on the web:
ImgTranz ├── Extract subject → Transparent PNG (Full color & detail preservation) ├── Extract subject → SVG (vector) (Crisp high-precision spline curves) ├── Convert WebP → Transparent PNG (Instant lossless alpha conversion) ─────────────────────────────────────── └── ☕ Made with ❤️ by PraxWow



---
## 🛠️ Tech Stack & Architecture
- **Manifest V3 Architecture**: Service Worker background script with an Offscreen Document bridge to bypass service worker DOM/Canvas limitations.
- **AI Inference**: On-device neural segmentation engine running client-side via ONNX Runtime Web and WebAssembly.
- **Vectorization Engine**: VTracer (Rust compiled to WebAssembly) utilizing cubic Bézier curves and color-clustering algorithms.
- **Sandboxed Security**: Deep processing runs inside an isolated sandbox page (`allow-scripts`) with strict Content Security Policy (CSP).
---
## 📦 Installation (Developer / Unpacked Mode)
1. Clone or download this repository:
   ```bash
   git clone https://github.com/praxwow/imgtranz.git
Open Google Chrome and navigate to:
chrome://extensions/
Enable Developer mode toggle in the top-right corner.
Click Load unpacked and select the dist/ directory inside this repo.
ImgTranz is ready to use! Right-click any image to try it out.
☕ Support the Project
ImgTranz is free, open-source, and created with passion. If you find it helpful in your daily workflow, consider buying me a coffee:

Buy Me a Coffee

Support PraxWow on Ko-fi
