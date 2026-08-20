let lastTarget = null;
document.addEventListener("contextmenu", e => { lastTarget = e.target; }, true);

function extractBackgroundImageUrl(el) {
  let node = el;
  while (node && node !== document.body) {
    const bg = getComputedStyle(node).backgroundImage;
    const m  = bg?.match(/url\(["']?(.*?)["']?\)/);
    if (m?.[1]) return new URL(m[1], location.href).href;
    node = node.parentElement;
  }
  return null;
}

// ── Floating Progress Toast (Shadow DOM, never conflicts with page CSS) ──
let toastHost = null, toastShadow = null, toastTimeout = null;

function ensureToast() {
  if (toastHost && document.body.contains(toastHost)) return;
  toastHost = Object.assign(document.createElement("div"), {
    id: "imgtranz-progress-host"
  });
  Object.assign(toastHost.style, {
    position: "fixed", bottom: "24px", right: "24px",
    zIndex: "2147483647", pointerEvents: "none",
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
  });

  const iconUrl = chrome.runtime.getURL("icons/icon48.png");

  toastShadow = toastHost.attachShadow({ mode: "open" });
  toastShadow.innerHTML = `
<style>
.card{
  pointer-events:auto;width:310px;background:#0f1623;
  border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 16px;
  box-shadow:0 14px 36px rgba(0,0,0,.65);color:#f1f5f9;
  animation:slideIn .28s cubic-bezier(.16,1,.3,1);
  transition:opacity .3s,transform .3s,border-color .3s;
}
@keyframes slideIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.hd{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.logo-img{width:26px;height:26px;border-radius:6px;flex-shrink:0;object-fit:cover;display:block}
.title{font-size:13.5px;font-weight:700;flex-grow:1;color:#f8fafc;letter-spacing:-0.2px}
.pct{font-size:12.5px;font-weight:700;color:#38bdf8}
.msg{font-size:11.5px;color:#8a99b3;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.track{width:100%;height:5px;background:#141c2e;border-radius:999px;overflow:hidden}
.bar{height:100%;width:0%;background:linear-gradient(90deg,#38bdf8,#818cf8);border-radius:999px;transition:width .22s ease-out}
.err{border-color:#ef4444}.err .bar{background:#ef4444}.err .msg{color:#f87171}.err .pct{color:#ef4444}
.done .bar{background:#22c55e}.done .pct{color:#22c55e}
</style>
<div class="card" id="card">
  <div class="hd">
    <img class="logo-img" id="logo" src="${iconUrl}" alt="ImgTranz" />
    <div class="title">ImgTranz</div>
    <div class="pct" id="pct">0%</div>
  </div>
  <div class="msg" id="msg">Starting...</div>
  <div class="track"><div class="bar" id="bar"></div></div>
</div>`;
  document.body.appendChild(toastHost);
}

function updateProgress(step, percent, isError = false) {
  ensureToast();
  if (toastTimeout) clearTimeout(toastTimeout);
  const card = toastShadow.getElementById("card");
  const pct  = toastShadow.getElementById("pct");
  const msg  = toastShadow.getElementById("msg");
  const bar  = toastShadow.getElementById("bar");
  if (!card) return;

  if (isError) {
    card.classList.add("err");
    pct.textContent = "Error";
    msg.textContent = step || "Conversion failed";
    bar.style.width = "100%";
    toastTimeout = setTimeout(dismissToast, 4000);
    return;
  }

  card.classList.remove("err");
  const p = Math.max(0, Math.min(100, Math.round(percent || 0)));
  pct.textContent   = p + "%";
  msg.textContent   = step || "Processing...";
  bar.style.width   = p + "%";

  if (p >= 100) {
    card.classList.add("done");
    toastTimeout = setTimeout(dismissToast, 2200);
  }
}

function dismissToast() {
  if (!toastHost || !toastShadow) return;
  const card = toastShadow.getElementById("card");
  if (card) { card.style.opacity = "0"; card.style.transform = "translateY(12px) scale(.96)"; }
  setTimeout(() => { toastHost?.parentNode?.removeChild(toastHost); toastHost = null; toastShadow = null; }, 300);
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg?.type === "GET_FALLBACK_IMAGE") {
    reply({ url: lastTarget ? extractBackgroundImageUrl(lastTarget) : null });
    return true;
  }
  if (msg?.type === "GET_IMAGE_DATA_URL" && msg.url) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth || img.width;
        c.height = img.naturalHeight || img.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        reply({ dataUrl: c.toDataURL("image/png") });
      } catch (e) {
        reply({ error: String(e) });
      }
    };
    img.onerror = () => reply({ error: "Failed to render image on page canvas" });
    img.src = msg.url;
    return true;
  }
  if (msg?.type === "IMGTRANZ_PROGRESS") {
    const { step, percent, isError } = msg.payload || {};
    updateProgress(step, percent, isError);
    reply({ ok: true });
    return true;
  }
});
