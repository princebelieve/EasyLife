function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  const id = req.query?.id;
  const backendUrl = process.env.VITE_API_URL || process.env.BASE_URL;
  const fallbackImage = "https://easylifewellnesshub.com/logo.png";
  const pageUrl = `https://easylifewellnesshub.com/testimonials${id ? `?post=${encodeURIComponent(id)}` : ""}`;

  if (!id || !backendUrl) {
    res.writeHead(302, { Location: pageUrl });
    res.end();
    return;
  }

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/testimonials/${encodeURIComponent(id)}`);
    const item = response.ok ? await response.json() : {};
    const title = item.title || item.name || "Easy Life Wellness Hub";
    const description = item.testimony || "Easy Life Wellness Hub community content.";
    const image = item.image || fallbackImage;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:image" content="${escapeHtml(image)}"><meta property="og:url" content="${pageUrl}"><meta property="og:type" content="article"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}"><meta http-equiv="refresh" content="0;url=${pageUrl}"></head><body><p>Opening Easy Life content...</p><script>location.replace(${JSON.stringify(pageUrl)})</script></body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (error) {
    res.writeHead(302, { Location: pageUrl });
    res.end();
  }
}
