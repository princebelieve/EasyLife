/**
 * Utility to manage dynamic meta tags for SEO and sharing
 */

export function setMetaTags(config) {
  const {
    title = "Newbrend Furniture",
    description = "Luxury furniture and decorative accents",
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

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.coverImage,
    brand: {
      "@type": "Brand",
      name: "Newbrend Furniture",
    },
    offers: {
      "@type": "Offer",
      url: url,
      priceCurrency: "NGN",
      price: product.price?.toString() || "0",
      availability: "https://schema.org/InStock",
    },
  };

  const scriptTag = document.createElement("script");
  scriptTag.type = "application/ld+json";
  scriptTag.textContent = JSON.stringify(schema);
  document.head.appendChild(scriptTag);
}

export function getShareUrl(productId, productName) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/product/${productId}?utm_source=share&utm_medium=social&utm_campaign=${encodeURIComponent(productName)}`;
}
