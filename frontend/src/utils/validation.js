/**
 * Validation Utilities
 * 
 * Common validation functions for forms and user input.
 * Centralized to ensure consistency across the app.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const VALID_USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }
  
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: "Invalid email format" };
  }
  
  return { valid: true };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  
  return { valid: true };
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateUsername(username) {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required" };
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < MIN_USERNAME_LENGTH) {
    return { valid: false, error: `Username must be at least ${MIN_USERNAME_LENGTH} characters` };
  }
  
  if (trimmed.length > MAX_USERNAME_LENGTH) {
    return { valid: false, error: `Username must be no more than ${MAX_USERNAME_LENGTH} characters` };
  }
  
  if (!VALID_USERNAME_PATTERN.test(trimmed)) {
    return { valid: false, error: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  
  return { valid: true };
}

/**
 * Validate display name
 * @param {string} displayName - Display name to validate
 * @returns {object} { valid: boolean, error?: string }
 */
export function validateDisplayName(displayName) {
  if (!displayName || typeof displayName !== "string") {
    return { valid: false, error: "Display name is required" };
  }
  
  const trimmed = displayName.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: "Display name cannot be empty" };
  }
  
  if (trimmed.length > 50) {
    return { valid: false, error: "Display name must be no more than 50 characters" };
  }
  
  return { valid: true };
}

/**
 * Validate login form data
 * @param {{ email: string, password: string }} data - Form data
 * @returns {object} { valid: boolean, errors: { field: string } }
 */
export function validateLoginForm(data) {
  const errors = {};
  
  const emailValidation = validateEmail(data?.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  const passwordValidation = validatePassword(data?.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate registration form data
 * @param {{ email: string, username: string, password: string }} data - Form data
 * @returns {object} { valid: boolean, errors: { field: string } }
 */
export function validateRegisterForm(data) {
  const errors = {};
  
  const emailValidation = validateEmail(data?.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  const usernameValidation = validateUsername(data?.username);
  if (!usernameValidation.valid) errors.username = usernameValidation.error;
  
  const passwordValidation = validatePassword(data?.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
