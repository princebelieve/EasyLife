import { getServerApiBase, getServerOrigin } from "./_apiBase.js";

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPrice(value) {
  return `₦${Number(value || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildProductMarkup(product, productUrl) {
  const salePrice = Number(product.salePrice);
  const regularPrice = Number(product.price || 0);
  const price = Number.isFinite(salePrice) && salePrice >= 0 && salePrice < regularPrice
    ? salePrice
    : regularPrice;
  const availability = product.inStock !== false && Number(product.stock || 0) > 0;
  const description = product.fullDescription || product.shortDescription || product.name;
  const title = `${product.name} | EASYLIFE WELLNESS HUB`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: [product.coverImage, ...(product.gallery || [])].filter(Boolean),
    sku: product.sku || product._id,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    ...(product.gtin ? { gtin: product.gtin } : {}),
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "NGN",
      price: String(price),
      availability: availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "EASYLIFE WELLNESS HUB" },
    },
  };

  const head = `<title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(productUrl)}">
    <meta property="og:type" content="product">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(product.coverImage)}">
    <meta property="og:url" content="${escapeHtml(productUrl)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(product.coverImage)}">
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`;

  const body = `<main class="page" data-server-rendered-product="true">
    <article>
      <h1>${escapeHtml(product.name)}</h1>
      <img src="${escapeHtml(product.coverImage)}" alt="${escapeHtml(product.name)}" style="max-width:100%;height:auto">
      <p>${escapeHtml(product.shortDescription || description)}</p>
      <p><strong>${formatPrice(price)}</strong></p>
      <p><strong>${availability ? "In stock" : "Currently unavailable"}</strong></p>
      <p>Delivery is charged once for the complete order after the destination is selected.</p>
      <a href="${escapeHtml(productUrl)}">View product details</a>
    </article>
  </main>`;

  return { head, body };
}

function injectProductMarkup(shell, head, body) {
  const withoutDefaultProductMeta = shell
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/i, "")
    .replace(
      /<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/gi,
      "",
    );

  return withoutDefaultProductMeta
    .replace("</head>", `${head}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

export default async function handler(req, res) {
  const id = req.query?.id;
  const origin = getServerOrigin(req);
  const productUrl = `${origin}/product/${encodeURIComponent(id || "")}`;

  if (!id) {
    res.writeHead(302, { Location: "/collection" });
    res.end();
    return;
  }

  try {
    const [productResponse, shellResponse] = await Promise.all([
      fetch(`${getServerApiBase(req)}/products/${encodeURIComponent(id)}`),
      fetch(`${origin}/index.html`),
    ]);

    if (!productResponse.ok || !shellResponse.ok) {
      throw new Error("Product page data is unavailable");
    }

    const [product, shell] = await Promise.all([
      productResponse.json(),
      shellResponse.text(),
    ]);
    const { head, body } = buildProductMarkup(product, productUrl);
    const html = injectProductMarkup(shell, head, body);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300");
    res.status(200).send(html);
  } catch (error) {
    console.error("Server-rendered product page failed:", error.message);
    res.writeHead(302, { Location: "/collection" });
    res.end();
  }
}
