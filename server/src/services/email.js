//server/src/services/email.js
//server/src/services/email.js
const { google } = require("googleapis");

// OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

// Gmail REST API sender using googleapis
function createGmailClient() {
  return google.gmail({ version: "v1", auth: oauth2Client });
}

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error("Gmail API request timed out")),
      ms,
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function sendViaGmail({ to, subject, text, html }) {
  const gmail = createGmailClient();

  const messageLines = [];
  messageLines.push(`From: ${process.env.EMAIL_USER}`);
  messageLines.push(`To: ${to}`);
  messageLines.push(`Subject: ${subject}`);
  messageLines.push("MIME-Version: 1.0");
  messageLines.push('Content-Type: text/html; charset="UTF-8"');
  messageLines.push("");
  messageLines.push(html || text || "");

  const raw = base64UrlEncode(messageLines.join("\r\n"));

  // Wrap the API call with a timeout so the server won't hang indefinitely
  return withTimeout(
    gmail.users.messages.send({ userId: "me", requestBody: { raw } }),
    10000,
  );
}

console.log("EMAIL CONFIG");
console.log("EMAIL_USER =", process.env.EMAIL_USER);
console.log("GMAIL CLIENT ID =", process.env.GMAIL_CLIENT_ID ? "YES" : "NO");
console.log(
  "GMAIL REFRESH TOKEN =",
  process.env.GMAIL_REFRESH_TOKEN ? "YES" : "NO",
);

// SEND RESET EMAIL
async function sendResetPasswordEmail({ to, resetUrl }) {
  if (!process.env.GMAIL_REFRESH_TOKEN || !process.env.EMAIL_USER) {
    console.warn("OAuth2 not configured. Reset link:", resetUrl);
    return;
  }
  const subject = "Password reset request";
  const text = `You requested a password reset. Use the link below:\n\n${resetUrl}`;
  const html = `<p>You requested a password reset.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;

  // fire-and-forget: don't await to avoid blocking the HTTP handler
  sendViaGmail({ to, subject, text, html })
    .then(() => console.log(`Password reset email sent to ${to}`))
    .catch((err) =>
      console.error("Reset email send failed:", err?.message || err),
    );
}

// SEND VERIFICATION EMAIL
async function sendEmailVerification({ to, verificationUrl }) {
  if (!process.env.GMAIL_REFRESH_TOKEN || !process.env.EMAIL_USER) {
    console.warn("OAuth2 not configured. Verification link:", verificationUrl);
    return;
  }
  const subject = "Verify your email address";
  const text = `Please verify your email:\n\n${verificationUrl}`;
  const html = `<p>Please verify your email:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`;

  console.log(`Sending verification email to ${to}`);

  try {
    await sendViaGmail({ to, subject, text, html });
    console.log(`Verification email sent to ${to}`);
  } catch (err) {
    console.error("Email send failed:", err?.message || err);
    throw err;
  }
}

module.exports = {
  sendResetPasswordEmail,
  sendEmailVerification,
};
