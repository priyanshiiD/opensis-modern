/**
 * HTTP Error Handling Utilities
 * 
 * Provides standardized error handling and parsing for API responses
 */

/**
 * Parse HTTP error response
 * Extracts meaningful error messages from API responses
 */
export function parseHttpError(error) {
  // Network error
  if (!error.response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection.',
      status: null
    };
  }

  const { status, data } = error.response;
  const errorData = data?.error || data;

  return {
    code: errorData?.code || `HTTP_${status}`,
    message: errorData?.message || 'An error occurred',
    status,
    details: errorData
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error) {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API error responses
 */
export function handleApiError(error) {
  console.error('API Error:', {
    status: error.status,
    code: error.code,
    message: error.message,
    details: error.details
  });

  // Return structured error object
  return {
    ...error,
    userMessage: getUserFriendlyErrorMessage(error)
  };
}

/**
 * Validation error messages
 */
export const ValidationMessages = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must not exceed ${max} characters`,
  PASSWORD_WEAK: 'Password must contain uppercase, lowercase, and numbers',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  USERNAME_TAKEN: 'This username is already in use',
  EMAIL_TAKEN: 'This email is already registered'
};

/**
 * Common HTTP status codes and messages
 */
export const HttpStatus = {
  400: 'Bad request',
  401: 'Unauthorized - Please log in again',
  403: 'Forbidden - You do not have permission',
  404: 'Not found',
  409: 'Conflict - Resource already exists',
  422: 'Validation error',
  429: 'Too many requests - Please try again later',
  500: 'Server error - Please try again later',
  503: 'Service unavailable'
};

/**
 * Get HTTP status message
 */
export function getHttpStatusMessage(status) {
  return HttpStatus[status] || `HTTP Error ${status}`;
}
