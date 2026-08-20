// No-op by default: local mode fetches segmentation model weights from
// IMG.LY's free CDN at runtime (see src/offscreen/offscreen.js), so nothing
// needs to be copied at build time.
//
// To make local mode fully offline (zero network calls after install):
//   1. npm install @imgly/background-removal-data
//   2. Copy the "small" (or "medium") model folder from that package into
//      public/models/
//   3. In src/offscreen/offscreen.js, add:
//        publicPath: chrome.runtime.getURL("models/")
//      to the removeBackground() options object.
//   4. Re-add "models/*" to web_accessible_resources in public/manifest.json.
// Heads up: even the smallest model is tens of MB, which will noticeably
// grow the .zip you upload to the Chrome Web Store.
console.log("[copy-models] local mode uses IMG.LY's CDN by default — nothing to copy.");
