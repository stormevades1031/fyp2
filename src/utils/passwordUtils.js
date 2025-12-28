const fs = require('fs');
const path = require('path');

const commonPasswords = [
  'password', 'password123', '123456', '12345678', 'qwerty', 'admin',
  'welcome', 'welcome123', 'abc123', 'letmein', 'monkey', 'football',
  'iloveyou', '1234567', '123123', '12345', '1234567890', 'superman',
  'trustno1', 'sunshine', 'princess', 'dragon', 'baseball', 'adobe123',
  'football', 'ashley', 'bailey', 'password1', 'shadow', 'michael',
  'qwerty123', '000000', 'azerty', 'twitter', 'whatever', 'donald',
  'master', 'access', 'flower', 'qwertyuiop', 'login', 'passw0rd',
  'starwars', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1',
  'lovely', 'admin123', 'welcome1', 'adminadmin', 'test123', 'secret'
];

const isPasswordDenied = (password) => {
  if (typeof password !== 'string') {
    return false;
  }
  const lowerPassword = password.toLowerCase();
  return commonPasswords.includes(lowerPassword);
};

const passwordRequirements = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128
};

const validatePasswordStrength = (password) => {
  const errors = [];
  if (typeof password !== 'string') {
    errors.push('Password must be a string.');
    return { isValid: false, errors };
  }
  if (isPasswordDenied(password)) {
    errors.push('Password is too common. Please choose a stronger password.');
  }
  if (password.length < passwordRequirements.minLength) {
    errors.push(`Password must be at least ${passwordRequirements.minLength} characters long.`);
  }
  if (password.length > passwordRequirements.maxLength) {
    errors.push(`Password cannot exceed ${passwordRequirements.maxLength} characters.`);
  }
  if (passwordRequirements.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter.');
  }
  if (passwordRequirements.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter.');
  }
  if (passwordRequirements.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number.');
  }
  if (passwordRequirements.requireSpecialChars && !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character.');
  }
  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  isPasswordDenied,
  validatePasswordStrength,
  passwordRequirements
};
