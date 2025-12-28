const crypto = require('crypto');

// Generate CSRF token
const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF middleware
const csrfProtection = (req, res, next) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  // Generate token for new sessions
  if (!req.session?.csrfToken) {
    if (!req.session) req.session = {};
    req.session.csrfToken = generateCSRFToken();
  }

  // Check CSRF token for state-changing requests
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!token || token !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Endpoint to get CSRF token
const getCSRFToken = (req, res) => {
  if (!req.session?.csrfToken) {
    if (!req.session) req.session = {};
    req.session.csrfToken = generateCSRFToken();
  }
  
  res.json({ csrfToken: req.session.csrfToken });
};

module.exports = { csrfProtection, getCSRFToken };
