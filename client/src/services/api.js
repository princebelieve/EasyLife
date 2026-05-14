//client/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// -------------------------
// AUTH
// -------------------------

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

// -------------------------
// PASSWORD RESET
// -------------------------

export async function forgotPassword(email) {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res.json();
}

export async function resetPassword(token, password) {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });

  return res.json();
}

export async function initializePayment(payload) {
  const res = await fetch(`${BASE_URL}/api/payments/initialize`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Payment initialization failed");
  }

  return data;
}

export async function verifyPayment(reference) {
  const res = await fetch(`${BASE_URL}/api/payments/verify/${reference}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Verification failed");
  }

  return data;
}

export async function initializeCheckout(payload, token) {
  const res = await fetch(`${BASE_URL}/api/checkout`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Checkout initialization failed");
  }

  return data;
}

// -------------------------
// SHIPPING
// -------------------------

export async function previewShipping(payload) {
  const res = await fetch(`${BASE_URL}/api/shipping/preview`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Unable to calculate shipping");
  }

  return data;
}

export async function getShippingZones(token) {
  return apiRequest("/api/admin/shipping", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createShippingZone(data, token) {
  return apiRequest("/api/admin/shipping", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}

export async function updateShippingZone(id, data, token) {
  return apiRequest(`/api/admin/shipping/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}

export async function deleteShippingZone(id, token) {
  return apiRequest(`/api/admin/shipping/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// USER ORDERS
// -------------------------

export async function getMyOrders(token) {
  return apiRequest("/api/users/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// PROFILE
// -------------------------

export async function getProfile(token) {
  return apiRequest("/api/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// PRODUCTS
// -------------------------

export async function getProducts() {
  return apiRequest("/api/products");
}

export async function getProductById(id) {
  return apiRequest(`/api/products/${id}`);
}

export async function createProductApi(formData, token) {
  return apiRequest("/api/products", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });
}

export async function updateProductApi(id, formData, token) {
  return apiRequest(`/api/products/${id}`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });
}

export async function deleteProductApi(id, token) {
  return apiRequest(`/api/products/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// ADMIN ORDERS
// -------------------------

export async function getAdminOrders(token) {
  return apiRequest("/api/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateOrderStatusApi(orderId, deliveryStatus, token) {
  return apiRequest(`/api/admin/orders/${orderId}/status`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ deliveryStatus }),
  });
}

// -------------------------
// ADMIN INQUIRIES
// -------------------------

export async function getInquiries(token) {
  return apiRequest("/api/inquiries", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// ADMIN SINGLE ORDER
// -------------------------

export async function getOrderById(id, token) {
  return apiRequest(`/api/admin/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// CART
// -------------------------

export async function getCart(token) {
  return apiRequest("/api/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addToCartApi(token, productId, quantity = 1) {
  return apiRequest("/api/cart/add", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      productId,
      quantity,
    }),
  });
}

export async function removeFromCartApi(token, productId) {
  return apiRequest(`/api/cart/remove/${productId}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateCartApi(token, productId, quantity) {
  return apiRequest(`/api/cart/update/${productId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      quantity,
    }),
  });
}

export async function clearCartApi(token) {
  return apiRequest("/api/cart/clear", {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// INQUIRIES
// -------------------------

export async function submitInquiry(data) {
  return apiRequest("/api/inquiries", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
}

// -------------------------
// MEASUREMENTS
// -------------------------

export async function submitMeasurement(data) {
  return apiRequest("/api/measurements", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
}
