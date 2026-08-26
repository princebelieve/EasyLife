//client/src/services/api.js
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  logout,
} from "../utils/auth";
const BASE_URL = import.meta.env.VITE_API_URL || "";

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();

  if (!res.ok) {
    logout();
    throw new Error("Session expired");
  }

  setToken(data.accessToken);

  if (data.refreshToken) {
    setRefreshToken(data.refreshToken);
  }

  return data.accessToken;
}

async function apiRequest(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),

    ...options.headers,
  };

  const cleanHeaders = Object.fromEntries(
    Object.entries(headers).filter(([_, value]) => value !== undefined),
  );

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: cleanHeaders,
  });

  let data = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401) {
    const newToken = await refreshAccessToken();

    const retry = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });

    let retryData = {};

    try {
      retryData = await retry.json();
    } catch {
      retryData = {};
    }

    if (!retry.ok) {
      throw new Error(retryData.message || retryData.error || "Request failed");
    }

    return retryData;
  }

  if (!res.ok) {
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
}

// -------------------------
// AUTH
// -------------------------

export async function registerUser(data) {
  return apiRequest("/api/auth/register", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
}

export async function loginUser(data) {
  return apiRequest("/api/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
}

export async function signInWithGoogle(idToken) {
  return apiRequest("/api/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
}

// -------------------------
// PASSWORD RESET
// -------------------------

export async function forgotPassword(email) {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token, password) {
  return apiRequest("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
}

export async function verifyEmail(token) {
  const res = await fetch(`${BASE_URL}/api/auth/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Verification failed");
  }

  return data;
}

export async function resendVerificationEmail(email) {
  const res = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return res.json();
}

export async function changePassword(currentPassword, newPassword) {
  return apiRequest("/api/auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function initializeCheckout(payload) {
  return apiRequest("/api/checkout", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });
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

export async function getShippingSummary(country = "NG") {
  const res = await fetch(`${BASE_URL}/api/shipping/summary?country=${encodeURIComponent(country)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unable to load delivery information");
  return data;
}

export async function getShippingDestinations() {
  const res = await fetch(`${BASE_URL}/api/shipping/destinations`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Unable to load shipping destinations");
  return data;
}

export async function getShippingSettings(token) {
  return apiRequest("/api/admin/shipping/settings", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateShippingSettings(data, token) {
  return apiRequest("/api/admin/shipping/settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getProductCategories() {
  return apiRequest("/api/products/categories");
}

export async function getNotifications(query = "") {
  const url = query ? `/api/notifications?${query}` : "/api/notifications";
  return apiRequest(url);
}

export async function markNotificationRead(id) {
  return apiRequest(`/api/notifications/${id}/read`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read: true }),
  });
}

export async function markAllNotificationsRead() {
  return apiRequest("/api/notifications/mark-all-read", {
    method: "PUT",
  });
}

export async function getNotificationById(id) {
  return apiRequest(`/api/notifications/${id}`);
}

export async function dismissNotification(id) {
  return apiRequest(`/api/notifications/${id}`, {
    method: "DELETE",
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
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
}

export async function updateProfile(data, token) {
  return apiRequest("/api/users/profile", {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file, token) {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${BASE_URL}/api/users/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}

// -------------------------
// PRODUCTS
// -------------------------

export async function getProducts() {
  return apiRequest("/api/products");
}

export async function getTestimonials(featured = false) {
  return apiRequest(`/api/testimonials${featured ? "?featured=true" : ""}`);
}

export async function getAdminTestimonials(token) {
  return apiRequest("/api/testimonials/admin", { headers: { Authorization: `Bearer ${token}` } });
}

export async function createTestimonialApi(formData, token) {
  return apiRequest("/api/testimonials/admin", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
}

export async function updateTestimonialApi(id, formData, token) {
  return apiRequest(`/api/testimonials/admin/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` }, body: formData });
}

export async function deleteTestimonialApi(id, token) {
  return apiRequest(`/api/testimonials/admin/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}

export async function getProductById(id) {
  return apiRequest(`/api/products/${id}`);
}

export async function getAdminProductById(id, token) {
  return apiRequest(`/api/admin/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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
// ADMIN PRODUCTS
// -------------------------

export async function getAdminProducts(token) {
  return apiRequest("/api/admin/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function approveProductApi(id, token) {
  return apiRequest(`/api/admin/products/${id}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function rejectProductApi(id, token) {
  return apiRequest(`/api/admin/products/${id}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function requestAccountDeletion(reason, token) {
  return apiRequest("/api/users/delete-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });
}

export async function setProductVisibilityApi(id, hidden, token) {
  return apiRequest(`/api/admin/products/${id}/visibility`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hidden }),
  });
}

// -------------------------
// ADMIN NOTIFICATIONS
// -------------------------

export async function getNotificationRequests(token) {
  return apiRequest("/api/admin/notifications/pending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getMyNotificationRequests(token) {
  return apiRequest("/api/notifications/requests", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createNotification(data) {
  return apiRequest("/api/notifications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function broadcastNotification(data) {
  return apiRequest("/api/notifications/broadcast/all", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function approveNotificationRequest(id, token) {
  return apiRequest(`/api/admin/notifications/${id}/approve`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function rejectNotificationRequest(id, token) {
  return apiRequest(`/api/admin/notifications/${id}/reject`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// ADMIN ORDERS
// -------------------------

export async function getAdminOrders(token, query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const endpoint = `/api/admin/orders${queryString ? `?${queryString}` : ""}`;

  return apiRequest(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// -------------------------
// ADMIN USERS
// -------------------------

export async function getAdminUsers(token) {
  return apiRequest("/api/admin/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateAdminUser(id, data, token) {
  return apiRequest(`/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getAdminArchivedOrders(token, filters = {}) {
  return getAdminOrders(token, { archived: true, ...filters });
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

export async function archiveOrderApi(orderId, token) {
  return apiRequest(`/api/admin/orders/${orderId}/archive`, {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function archiveAllOrders(token) {
  return apiRequest("/api/admin/orders/archive-all", {
    method: "PUT",

    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export { apiRequest };
