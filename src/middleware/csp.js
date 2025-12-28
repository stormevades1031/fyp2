const crypto = require('crypto');

// Generate CSP nonce middleware
const generateNonce = (req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
};

module.exports = { generateNonce };