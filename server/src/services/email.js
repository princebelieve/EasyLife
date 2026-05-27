//server/src/services/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: process.env.EMAIL_USER
    ? {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    : undefined,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP READY");
  }
});

async function sendResetPasswordEmail({ to, resetUrl }) {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.warn(
      "EMAIL_HOST, EMAIL_USER, or EMAIL_PASS is not configured. Reset link: ",
      resetUrl,
    );
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "Password reset request",
    text: `You requested a password reset. Use the link below to set a new password:\n\n${resetUrl}\n\nIf you did not request this, ignore this message.`,
    html: `<p>You requested a password reset. Click the link below to set a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, ignore this message.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

async function sendEmailVerification({ to, verificationUrl }) {
  if (
    !process.env.EMAIL_HOST ||
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS
  ) {
    console.warn(
      "EMAIL_HOST, EMAIL_USER, or EMAIL_PASS is not configured. Verification link:",
      verificationUrl,
    );
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: "Verify your email address",
    text: `Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nIf you did not create an account, please ignore this email.`,
    html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p><p>If you did not create an account, please ignore this email.</p>`,
  };

  console.log(`Attempting to send verification email to ${to}`);
  console.log(`Verification URL: ${verificationUrl}`);

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email successfully sent to ${to}`);
  } catch (err) {
    console.warn(
      `Verification email failed to send to ${to}:`,
      err?.message || err,
    );
    throw err;
  }
}

module.exports = { sendResetPasswordEmail, sendEmailVerification };
