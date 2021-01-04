import { pipe } from 'ramda';
import { Modal } from 'antd';
import Cookies from 'js-cookie';
import { pluck, switchMap, tap, map, mapTo, mergeMap } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { createAction } from 'redux-actions';
import { setHeader, loginAPI } from '../apis';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { handleActions } from 'redux-actions';
import { isNil } from 'ramda';
import * as Types from 'actions/Types';

import fake from 'fake/func';
import { arrayToObject } from 'utils/webHelper';
const { error } = Modal;

/**
 * Action Creators
 */

export const login = createAction(Types.AUTH_LOGIN.REQUEST);
export const logout = createAction(Types.AUTH_LOGOUT.REQUEST);
export const loginInit = createAction(Types.AUTH_INIT.REQUEST);
const loginInitSuccess = createAction(Types.AUTH_INIT.SUCCESS);
const loginInitFailure = createAction(Types.AUTH_INIT.FAILURE);
const loginSuccess = createAction(Types.AUTH_LOGIN.SUCCESS);
const loginFailure = createAction(Types.AUTH_LOGIN.FAILURE);

/**
 * Epic
 */

export const loginEpic = (actions, { dispatch }) =>
  actions.pipe(
    ofType(Types.AUTH_LOGIN.REQUEST),
    pluck('payload'),
    switchMap((payload) =>
      loginAPI(payload).pipe(
        tap((data) => {
          Cookies.set('_dplusToken', data.token);
          Cookies.set('_dplusUserId', payload.loginId);
          Cookies.set('_dplus-dashboard_UserId', 'my_demo');
          Cookies.set('_dplus-dashboard_Token', data.token);
          Cookies.set(
            '_dplus-dashboard_Permissions',
            arrayToObject(fake.managerFunctions, 'function'),
          );

          if (payload.rememberMe) {
            Cookies.set('_dplusRememberUserId', payload.loginId);
          }
          if (!payload.rememberMe) {
            Cookies.remove('_dplusRememberUserId');
          }

          setHeader({
            Authorization: `Bearer ${data.token}`,
          });

          if (payload.url) {
            dispatch(push(payload.url));
          }
        }),
        mergeMap((res) => [
          loginSuccess({
            ...res.data,
            loginId: payload.loginId,
            rememberUserId: payload.rememberMe ? payload.loginId : '',
          }),
        ]),
        catchRequestError((err) => {
          if (err.status === 500) {
            error({ content: err.response.message });
          }
          return loginFailure(err);
        }),
      ),
    ),
  );

export const logoutEpic = pipe(
  ofType(Types.AUTH_LOGOUT.REQUEST),
  tap(() => {
    Cookies.remove('_dplusToken');
    Cookies.remove('_dplusUserId');
    Cookies.remove('_dplus-dashboard_UserId');
    Cookies.remove('_dplus-dashboard_Token');
    Cookies.remove('_dplus-dashboard_Permissions');

    setHeader();
  }),
  mapTo({ type: Types.AUTH_LOGOUT.SUCCESS }),
);

export const loginInitEpic = pipe(
  ofType(Types.AUTH_INIT.REQUEST),
  map(() => {
    const { _dplusToken, _dplusUserId, _dplusRememberUserId } = Cookies.get();
    return {
      token: _dplusToken,
      loginId: _dplusUserId,
      rememberUserId: _dplusRememberUserId,
      isAuthenticated: !isNil(_dplusToken),
    };
  }),
  tap(({ token, isAuthenticated }) => {
    if (isAuthenticated) {
      setHeader({
        Authorization: `Bearer ${token}`,
      });
    }
  }),
  map((payload) => {
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
  rememberUserId: '',
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
        rememberUserId: action.payload.rememberUserId,
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
        rememberUserId: action.payload.rememberUserId,
        isAuthenticated: action.payload.isAuthenticated,
      };
    },
    [Types.AUTH_LOGOUT.SUCCESS]: (state, action) => ({
      ...initialState,
      rememberUserId: state.rememberUserId,
    }),
  },
  initialState,
);
