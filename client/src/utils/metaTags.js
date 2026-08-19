/**
 * Utility to manage dynamic meta tags for SEO and sharing
 */

export function setMetaTags(config) {
  const {
    title = "Easy Life Wellness Hub",
    description = "Wellness education, natural wellness products, entrepreneurship training, leadership development, and community support.",
    image = "",
    url = window.location.href,
    type = "website",
  } = config;

  // Set document title
  document.title = title;

  // Set or update Open Graph meta tags
  const metaTags = {
    "og:title": title,
    "og:description": description,
    "og:image": image,
    "og:url": url,
    "og:type": type,
    canonical: url,
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:card": "summary_large_image",
    description: description,
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    if (!content) return;

    let element = document.querySelector(`meta[property="${name}"]`);
    if (!element) {
      element = document.querySelector(`meta[name="${name}"]`);
    }

    if (name === "canonical") {
      element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", "canonical");
        document.head.appendChild(element);
      }
      element.setAttribute("href", content);
      return;
    }

    if (!element) {
      element = document.createElement("meta");
      if (name.startsWith("og:") || name.startsWith("twitter:")) {
        element.setAttribute("property", name);
      } else {
        element.setAttribute("name", name);
      }
      document.head.appendChild(element);
    }

    element.setAttribute("content", content);
  });
}

export function setProductSchema(product, url) {
  // Remove existing schema if present
  const existingSchema = document.querySelector(
    'script[type="application/ld+json"]',
  );
  if (existingSchema) {
    existingSchema.remove();
  }

  // Build image array - include cover image and gallery
  const images = [product.coverImage];
  if (product.gallery && Array.isArray(product.gallery)) {
    images.push(...product.gallery.slice(0, 5)); // Limit to 5 images for Merchant Center
  }

  // Use fullDescription if available, fallback to shortDescription or name
  const description =
    product.fullDescription || product.shortDescription || product.name;

  // Determine availability status
  const availability =
    product.inStock && product.stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: description,
    image: images, // Changed from single image to array
    sku: product.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Easy Life Wellness Hub",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "NGN",
      price: product.price?.toString() || "0",
      availability: availability,
      seller: {
        "@type": "Organization",
        name: "Easy Life Wellness Hub",
      },
    },
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating.average?.toString() || "0",
          reviewCount: product.rating.count?.toString() || "0",
        }
      : undefined,
  };

  // Remove undefined fields
  Object.keys(schema).forEach(
    (key) => schema[key] === undefined && delete schema[key],
  );

  const scriptTag = document.createElement("script");
  scriptTag.type = "application/ld+json";
  scriptTag.textContent = JSON.stringify(schema);
  document.head.appendChild(scriptTag);
}

export function getShareUrl(productId, productName) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/product/${productId}?utm_source=share&utm_medium=social&utm_campaign=${encodeURIComponent(productName)}`;
}
