import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthStyles.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      setMessage(response.data.message);
      if (response.data.success) {
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/auth/verify-otp', { email, otp });
      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setMessage('OTP verified! Please enter your new password.');
        setStep(3);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
  
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    // Updated validation to match backend requirements
    if (newPassword.length < 12) {
      setError('Password must be at least 12 characters long');
      setLoading(false);
      return;
    }
  
    // Add comprehensive password validation
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  
    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChars) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      setLoading(false);
      return;
    }
  
    try {
      await axios.post('/api/auth/reset-password-with-token', {
        token: resetToken,
        password: newPassword
      });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.details?.[0]?.message || 
                          'Failed to reset password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="reset-password-header">Reset Password</h2>
          
          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email address"
                />
              </div>
              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleOTPSubmit}>
              <p>We've sent a 6-digit verification code to {email}</p>
              <div className="form-group">
                <label>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '2px' }}
                />
              </div>
              <button type="submit" className="auth-button primary" disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button 
                type="button" 
                className="auth-button secondary" 
                onClick={() => setStep(1)}
                style={{ marginTop: '10px' }}
              >
                Back to Email
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password (min 12 chars, uppercase, lowercase, number, special char)"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" className="auth-button primary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <div className="auth-links">
            <button onClick={() => navigate('/login')} className="back-to-login-btn">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;