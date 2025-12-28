const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  replacedBy: {
    type: String,
    default: null
  },
  createdByIp: {
    type: String,
    required: true
  },
  revokedAt: {
    type: Date
  },
  revokedByIp: {
    type: String
  },
  // Add token version
  tokenVersion: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to generate secure refresh token
refreshTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(64).toString('hex');
};

// Instance method to check if token is active
refreshTokenSchema.methods.isActive = function() {
  return !this.isRevoked && this.expiresAt > new Date();
};

// Instance method to revoke token
refreshTokenSchema.methods.revoke = function(ipAddress, replacedByToken = null) {
  this.isRevoked = true;
  this.revokedAt = new Date();
  this.revokedByIp = ipAddress;
  if (replacedByToken) {
    this.replacedBy = replacedByToken;
  }
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);