const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');

class TOTPUtils {
  /**
   * Generate a new TOTP secret for a user
   * @param {string} userEmail - User's email address
   * @param {string} serviceName - Name of your service
   * @returns {Object} Secret and QR code data
   */
  static generateSecret(userEmail, serviceName = 'Digital Type Assessment') {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: serviceName,
      length: 32
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
      qrCodeUrl: secret.otpauth_url
    };
  }

  /**
   * Generate QR code as data URL
   * @param {string} otpauthUrl - The otpauth URL
   * @returns {Promise<string>} QR code data URL
   */
  static async generateQRCode(otpauthUrl) {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);
      return qrCodeDataURL;
    } catch (error) {
      throw new Error('Failed to generate QR code: ' + error.message);
    }
  }

  /**
   * Verify a TOTP token
   * @param {string} token - The 6-digit token from authenticator app
   * @param {string} secret - User's TOTP secret
   * @param {number} window - Time window for verification (default: 2)
   * @returns {boolean} Whether the token is valid
   */
  static verifyToken(token, secret, window = 2) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window
    });
  }

  /**
   * Generate backup codes for 2FA
   * @param {number} count - Number of backup codes to generate
   * @returns {Array<string>} Array of backup codes
   */
  static generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric codes
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Generate a device fingerprint
   * @param {Object} req - Express request object
   * @returns {string} Device fingerprint
   */
  static generateDeviceFingerprint(req) {
    const userAgent = req.get('User-Agent') || '';
    const acceptLanguage = req.get('Accept-Language') || '';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const ip = req.ip || req.connection.remoteAddress || '';
    
    const fingerprint = crypto
      .createHash('sha256')
      .update(userAgent + acceptLanguage + acceptEncoding + ip)
      .digest('hex');
    
    return fingerprint;
  }
}

module.exports = TOTPUtils;