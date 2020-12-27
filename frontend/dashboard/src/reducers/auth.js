import { pipe } from 'ramda';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { pluck, switchMap, tap, map, mapTo, mergeMap } from 'rxjs/operators';
import { createAction } from 'redux-actions';
import { setHeader } from '../apis';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { handleActions } from 'redux-actions';
import { login } from '../apis';
import * as Types from 'actions/Types';
import { arrayToObject } from 'utils/webHelper';

/**
 * Action Creators
 */

export const loginInit = createAction(Types.AUTH_INIT.REQUEST);
const loginInitSuccess = createAction(Types.AUTH_INIT.SUCCESS);
const loginInitFailure = createAction(Types.AUTH_INIT.FAILURE);
const loginSuccess = createAction(Types.AUTH_LOGIN.SUCCESS);
const loginFailure = createAction(Types.AUTH_LOGIN.FAILURE);

/**
 * Epic
 */
export const loginEpic = pipe(
  ofType(Types.AUTH_LOGIN.REQUEST),
  pluck('payload'),
  switchMap(payload =>
    login(payload).pipe(
      tap(data => {
        Cookies.set('_dplus-dashboard_Token', data.token);
        Cookies.set('_dplus-dashboard_UserId', payload.loginId);
        Cookies.set(
          '_dplus-dashboard_Permissions',
          arrayToObject(data.managerFunctions, 'function'),
        );

        setHeader({
          Authorization: `Bearer ${data.token}`,
        });
      }),
      mergeMap(res => [
        loginSuccess({
          ...res.data,
          loginId: payload.loginId,
          permissions: arrayToObject(res.managerFunctions, 'function'),
        }),
      ]),
      catchRequestError(err => {
        if (err.status === 500) {
          message.error(err.response.message);
        }
        return loginFailure(err);
      }),
    ),
  ),
);

export const logoutEpic = pipe(
  ofType(Types.AUTH_LOGOUT.REQUEST),
  tap(() => {
    Cookies.remove('_dplus-dashboard_Token');
    Cookies.remove('_dplus-dashboard_UserId');
    Cookies.remove('_dplus-dashboard_Permissions');
    setHeader();
  }),
  mapTo({ type: Types.AUTH_LOGOUT.SUCCESS }),
);

export const loginInitEpic = pipe(
  ofType(Types.AUTH_INIT.REQUEST),
  map(() => {
    const {
      '_dplus-dashboard_Token': token,
      '_dplus-dashboard_UserId': loginId,
      '_dplus-dashboard_Permissions': permissions,
    } = Cookies.getJSON();
    if (!token) {
      throw new Error();
    }
    return {
      token,
      loginId,
      permissions,
    };
  }),
  tap(({ token, nonce }) => {
    setHeader({
      Authorization: `Bearer ${token}`,
    });
  }),
  map(payload => {
    return loginInitSuccess(payload);
  }),
  catchRequestError(loginInitFailure),
);

/**
 * Reducer
 */

const initialState = {
  token: '',
  id: '',
  permissions: {},
  isAuthenticated: false,
  isLoginFailed: false,
  isLoading: false,
};

export default handleActions(
  {
    [Types.AUTH_LOGIN.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [Types.AUTH_LOGIN.SUCCESS]: (state, action) => {
      return {
        ...state,
        id: action.payload.loginId,
        token: action.payload.token,
        loginId: action.payload.loginId,
        permissions: action.payload.permissions,
        isAuthenticated: true,
        isLoginFailed: false,
      };
    },
    [Types.AUTH_LOGIN.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
      isLoginFailed: true,
    }),
    [Types.AUTH_INIT.SUCCESS]: (state, action) => {
      return {
        ...state,
        id: action.payload.loginId,
        token: action.payload.token,
        loginId: action.payload.loginId,
        permissions: action.payload.permissions,
        isAuthenticated: true,
      };
    },
    [Types.AUTH_LOGOUT.SUCCESS]: (state, action) => ({
      ...initialState,
    }),
  },
  initialState,
);
