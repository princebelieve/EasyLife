// Serverless functions run on the public site. Keep their data requests on
// that same origin so Vercel's /api proxy can forward them to the API server.
// This avoids maintaining a second deployment URL environment variable.
export function getServerOrigin(req) {
  const headers = req.headers || {};
  const host = headers["x-forwarded-host"] || headers.host;
  const forwardedProtocol = headers["x-forwarded-proto"];
  const protocol = Array.isArray(forwardedProtocol)
    ? forwardedProtocol[0]
    : String(forwardedProtocol || "https").split(",")[0].trim();

  if (!host) {
    throw new Error("Unable to determine the public site origin");
  }

  return `${protocol}://${host}`;
}

export function getServerApiBase(req) {
  return `${getServerOrigin(req)}/api`;
}
