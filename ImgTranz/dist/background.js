const MENU_ROOT        = "imgtranz-root";
const MENU_PNG         = "imgtranz-png";
const MENU_SVG         = "imgtranz-svg";
const MENU_WEBP_TO_PNG = "imgtranz-webp-to-png";
const MENU_KOFI        = "imgtranz-kofi";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ROOT,
      title: "ImgTranz",
      contexts: ["image"]
    });
    chrome.contextMenus.create({
      id: MENU_PNG,
      parentId: MENU_ROOT,
      title: "Extract subject → Transparent PNG",
      contexts: ["image"]
    });
    chrome.contextMenus.create({
      id: MENU_SVG,
      parentId: MENU_ROOT,
      title: "Extract subject → SVG (vector)",
      contexts: ["image"]
    });
    chrome.contextMenus.create({
      id: MENU_WEBP_TO_PNG,
      parentId: MENU_ROOT,
      title: "Convert WebP → Transparent PNG",
      contexts: ["image"]
    });
    chrome.contextMenus.create({
      id: "imgtranz-sep",
      parentId: MENU_ROOT,
      type: "separator",
      contexts: ["image"]
    });
    chrome.contextMenus.create({
      id: MENU_KOFI,
      parentId: MENU_ROOT,
      title: "☕ Made with ❤️ by PraxWow",
      contexts: ["image"]
    });
  });
});

const OFFSCREEN_URL           = "offscreen.html";
const OFFSCREEN_REASONS       = ["WORKERS", "DOM_PARSER", "BLOBS"];
const OFFSCREEN_JUSTIFICATION = "Runs on-device background removal (ONNX/WASM) and raster-to-vector (VTracer WASM) processing.";

let offscreenReady = false;

async function ensureOffscreen() {
  if (offscreenReady) return;
  try {
    const existing = await chrome.offscreen.hasDocument?.();
    if (!existing) {
      await chrome.offscreen.createDocument({
        url: OFFSCREEN_URL,
        reasons: OFFSCREEN_REASONS,
        justification: OFFSCREEN_JUSTIFICATION
      });
    }
  } catch {
    try { await chrome.offscreen.closeDocument(); } catch {}
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_URL,
      reasons: OFFSCREEN_REASONS,
      justification: OFFSCREEN_JUSTIFICATION
    });
  }
  offscreenReady = true;
}

async function sendToOffscreen(message, attempts = 6, delayMs = 80) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await chrome.runtime.sendMessage(message);
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

let queue = Promise.resolve();

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_KOFI) {
    chrome.tabs.create({ url: "https://ko-fi.com/praxwow" });
    return;
  }

  if (
    info.menuItemId !== MENU_PNG &&
    info.menuItemId !== MENU_SVG &&
    info.menuItemId !== MENU_WEBP_TO_PNG
  ) return;

  const mode = info.menuItemId === MENU_WEBP_TO_PNG
    ? "direct_png"
    : info.menuItemId === MENU_SVG
      ? "svg"
      : "png";

  queue = queue.then(() => processImage(info, tab, mode)).catch(() => {});
});

async function processImage(info, tab, mode) {
  const tabId = tab?.id;
  try {
    let srcUrl = info.srcUrl;
    if (!srcUrl && tabId != null) {
      try {
        const resp = await chrome.tabs.sendMessage(tabId, { type: "GET_FALLBACK_IMAGE" });
        srcUrl = resp?.url ?? srcUrl;
      } catch {}
    }
    if (!srcUrl) {
      sendProgressToTab(tabId, "Couldn't find an image at that location.", 100, true);
      return;
    }

    const startMsg = mode === "direct_png" ? "Converting WebP to PNG..." : "Starting conversion...";
    sendProgressToTab(tabId, startMsg, 10);
    chrome.action.setBadgeText({ text: "…" });
    chrome.action.setBadgeBackgroundColor({ color: "#3b82f6" });

    await ensureOffscreen();
    await sendToOffscreen({
      target: "offscreen",
      type: "PROCESS_IMAGE",
      payload: { srcUrl, output: mode, tabId }
    });
  } catch (err) {
    console.error("[ImgTranz] failed to start processing:", err);
    offscreenReady = false;
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    sendProgressToTab(tabId, err?.message ?? "Error starting conversion", 100, true);
  }
}

function sendProgressToTab(tabId, step, percent, isError = false) {
  if (tabId == null) return;
  chrome.tabs.sendMessage(tabId, {
    type: "IMGTRANZ_PROGRESS",
    payload: { step, percent, isError }
  }).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.target !== "background") return;

  if (msg.type === "PROGRESS_UPDATE") {
    const { tabId, step, percent } = msg.payload || {};
    if (percent != null) {
      chrome.action.setBadgeText({ text: `${Math.round(percent)}%` });
    }
    sendProgressToTab(tabId, step, percent);
  }

  if (msg.type === "DOWNLOAD") {
    const { dataUrl, filename } = msg.payload || {};
    if (dataUrl) {
      chrome.downloads.download({
        url: dataUrl,
        filename: filename || `imgtranz-${Date.now()}.png`,
        saveAs: false
      });
    }
  }

  if (msg.type === "PROCESS_DONE") {
    const { tabId } = msg.payload || {};
    chrome.action.setBadgeText({ text: "✓" });
    chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
    setTimeout(() => chrome.action.setBadgeText({ text: "" }), 3000);
    sendProgressToTab(tabId, "Done! File downloaded.", 100);
  }

  if (msg.type === "PROCESS_ERROR") {
    const { tabId, message } = msg.payload || {};
    console.error("[ImgTranz] processing error:", message);
    offscreenReady = false;
    chrome.action.setBadgeText({ text: "!" });
    chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
    sendProgressToTab(tabId, message ?? "Processing failed", 100, true);
  }
});
