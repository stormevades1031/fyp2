const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

class EmailOTPUtils {
  /**
   * Generate a 6-digit OTP code
   * @returns {string} 6-digit OTP code
   */
  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Hash OTP code for secure storage
   * @param {string} otpCode - The OTP code to hash
   * @returns {string} Hashed OTP code
   */
  static hashOTP(otpCode) {
    return crypto.createHash('sha256').update(otpCode.toString()).digest('hex');
  }

  /**
   * Send OTP via email
   * @param {string} email - Recipient email
   * @param {string} otpCode - The OTP code
   * @param {string} purpose - Purpose of OTP (login, setup, etc.)
   * @returns {Promise<boolean>} Success status
   */
  static async sendOTPEmail(email, otpCode, purpose = 'login') {
    try {
      // Add token refresh logic
      const oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );
      
      oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN
      });
      
      const accessToken = await oauth2Client.getAccessToken();
      
      let transporter;
      if (process.env.GMAIL_APP_PASSWORD) {
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD
          }
        });
      } else {
        transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: 'OAuth2',
            user: process.env.GMAIL_USER,
            clientId: process.env.GMAIL_CLIENT_ID,
            clientSecret: process.env.GMAIL_CLIENT_SECRET,
            refreshToken: process.env.GMAIL_REFRESH_TOKEN,
            accessToken: accessToken.token
          },
        });
      }
  
      const subject = purpose === 'login' 
        ? 'Your Login Verification Code'
        : 'Your Two-Factor Authentication Code';
  
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verification Code</h2>
          <p>Your verification code for ${purpose} is:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otpCode}</h1>
          </div>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
      `;
  
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.GMAIL_USER,
        to: email,
        subject: subject,
        html: html
      });
  
      return true;
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      return false;
    }
  }

  /**
   * Verify OTP code
   * @param {string} inputCode - User input code
   * @param {string} storedCode - Stored OTP code
   * @param {Date} expiry - OTP expiry time
   * @returns {boolean} Whether OTP is valid
   */
  static verifyOTP(inputCode, storedCode, expiry) {
    if (!inputCode || !storedCode || !expiry) {
      return false;
    }

    // Check if OTP has expired
    if (new Date() > expiry) {
      return false;
    }

    // Compare codes
    return inputCode.toString() === storedCode.toString();
  }
}

module.exports = EmailOTPUtils;
