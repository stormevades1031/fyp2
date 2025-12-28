const validator = require('validator');
const mongoSanitize = require('express-mongo-sanitize');
const logger = require('../utils/logger');

// Enhanced input sanitization middleware
const enhancedSanitize = (req, res, next) => {
  let sanitizationOccurred = false;
  let originalBody, originalQuery, originalParams;
  
  // Safe JSON stringify that handles circular references
  const safeStringify = (obj) => {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      if (error.message.includes('circular')) {
        return '[Circular Reference Detected]';
      }
      return '[Stringify Error]';
    }
  };
  
  // Store original data for logging
  originalBody = safeStringify(req.body || {});
  originalQuery = safeStringify(req.query || {});
  originalParams = safeStringify(req.params || {});
  
  // Recursively sanitize object properties
  const sanitizeObject = (obj, visited = new WeakSet()) => {
    if (obj && typeof obj === 'object') {
      // Prevent infinite recursion with circular references
      if (visited.has(obj)) {
        return;
      }
      visited.add(obj);
      
      // Handle arrays
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (typeof obj[i] === 'object' && obj[i] !== null) {
            sanitizeObject(obj[i], visited);
          }
        }
        return;
      }
      
      // Handle objects
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Check for MongoDB operators
          if (key.startsWith('$') || key.includes('.')) {
            console.warn(`Blocked potentially dangerous key: ${key}`);
            delete obj[key];  // Complete removal
            sanitizationOccurred = true;
            continue;
          }
          
          // Recursively sanitize nested objects and arrays
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key], visited);
          }
          
          // Sanitize string values
          if (typeof obj[key] === 'string') {
            const originalString = obj[key];
            // Remove null bytes and control characters
            obj[key] = obj[key].replace(/[\x00-\x1f\x7f-\x9f]/g, '');
            
            // Limit string length to prevent DoS
            if (obj[key].length > 10000) {
              obj[key] = obj[key].substring(0, 10000);
            }
            
            if (originalString !== obj[key]) {
              sanitizationOccurred = true;
            }
          }
        }
      }
    }
  };
  
  // Sanitize request body, query, and params
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  
  // Apply express-mongo-sanitize as additional protection
  mongoSanitize.sanitize(req.body);
  mongoSanitize.sanitize(req.query);
  
  // Log if sanitization occurred
  if (sanitizationOccurred) {
    const sanitizedBody = safeStringify(req.body || {});
    const sanitizedQuery = safeStringify(req.query || {});
    const sanitizedParams = safeStringify(req.params || {});
    
    logger.warn('NoSQL injection attempt detected and sanitized', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      originalBody: originalBody,
      sanitizedBody: sanitizedBody,
      originalQuery: originalQuery,
      sanitizedQuery: sanitizedQuery,
      originalParams: originalParams,
      sanitizedParams: sanitizedParams
    });
  }
  
  next();
};

module.exports = enhancedSanitize;