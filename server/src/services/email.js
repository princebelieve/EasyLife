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

module.exports = { sendResetPasswordEmail };
