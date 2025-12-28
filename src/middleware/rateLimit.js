const rateLimit = require('express-rate-limit');
const RefreshToken = require('../models/RefreshToken');

// Track failed attempts by IP
const failedLoginAttempts = new Map();

// IP reputation tracking
const ipReputationScores = new Map();

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    // Increment IP reputation negative score
    const ipAddress = req.ip || req.connection.remoteAddress;
    const currentScore = ipReputationScores.get(ipAddress) || 0;
    ipReputationScores.set(ipAddress, currentScore - 10);
    
    res.status(429).json({
      message: 'Too many login attempts. Please try again later or complete the CAPTCHA.',
      requireCaptcha: true
    });
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
  skip: (req) => {
    // Skip rate limiting for successful logins
    return req.path === '/api/auth/login' && req.method === 'POST' && req.body.captchaToken;
  }
});

// Track failed attempts and require CAPTCHA
const trackFailedAttempts = (req, res, next) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  
  // If this is a successful request, reset failed attempts
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      failedLoginAttempts.delete(ipAddress);
      
      // Improve IP reputation on successful login
      const currentScore = ipReputationScores.get(ipAddress) || 0;
      ipReputationScores.set(ipAddress, Math.min(100, currentScore + 5));
    } else if (res.statusCode === 400 || res.statusCode === 401) {
      // Increment failed attempts on 400/401 responses
      const attempts = failedLoginAttempts.get(ipAddress) || 0;
      failedLoginAttempts.set(ipAddress, attempts + 1);
      
      // Decrease IP reputation on failed login
      const currentScore = ipReputationScores.get(ipAddress) || 0;
      ipReputationScores.set(ipAddress, Math.max(-100, currentScore - 1));
    }
  });
  
  // Check if CAPTCHA is required
  const attempts = failedLoginAttempts.get(ipAddress) || 0;
  if (attempts >= 3) {
    // After 3 failed attempts, require CAPTCHA
    req.requireCaptcha = true;
  }
  
  next();
};

// Get IP reputation score
const getIpReputation = (ipAddress) => {
  return ipReputationScores.get(ipAddress) || 0;
};

// Check if IP has suspicious activity
const isSuspiciousIP = (ipAddress) => {
  const score = getIpReputation(ipAddress);
  return score < -20; // Threshold for suspicious activity
};

module.exports = {
  loginLimiter,
  trackFailedAttempts,
  getIpReputation,
  isSuspiciousIP
};