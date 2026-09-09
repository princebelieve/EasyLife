import { getServerApiBase } from "./_apiBase.js";

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
  // This is only used by Vercel to fetch product metadata for a social-card
  // preview. The link visitors receive below always stays on the public site.
  const apiBase = getServerApiBase(req);
  const publicUrl = "https://easylifewellnesshub.com";
  const productUrl = `${publicUrl}/product/${encodeURIComponent(id || "")}`;

  if (!id) {
    res.writeHead(302, { Location: id ? productUrl : publicUrl });
    res.end();
    return;
  }

  try {
    const response = await fetch(`${apiBase}/products/${encodeURIComponent(id)}`);
    const product = response.ok ? await response.json() : null;
    if (!product) throw new Error("Product not found");

    const title = `${product.name} | EASYLIFE WELLNESS HUB`;
    const description = product.fullDescription || product.shortDescription || `Shop ${product.name} from EASYLIFE WELLNESS HUB.`;
    const image = product.coverImage || `${publicUrl}/logo.png`;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${productUrl}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:image" content="${escapeHtml(image)}"><meta property="og:image:alt" content="${escapeHtml(product.name)}"><meta property="og:url" content="${productUrl}"><meta property="og:type" content="product"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${escapeHtml(image)}"><meta http-equiv="refresh" content="0;url=${productUrl}"></head><body><p>Opening <a href="${productUrl}">${escapeHtml(product.name)}</a>…</p><script>location.replace(${JSON.stringify(productUrl)})</script></body></html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch {
    res.writeHead(302, { Location: productUrl });
    res.end();
  }
}
