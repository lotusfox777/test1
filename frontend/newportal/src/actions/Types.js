/**
 * helper functions
 */

export const createRequestTypes = baseType => ({
  REQUEST: `${baseType}_REQUEST`,
  SUCCESS: `${baseType}_SUCCESS`,
  FAILURE: `${baseType}_FAILURE`,
});

/**
 * Authentication Types
 */
export const AUTH_INIT = createRequestTypes('AUTH_INIT');
export const AUTH_LOGIN = createRequestTypes('AUTH_LOGIN');
export const AUTH_LOGOUT = createRequestTypes('AUTH_LOGOUT');
export const AUTH_SERVER_ERROR = 'AUTH_SERVER_ERROR';

export const REGISTER = createRequestTypes('REGISTER');
export const REGISTER_SERVER_ERROR = 'REGISTER_SERVER_ERROR';
export const REGISTER_ACTIVE = createRequestTypes('REGISTER_ACTIVE');
export const REGISTER_ACTIVE_SERVER_ERROR = 'REGISTER_ACTIVE_SERVER_ERROR';
export const REGISTER_EMAIL_CONFIRM = createRequestTypes('REGISTER_EMAIL_CONFIRM');
export const REGISTER_EMAIL_CONFIRM_SERVER_ERROR = 'REGISTER_EMAIL_CONFIRM_SERVER_ERROR';

export const FORGOT_PASSWORD = createRequestTypes('FORGOT_PASSWORD');
export const FORGOT_PASSWORD_SERVER_ERROR = 'FORGOT_PASSWORD_SERVER_ERROR';

export const RESET_PASSWORD = createRequestTypes('RESET_PASSWORD');
export const RESET_PASSWORD_SERVER_ERROR = 'RESET_PASSWORD_SERVER_ERROR';
export const RESET_PASSWORD_EMAIL_CONFIRM = createRequestTypes('RESET_PASSWORD_EMAIL_CONFIRM');
export const RESET_PASSWORD_EMAIL_CONFIRM_SERVER_ERROR =
  'RESET_PASSWORD_EMAIL_CONFIRM_SERVER_ERROR';

export const INIT_PASSWORD = createRequestTypes('INIT_PASSWORD');
