const { z } = require('zod');
const { validatePasswordStrength, passwordRequirements } = require('../utils/passwordUtils');

const passwordValidator = z.string()
  .min(passwordRequirements.minLength)
  .max(passwordRequirements.maxLength)
  .refine((password) => {
    const validation = validatePasswordStrength(password);
    return validation.isValid;
  }, {
    message: (val) => {
      if (typeof val !== 'string') {
        return 'Password must be a string.';
      }
      const validation = validatePasswordStrength(val);
      return validation.errors.length > 0 ? validation.errors[0] : 'Password does not meet security requirements';
    }
  });

const registerSchema = z.object({
  firstName: z.string().min(1).max(50).refine(val => !/[<>]/.test(val), 'Name contains invalid characters'),
  email: z.string().email().max(100),
  password: passwordValidator
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordValidator
});

const loginSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().min(1).max(128)
});

const forgotPasswordSchema = z.object({
  email: z.string().email().max(100)
});

const assessmentSchema = z.object({
  responses: z.array(z.object({
    questionId: z.number().int().min(1),
    category: z.string().min(1),
    answer: z.string().min(1)
  })).min(1).max(100)
});

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      req.body = sanitizeObject(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues || [];
        return res.status(400).json({
          error: 'Validation failed',
          details: issues.length ? issues.map(err => ({
            field: Array.isArray(err.path) ? err.path.join('.') : 'unknown',
            message: err.message
          })) : [{ field: 'unknown', message: 'Validation error occurred' }]
        });
      }
      next(error);
    }
  };
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = value
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    } else {
      sanitized[key] = sanitizeObject(value);
    }
  }
  return sanitized;
};

const twoFactorTokenSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(1, 'Token is required').transform(val => val.toString().trim()).refine(val => {
    return /^\d{6}$/.test(val) || /^[A-Za-z0-9]{8,12}$/.test(val);
  }, 'Invalid token format'),
  method: z.enum(['totp', 'backup', 'email'], 'Invalid verification method')
});

const twoFactorBackupSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(8, 'Backup code must be at least 8 characters').max(12, 'Backup code too long'),
  method: z.literal('backup')
});

const twoFactorDisableSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

const twoFactorSetupSchema = z.object({
  token: z.string().min(1, 'Token is required').transform(val => val.toString().trim()).refine(val => {
    return /^\d{6}$/.test(val);
  }, 'Invalid token format - must be 6 digits')
});

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  assessmentSchema,
  twoFactorTokenSchema,
  twoFactorSetupSchema,
  twoFactorBackupSchema,
  twoFactorDisableSchema
};
