console.log("[ImgTranz] offscreen document starting");

window.addEventListener("error",            e => console.error("[ImgTranz] uncaught:", e.error || e.message));
window.addEventListener("unhandledrejection",e => console.error("[ImgTranz] unhandled rejection:", e.reason));

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

async function getImageBlob(srcUrl, tabId) {
  if (srcUrl.startsWith("data:")) {
    return dataUrlToBlob(srcUrl);
  }

  try {
    const resp = await fetch(srcUrl);
    if (resp.ok) return await resp.blob();
  } catch (err) {
    console.warn("[ImgTranz] Direct fetch failed, trying tab fallback:", err);
  }

  if (tabId != null) {
    try {
      const resp = await chrome.tabs.sendMessage(tabId, { type: "GET_IMAGE_DATA_URL", url: srcUrl });
      if (resp?.dataUrl) {
        return dataUrlToBlob(resp.dataUrl);
      }
    } catch {}
  }

  throw new Error("Failed to load image from URL");
}

async function convertWebPToPng(sourceBlob) {
  const bmp = await createImageBitmap(sourceBlob);
  const canvas = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bmp, 0, 0);
  return await canvas.convertToBlob({ type: "image/png" });
}

function sendToSandbox(payload, onProgress) {
  return new Promise((resolve, reject) => {
    const iframe = document.getElementById("sandbox");
    if (!iframe?.contentWindow) return reject(new Error("Sandbox iframe not ready"));

    const messageId = Math.random().toString(36).slice(2) + Date.now();
    const timer = setTimeout(() => {
      window.removeEventListener("message", onMsg);
      reject(new Error("Sandbox processing timed out (3 min)"));
    }, 180_000);

    function onMsg(ev) {
      if (ev.data?.id !== messageId) return;
      if (ev.data?.type === "PROCESS_PROGRESS") { onProgress?.(ev.data.step, ev.data.percent); return; }
      clearTimeout(timer);
      window.removeEventListener("message", onMsg);
      ev.data.ok ? resolve(ev.data) : reject(new Error(ev.data.error || "Sandbox failed"));
    }

    window.addEventListener("message", onMsg);
    iframe.contentWindow.postMessage(
      { id: messageId, type: "PROCESS_SANDBOX", payload: { ...payload, ortWasmDir: chrome.runtime.getURL("ort/") } },
      "*"
    );
  });
}

function notifyProgress(tabId, step, percent) {
  chrome.runtime.sendMessage({ target: "background", type: "PROGRESS_UPDATE", payload: { tabId, step, percent } }).catch(() => {});
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg?.target !== "offscreen" || msg.type !== "PROCESS_IMAGE") return;
  handle(msg.payload)
    .then(() => reply({ ok: true }))
    .catch(err => {
      console.error("[ImgTranz] processing failed:", err);
      chrome.runtime.sendMessage({ target: "background", type: "PROCESS_ERROR", payload: { message: err?.message ?? String(err), tabId: msg.payload?.tabId } });
      reply({ ok: false, error: String(err) });
    });
  return true;
});

async function handle({ srcUrl, output, tabId }) {
  notifyProgress(tabId, "Fetching image...", 15);

  const sourceBlob = await getImageBlob(srcUrl, tabId);

  if (output === "direct_png") {
    notifyProgress(tabId, "Converting to PNG...", 70);
    const pngBlob = await convertWebPToPng(sourceBlob);
    await downloadBlob(pngBlob, "png", tabId);
  } else {
    const res = await sendToSandbox(
      { sourceBlob, output },
      (step, pct) => notifyProgress(tabId, step, pct)
    );

    if (res.output === "png") {
      await downloadBlob(res.cutoutBlob, "png", tabId);
    } else {
      await downloadBlob(new Blob([res.svgString], { type: "image/svg+xml" }), "svg", tabId);
    }
  }

  notifyProgress(tabId, "Done! File downloaded.", 100);
  chrome.runtime.sendMessage({ target: "background", type: "PROCESS_DONE", payload: { tabId } });
}

async function downloadBlob(blob, ext, tabId) {
  const dataUrl = await blobToDataUrl(blob);
  await chrome.runtime.sendMessage({
    target: "background",
    type: "DOWNLOAD",
    payload: { dataUrl, filename: `imgtranz-${Date.now()}.${ext}`, tabId }
  });
}

async function blobToDataUrl(blob) {
  try {
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return `data:${blob.type};base64,${btoa(binary)}`;
  } catch {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onloadend = () => res(r.result);
      r.onerror   = rej;
      r.readAsDataURL(blob);
    });
  }
}

const _ = a => a();
const __tla = Promise.resolve();
export { _, __tla };
