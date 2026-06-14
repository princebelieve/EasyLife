//client/src/utils/auth.js
function storage() {
  return typeof window !== "undefined" ? window.sessionStorage : null;
}

export function setToken(token) {
  const store = storage();
  if (store) store.setItem("accessToken", token);
}

export function getToken() {
  return storage()?.getItem("accessToken") || null;
}

export function setRefreshToken(token) {
  const store = storage();
  if (store) store.setItem("refreshToken", token);
}

export function getRefreshToken() {
  return storage()?.getItem("refreshToken") || null;
}

export function logout() {
  const store = storage();
  if (store) {
    store.removeItem("accessToken");
    store.removeItem("refreshToken");
  }
}
