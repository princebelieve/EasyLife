//client/src/utils/auth.js
export function setToken(token) {
  localStorage.setItem("accessToken", token);
}

export function getToken() {
  return localStorage.getItem("accessToken");
}

export function setRefreshToken(token) {
  localStorage.setItem("refreshToken", token);
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
