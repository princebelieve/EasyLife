//server/src/services/email.js
//server/src/services/email.js
const nodemailer = require("nodemailer");
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

// Create transporter (OAuth2)
async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
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

  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Password reset request",
    text: `You requested a password reset. Use the link below:\n\n${resetUrl}`,
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}

// SEND VERIFICATION EMAIL
async function sendEmailVerification({ to, verificationUrl }) {
  if (!process.env.GMAIL_REFRESH_TOKEN || !process.env.EMAIL_USER) {
    console.warn("OAuth2 not configured. Verification link:", verificationUrl);
    return;
  }

  const transporter = await createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Verify your email address",
    text: `Please verify your email:\n\n${verificationUrl}`,
    html: `<p>Please verify your email:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
  };

  console.log(`Sending verification email to ${to}`);

  try {
    await transporter.sendMail(mailOptions);
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
