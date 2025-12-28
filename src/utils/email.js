require('dotenv').config();
const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN
    }
  });
};

const transporter = createTransporter();

const verifyTransporter = async () => {
  try {
    await transporter.verify();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
};

const sendTestEmail = async (to) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to || process.env.GMAIL_USER,
    subject: 'Mailer Test',
    text: 'This is a test email from the Digital Type Assessment dev server.'
  };
  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendResetEmail = async (email, resetToken) => {
  // Build reset link from FRONTEND_URL in .env
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.GMAIL_USER, 
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Password Reset - Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Password Reset Verification</h2>
        <p>Hello ${userName},</p>
        <p>You requested a password reset. Please use the following 6-digit verification code:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p><strong>This code will expire in 10 minutes.</strong></p>
        <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail, sendOTPEmail, verifyTransporter, sendTestEmail };
