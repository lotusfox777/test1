import * as Types from 'actions/Types';

const initialState = {
  isInitCookieAuth: true,
  isServerError: false,
  error: {
    status: null,
    response: {
      error: {}
    },
    timestamp: null
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
  case Types.AUTH_INIT.SUCCESS:
  case Types.AUTH_INIT.FAILURE:
    return {
      ...state,
      isInitCookieAuth: false,

    };
  case Types.AUTH_SERVER_ERROR:
    return {
      ...state,
      isServerError: true,
      error: {
        ...action.payload,
        timestamp: Date.now()
      }
    };
  case Types.AUTH_LOGIN.SUCCESS:
  case Types.AUTH_LOGOUT.SUCCESS:
    return {
      ...state,
      isServerError: false,
      error: initialState.error
    };
  default:
    return state;
  }
};
