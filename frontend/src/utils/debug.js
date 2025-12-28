// Temporary debugging utility
export const debugTokens = () => {
  console.log('=== TOKEN DEBUG ===');
  console.log('localStorage token:', localStorage.getItem('token'));
  console.log('localStorage accessToken:', localStorage.getItem('accessToken'));
  console.log('cookie token:', getCookie('token'));
  console.log('cookie accessToken:', getCookie('accessToken'));
  console.log('All cookies:', document.cookie);
};

// Helper function to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};