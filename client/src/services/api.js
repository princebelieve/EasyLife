//client/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

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
  const res = await fetch(`${BASE_URL}/api/checkout/initialize`, {
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
