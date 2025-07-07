// Authentication utilities
import CryptoJS from 'crypto-js';

// Secret key for encryption (should be in environment variables in production)
const SECRET_KEY = 'UNDANGIN_SECRET_2024';

/**
 * Encrypt sensitive data
 */
export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

/**
 * Decrypt sensitive data
 */
export const decrypt = (encryptedText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * Generate access code based on guest data
 */
export const generateGuestCode = (guestName, eventDate) => {
  const normalizedName = guestName.toLowerCase().replace(/\s+/g, '');
  const dateStr = eventDate.replace(/-/g, '');
  const combined = normalizedName + dateStr;
  
  return CryptoJS.MD5(combined).toString().substring(0, 8).toUpperCase();
};

/**
 * Validate access code against guest list
 */
export const validateAccessCode = (code, guestList) => {
  if (!code) return false;
  
  // Check if guest exists in guest list by code
  const guest = guestList.find(g => 
    g.code.toUpperCase() === code.toUpperCase()
  );
  
  return !!guest;
};

/**
 * Extract access parameters from URL
 */
export const getAccessParamsFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    code: urlParams.get('code'),
    guest: urlParams.get('guest'),
    token: urlParams.get('token')
  };
};

/**
 * Generate unique invitation URL for guest
 */
export const generateInvitationURL = (guest, baseURL) => {
  return `${baseURL}?code=${guest.code}`;
};

/**
 * Rate limiting helper
 */
export const rateLimiter = {
  attempts: new Map(),
  
  canAttempt(identifier, maxAttempts = 5, timeWindow = 300000) { // 5 attempts per 5 minutes
    const now = Date.now();
    const key = identifier.toLowerCase();
    
    if (!this.attempts.has(key)) {
      this.attempts.set(key, []);
    }
    
    const attempts = this.attempts.get(key);
    
    // Remove old attempts outside time window
    const recentAttempts = attempts.filter(time => now - time < timeWindow);
    this.attempts.set(key, recentAttempts);
    
    return recentAttempts.length < maxAttempts;
  },
  
  recordAttempt(identifier) {
    const key = identifier.toLowerCase();
    const attempts = this.attempts.get(key) || [];
    attempts.push(Date.now());
    this.attempts.set(key, attempts);
  }
};

/**
 * Check if current time is within access window
 */
export const isWithinAccessWindow = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return now >= start && now <= end;
};

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Sanitize guest name input (allows spaces and common name characters)
 */
export const sanitizeGuestName = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/[^\w\s\-'\.]/g, '') // Only allow letters, numbers, spaces, hyphens, apostrophes, dots
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

/**
 * Sanitize access code input (alphanumeric only)
 */
export const sanitizeAccessCode = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[^a-zA-Z0-9]/g, '') // Only allow alphanumeric characters
    .toUpperCase() // Convert to uppercase for consistency
    .trim();
};

/**
 * Validate guest session
 */
export const validateGuestSession = () => {
  const sessionData = localStorage.getItem('undangin_session');
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData);
    const now = Date.now();
    
    // Check if session is expired (24 hours)
    if (now - session.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('undangin_session');
      return null;
    }
    
    return session;
  } catch (error) {
    localStorage.removeItem('undangin_session');
    return null;
  }
};

/**
 * Create guest session
 */
export const createGuestSession = (guestData) => {
  const session = {
    ...guestData,
    timestamp: Date.now(),
    sessionId: CryptoJS.MD5(guestData.name + Date.now()).toString()
  };
  
  localStorage.setItem('undangin_session', JSON.stringify(session));
  return session;
};

/**
 * Clear guest session
 */
export const clearGuestSession = () => {
  localStorage.removeItem('undangin_session');
};