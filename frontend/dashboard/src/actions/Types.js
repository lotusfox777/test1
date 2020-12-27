/**
 * helper functions
 */

export const createRequestTypes = baseType => ({
  REQUEST: `${baseType}_REQUEST`,
  SUCCESS: `${baseType}_SUCCESS`,
  FAILURE: `${baseType}_FAILURE`
});

/**
 * Authentication Types
 */
export const AUTH_INIT = createRequestTypes('AUTH_INIT');
export const AUTH_LOGIN = createRequestTypes('AUTH_LOGIN');
export const AUTH_LOGOUT = createRequestTypes('AUTH_LOGOUT');
export const AUTH_SERVER_ERROR = 'AUTH_SERVER_ERROR';
