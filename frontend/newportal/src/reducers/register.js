import React from 'react';
import { pipe } from 'ramda';
import { pluck, switchMap, mergeMap, map, tap } from 'rxjs/operators';
import { createAction } from 'redux-actions';
import { Modal } from 'antd';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { handleActions } from 'redux-actions';
import { registerAPI, registerEmailConfirmAPI } from '../apis';
import * as Types from 'actions/Types';

/**
 * Action Creators
 */

export const register = createAction(Types.REGISTER.REQUEST);
const registerSuccess = createAction(Types.REGISTER.SUCCESS);
const registerFailure = createAction(Types.REGISTER.FAILURE);
export const registerEmailConfirm = createAction(
  Types.REGISTER_EMAIL_CONFIRM.REQUEST,
);
const registerEmailConfirmSuccess = createAction(
  Types.REGISTER_EMAIL_CONFIRM.SUCCESS,
);
const registerEmailConfirmFailure = createAction(
  Types.REGISTER_EMAIL_CONFIRM.FAILURE,
);

/**
 * Epic
 */
export const registerEpic = pipe(
  ofType(Types.REGISTER.REQUEST),
  pluck('payload'),
  switchMap(payload =>
    registerAPI(payload).pipe(
      tap(() =>
        Modal.info({
          content: (
            <div style={{ marginTop: '-8px' }}>
              驗證信已發送至您的信箱
              <br />
              若沒有收到，請重新註冊
            </div>
          ),
        }),
      ),
      mergeMap(res => [registerSuccess({ res })]),
      catchRequestError(err => {
        Modal.error({
          title: '註冊失敗',
          content: err.response.message,
        });
        return registerFailure(err);
      }),
    ),
  ),
);

export const registerEmailConfirmEpic = pipe(
  ofType(Types.REGISTER_EMAIL_CONFIRM.REQUEST),
  pluck('payload'),
  switchMap(payload =>
    registerEmailConfirmAPI(payload).pipe(
      map(res => registerEmailConfirmSuccess({ res })),
      catchRequestError(registerEmailConfirmFailure),
    ),
  ),
);

/**
 * Reducer
 */

const initialState = {
  username: '',
  userid: '',
  useremail: '',
  isRegisterFailed: false,
  isLoading: false,
  isDone: false,
  isEmailConfirmDone: false,
  errMsg: '',
};

export default handleActions(
  {
    [Types.REGISTER_EMAIL_CONFIRM.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [Types.REGISTER_EMAIL_CONFIRM.SUCCESS]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isEmailConfirmDone: true,
        username: action.payload.res.data.name,
        userid: action.payload.res.data.memberId,
        useremail: action.payload.res.data.email,
        errMsg:
          action.payload.res.errorMsg == null
            ? ''
            : action.payload.res.errorMsg,
      };
    },
    [Types.REGISTER_EMAIL_CONFIRM.FAILURE]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isEmailConfirmDone: true,
        isDone: true,
        errMsg: '此認証連結已失效',
      };
    },
    [Types.REGISTER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [Types.REGISTER.SUCCESS]: (state, action) => {
      return {
        ...state,
        isRegisterFailed: !action.payload.res.data,
        isLoading: false,
        isDone: true,
        errMsg:
          action.payload.res.errorMsg == null
            ? ''
            : action.payload.res.errorMsg,
      };
    },
    [Types.REGISTER.FAILURE]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isRegisterFailed: true,
        isDone: true,
        errMsg: action.payload.message,
      };
    },
  },
  initialState,
);
