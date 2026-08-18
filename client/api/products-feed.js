export default async function handler(req, res) {
  const backendUrl =
    process.env.VITE_API_URL || process.env.BASE_URL || "http://localhost:4000";
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const clientUrl =
    process.env.CLIENT_URL ||
    (host ? `${protocol}://${host}` : "http://localhost:5173");
  const apiUrl = `${backendUrl}/api/products`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const products = await response.json();

    // Create CSV feed for Google Merchant Center
    const csvHeaders = [
      "id",
      "title",
      "description",
      "link",
      "image_link",
      "price",
      "sale_price",
      "currency",
      "availability",
      "brand",
      "sku",
      "condition",
      "min_handling_time",
      "max_handling_time",
      "min_transit_time",
      "max_transit_time",
      "shipping_country",
      "shipping_region",
      "shipping_city",
      "shipping_postal_code",
    ];

    let csv = csvHeaders.join(",") + "\n";

    products.forEach((product) => {
      const escapeCsvField = (field) => {
        if (!field) return '""';
        const stringField = String(field);
        if (
          stringField.includes(",") ||
          stringField.includes('"') ||
          stringField.includes("\n")
        ) {
          return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
      };

      // derive transit times from product.deliveryEstimate (e.g. "7-14 days")
      let transitMin = 0;
      let transitMax = 1;
      try {
        const de = (product.deliveryEstimate || "").toString();
        const m = de.match(/(\d+)\s*-\s*(\d+)/);
        if (m) {
          transitMin = Number(m[1]);
          transitMax = Number(m[2]);
        }
      } catch {
        // ignore
      }

      const row = [
        product._id || product.sku,
        product.name,
        product.fullDescription || product.shortDescription || product.name,
        `${clientUrl}/product/${product._id}`,
        product.coverImage,
        product.price,
        "", // sale_price (optional)
        "NGN",
        product.inStock && product.stock > 0 ? "in_stock" : "out_of_stock",
        product.brand || "Easy Life Wellness Hub",
        product.sku,
        "new",
        0,
        1,
        transitMin,
        transitMax,
        "NG",
        "Delta",
        "Abraka",
        "330106",
      ]
        .map(escapeCsvField)
        .join(",");

      csv += row + "\n";
    });

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="products-feed.csv"',
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("Product feed generation error:", error);
    res.status(500).json({
      error: "Failed to generate product feed",
      message: error.message,
    });
  }
}
