const { sendEmail } = require('./email');

// Security event types
const SECURITY_EVENTS = {
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET: 'password_reset',
  SUSPICIOUS_LOGIN: 'suspicious_login',
  ACCOUNT_LOCKED: 'account_locked',
  NEW_DEVICE_LOGIN: 'new_device_login'
};

// Send security notification email
const sendSecurityNotification = async (email, eventType, eventData) => {
  let subject, message;
  
  switch (eventType) {
    case SECURITY_EVENTS.PASSWORD_CHANGED:
      subject = 'Security Alert: Your password was changed';
      message = `
        <p>Your password was changed on ${new Date(eventData.timestamp).toLocaleString()}.</p>
        <p>IP Address: ${eventData.ipAddress}</p>
        <p>If you did not make this change, please contact support immediately.</p>
      `;
      break;
      
    case SECURITY_EVENTS.PASSWORD_RESET:
      subject = 'Security Alert: Your password was reset';
      message = `
        <p>Your password was reset on ${new Date(eventData.timestamp).toLocaleString()}.</p>
        <p>IP Address: ${eventData.ipAddress}</p>
        <p>If you did not request this reset, please contact support immediately.</p>
      `;
      break;
      
    case SECURITY_EVENTS.SUSPICIOUS_LOGIN:
      subject = 'Security Alert: Suspicious login detected';
      message = `
        <p>A suspicious login attempt was detected on ${new Date(eventData.timestamp).toLocaleString()}.</p>
        <p>IP Address: ${eventData.ipAddress}</p>
        <p>Location: ${eventData.location || 'Unknown'}</p>
        <p>Device: ${eventData.device || 'Unknown'}</p>
        <p>If this wasn't you, please change your password immediately.</p>
      `;
      break;
      
    case SECURITY_EVENTS.ACCOUNT_LOCKED:
      subject = 'Security Alert: Your account has been locked';
      message = `
        <p>Your account has been locked due to multiple failed login attempts.</p>
        <p>Time: ${new Date(eventData.timestamp).toLocaleString()}</p>
        <p>IP Address: ${eventData.ipAddress}</p>
        <p>Your account will be automatically unlocked after ${eventData.lockDuration || '2 hours'}.</p>
        <p>If you need immediate access, please use the password reset function.</p>
      `;
      break;
      
    case SECURITY_EVENTS.NEW_DEVICE_LOGIN:
      subject = 'Security Alert: New device login';
      message = `
        <p>A new device was used to log into your account on ${new Date(eventData.timestamp).toLocaleString()}.</p>
        <p>IP Address: ${eventData.ipAddress}</p>
        <p>Device: ${eventData.device || 'Unknown'}</p>
        <p>Location: ${eventData.location || 'Unknown'}</p>
        <p>If this wasn't you, please change your password immediately and contact support.</p>
      `;
      break;
      
    default:
      subject = 'Security Alert';
      message = `
        <p>A security event occurred on your account on ${new Date(eventData.timestamp).toLocaleString()}.</p>
        <p>If you did not initiate this action, please contact support immediately.</p>
      `;
  }
  
  try {
    await sendEmail({
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">Security Alert</h2>
          ${message}
          <p style="margin-top: 20px;">If you did not perform this action, please secure your account immediately:</p>
          <ol>
            <li>Change your password</li>
            <li>Review your recent account activity</li>
            <li>Contact our support team</li>
          </ol>
          <p>Thank you for helping keep your account secure.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send security notification:', error);
    return false;
  }
};

module.exports = {
  sendSecurityNotification,
  SECURITY_EVENTS
};