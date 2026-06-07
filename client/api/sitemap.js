export default async function handler(req, res) {
  const backendUrl = process.env.VITE_API_URL || "http://localhost:4000";
  const apiUrl = `${backendUrl}/api/products`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const products = await response.json();
    const baseUrl =
      process.env.VITE_CLIENT_URL || "https://newbrend.vercel.app";
    const staticPages = [
      { loc: baseUrl, priority: "1.00" },
      { loc: `${baseUrl}/collection`, priority: "0.90" },
      { loc: `${baseUrl}/contact`, priority: "0.80" },
      { loc: `${baseUrl}/about`, priority: "0.70" },
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    staticPages.forEach((page) => {
      xml += "  <url>\n";
      xml += `    <loc>${page.loc}</loc>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += "  </url>\n";
    });

    products.forEach((product) => {
      const lastmod = product.updatedAt
        ? new Date(product.updatedAt).toISOString()
        : null;

      xml += "  <url>\n";
      xml += `    <loc>${baseUrl}/product/${product._id}</loc>\n`;
      if (lastmod) {
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
      }
      xml += "    <priority>0.75</priority>\n";
      xml += "  </url>\n";
    });

    xml += "</urlset>";

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Failed to generate sitemap");
  }
}
