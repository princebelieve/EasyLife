export default async function handler(req, res) {
  const backendUrl =
    process.env.VITE_API_URL || process.env.BASE_URL || "http://localhost:4000";
  const clientUrl =
    process.env.CLIENT_URL || "http://localhost:5173";
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

      const row = [
        product._id || product.sku,
        product.name,
        product.fullDescription || product.shortDescription || product.name,
        `${clientUrl}/product/${product._id}`,
        product.coverImage,
        product.price,
        "", // sale_price (optional)
        "NGN",
        product.inStock && product.stock > 0 ? "in stock" : "out of stock",
        product.brand || "Newbrend Furniture",
        product.sku,
        "new",
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
