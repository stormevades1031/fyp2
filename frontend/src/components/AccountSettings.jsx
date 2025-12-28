import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest } from '../utils/csrf';
import '../AuthStyles.css';
import '../AboutContactStyles.css'; // Import to use page-container styling

const AccountSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetData, setPasswordResetData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Add 2FA state
  const [twoFactorData, setTwoFactorData] = useState({
    enabled: false,
    secret: '',
    qrCode: '',
    verificationCode: '',
    backupCodes: [],
    showSetup: false,
    showBackupCodes: false
  });
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  
  // Add password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  // Add password matching state
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [showPasswordMatchIndicators, setShowPasswordMatchIndicators] = useState(false);

  // Check 2FA status on component mount
  useEffect(() => {
    const check2FAStatus = async () => {
      try {
        const response = await makeAuthenticatedRequest('get', '/api/two-factor/status');
        setTwoFactorData(prev => ({
          ...prev,
          enabled: response.data.twoFactorEnabled // Fix: use correct property name
        }));
      } catch (error) {
        console.error('Failed to check 2FA status:', error);
      }
    };
    
    check2FAStatus();
  }, []);

  // 2FA Setup function
  const setup2FA = async () => {
    setTwoFactorLoading(true);
    setError('');
    try {
      const response = await makeAuthenticatedRequest('post', '/api/two-factor/setup');
      setTwoFactorData(prev => ({
        ...prev,
        secret: response.data.secret,
        qrCode: response.data.qrCode,
        showSetup: true
      }));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to setup 2FA');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Verify and enable 2FA
  const verify2FA = async () => {
    if (!twoFactorData.verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setTwoFactorLoading(true);
    setError('');
    try {
      const response = await makeAuthenticatedRequest('post', '/api/two-factor/verify-setup', {
        token: twoFactorData.verificationCode
      });
      
      setTwoFactorData(prev => ({
        ...prev,
        enabled: true,
        showSetup: false,
        backupCodes: response.data.backupCodes,
        showBackupCodes: true,
        verificationCode: ''
      }));
      setMessage('2FA enabled successfully! Please save your backup codes.');
    } catch (error) {
      setError(error.response?.data?.error || 'Invalid verification code');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Disable 2FA
  const disable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }
    
    // Get password confirmation
    const password = prompt('Please enter your password to confirm disabling 2FA:');
    if (!password) {
      return;
    }
    
    setTwoFactorLoading(true);
    setError('');
    try {
      await makeAuthenticatedRequest('post', '/api/two-factor/disable', {
        password // Add password to the request
      });
      setTwoFactorData(prev => ({
        ...prev,
        enabled: false,
        secret: '',
        qrCode: '',
        backupCodes: [],
        showSetup: false,
        showBackupCodes: false
      }));
      setMessage('2FA has been disabled successfully.'); // This message should now appear
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to disable 2FA');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Password validation function
  const validatePassword = (password) => {
    return {
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      hasMinLength: password.length >= 8
    };
  };

  // Check if password meets all requirements
  const isPasswordValid = (validation) => {
    return Object.values(validation).every(Boolean);
  };

  // Check if passwords match
  useEffect(() => {
    if (passwordResetData.newPassword && passwordResetData.confirmPassword) {
      const match = passwordResetData.newPassword === passwordResetData.confirmPassword;
      setPasswordsMatch(match);
      setShowPasswordMatchIndicators(true);
    } else {
      setShowPasswordMatchIndicators(false);
      setPasswordsMatch(false);
    }
  }, [passwordResetData.newPassword, passwordResetData.confirmPassword]);

  useEffect(() => {
    if (passwordResetData.newPassword) {
      const validation = validatePassword(passwordResetData.newPassword);
      setPasswordValidation(validation);
      setShowPasswordRequirements(true);
    } else {
      setShowPasswordRequirements(false);
    }
  }, [passwordResetData.newPassword]);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
  
    // Validate passwords match
    if (passwordResetData.newPassword !== passwordResetData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
  
    // Validate password strength using the validation function
    const validation = validatePassword(passwordResetData.newPassword);
    if (!isPasswordValid(validation)) {
      setError('Password must meet all the requirements shown below');
      setLoading(false);
      return;
    }
  
    try {
      const response = await makeAuthenticatedRequest('put', '/api/auth/reset-password', {
        currentPassword: passwordResetData.currentPassword,
        newPassword: passwordResetData.newPassword
      });
  
      setMessage('Password updated successfully! Please log in again with your new password.');
      setPasswordResetData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordReset(false);
      
      // Check if backend requires re-authentication
      if (response.data.requireReauth) {
        // Auto-logout immediately since backend cleared the cookie
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        // Fallback: logout after successful password change anyway
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Account Settings</h1>
      </div>
      
      <div className="account-settings-content">
        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}
        
        {/* User Information */}
        <div className="user-info-section">
          <h3>Account Information</h3>
          <div className="info-item">
            <label>Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
        </div>
        
        {/* Two-Factor Authentication Section */}
        <div className="password-section">
          <h3>Two-Factor Authentication</h3>
          <div className="info-item">
            <label>Status:</label>
            <span className={twoFactorData.enabled ? 'text-success' : 'text-warning'}>
              <i className={`fas ${twoFactorData.enabled ? 'fa-shield-alt' : 'fa-exclamation-triangle'}`}></i>
              {twoFactorData.enabled ? ' Enabled' : ' Disabled'}
            </span>
          </div>
          
          {!twoFactorData.enabled && !twoFactorData.showSetup && (
            <button 
              className="auth-button primary"
              onClick={setup2FA}
              disabled={twoFactorLoading}
            >
              {twoFactorLoading ? 'Setting up...' : 'Enable 2FA'}
            </button>
          )}
          
          {twoFactorData.showSetup && (
            <div className="two-factor-setup">
              <h4>Setup Two-Factor Authentication</h4>
              <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):</p>
              
              <div className="qr-code-container">
                <img src={twoFactorData.qrCode} alt="2FA QR Code" className="qr-code" />
              </div>
              
              <p>Or enter this secret manually: <code>{twoFactorData.secret}</code></p>
              
              <div className="form-group">
                <label>Enter verification code from your app:</label>
                <input
                  type="text"
                  value={twoFactorData.verificationCode}
                  onChange={(e) => setTwoFactorData(prev => ({
                    ...prev,
                    verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                  }))}
                  placeholder="123456"
                  maxLength="6"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="auth-button primary"
                  onClick={verify2FA}
                  disabled={twoFactorLoading || twoFactorData.verificationCode.length !== 6}
                >
                  {twoFactorLoading ? 'Verifying...' : 'Verify & Enable'}
                </button>
                <button 
                  className="auth-button secondary"
                  onClick={() => setTwoFactorData(prev => ({ ...prev, showSetup: false, verificationCode: '' }))}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {twoFactorData.showBackupCodes && (
            <div className="backup-codes">
              <h4>Backup Codes</h4>
              <p>Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device:</p>
              <div className="backup-codes-list">
                {twoFactorData.backupCodes.map((code, index) => (
                  <code key={index} className="backup-code">{code}</code>
                ))}
              </div>
              <button 
                className="auth-button secondary"
                onClick={() => setTwoFactorData(prev => ({ ...prev, showBackupCodes: false }))}
              >
                I've Saved My Codes
              </button>
            </div>
          )}
          
          {twoFactorData.enabled && !twoFactorData.showSetup && (
            <button 
              className="auth-button logout-btn"
              onClick={disable2FA}
              disabled={twoFactorLoading}
            >
              {twoFactorLoading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          )}
        </div>
        
        {/* Password Reset Section */}
        <div className="password-section">
          <h3>Password</h3>
          {!showPasswordReset ? (
            <button 
              className="auth-button secondary"
              onClick={() => setShowPasswordReset(true)}
            >
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordReset} className="password-reset-form">
              <div className="form-group">
                <label>Current Password:</label>
                <div className="password-input-container">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordResetData.currentPassword}
                    onChange={(e) => setPasswordResetData({
                      ...passwordResetData,
                      currentPassword: e.target.value
                    })}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    <i className={showPasswords.current ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password:</label>
                <div className={`password-input-container ${showPasswordMatchIndicators && passwordsMatch ? 'has-indicator' : ''}`}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordResetData.newPassword}
                    onChange={(e) => setPasswordResetData({
                      ...passwordResetData,
                      newPassword: e.target.value
                    })}
                    required
                  />
                  {showPasswordMatchIndicators && passwordsMatch && (
                    <div className="password-match-indicator show">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    <i className={showPasswords.new ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
                
                {/* Password Requirements Display */}
                {showPasswordRequirements && (
                  <div className="password-requirements">
                    <p className="requirements-title">Password must contain:</p>
                    <ul className="requirements-list">
                      <li className={passwordValidation.hasMinLength ? 'valid' : 'invalid'}>
                        <i className={passwordValidation.hasMinLength ? 'fas fa-check' : 'fas fa-times'}></i>
                        At least 8 characters
                      </li>
                      <li className={passwordValidation.hasUppercase ? 'valid' : 'invalid'}>
                        <i className={passwordValidation.hasUppercase ? 'fas fa-check' : 'fas fa-times'}></i>
                        One uppercase letter
                      </li>
                      <li className={passwordValidation.hasLowercase ? 'valid' : 'invalid'}>
                        <i className={passwordValidation.hasLowercase ? 'fas fa-check' : 'fas fa-times'}></i>
                        One lowercase letter
                      </li>
                      <li className={passwordValidation.hasNumber ? 'valid' : 'invalid'}>
                        <i className={passwordValidation.hasNumber ? 'fas fa-check' : 'fas fa-times'}></i>
                        One number
                      </li>
                      <li className={passwordValidation.hasSpecialChar ? 'valid' : 'invalid'}>
                        <i className={passwordValidation.hasSpecialChar ? 'fas fa-check' : 'fas fa-times'}></i>
                        One special character (@$!%*?&)
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Confirm New Password:</label>
                <div className={`password-input-container ${showPasswordMatchIndicators && passwordsMatch ? 'has-indicator' : ''}`}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordResetData.confirmPassword}
                    onChange={(e) => setPasswordResetData({
                      ...passwordResetData,
                      confirmPassword: e.target.value
                    })}
                    required
                  />
                  {showPasswordMatchIndicators && (
                    <div className={`password-match-indicator ${passwordsMatch ? 'show' : 'show error'}`}>
                      <i className={passwordsMatch ? "fas fa-check" : "fas fa-times"}></i>
                    </div>
                  )}
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    <i className={showPasswords.confirm ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="auth-button primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button 
                  type="button" 
                  className="auth-button secondary"
                  onClick={() => {
                    setShowPasswordReset(false);
                    setPasswordResetData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                    setShowPasswordRequirements(false);
                    setShowPasswordMatchIndicators(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
          
          {/* Logout Button */}
          <div className="logout-section">
            <button 
              className="auth-button logout-btn"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
