document.querySelectorAll("a[href]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const url = link.getAttribute("href");
    if (url) chrome.tabs.create({ url });
  });
});
