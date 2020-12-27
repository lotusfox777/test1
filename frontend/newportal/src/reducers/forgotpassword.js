import { pipe } from 'ramda';
import { pluck, switchMap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import { Modal } from 'antd';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { handleActions } from 'redux-actions';
import { forgotpasswordAPI, resetPasswordAPI, resetPasswordEmailconfirmAPI } from '../apis';
import * as Types from 'actions/Types';
import { ACTIVITY_MAP } from 'constants/routes';

const { error, info } = Modal;

/**
 * Action Creators
 */
export const forgotpassword = createAction(Types.FORGOT_PASSWORD.REQUEST);
const forgotpasswordSucess = createAction(Types.FORGOT_PASSWORD.SUCCESS);
const forgotpasswordFailure = createAction(Types.FORGOT_PASSWORD.FAILURE);
export const resetpassword = createAction(Types.RESET_PASSWORD.REQUEST);
const resetpasswordSuccess = createAction(Types.RESET_PASSWORD.SUCCESS);
const resetpasswordFailure = createAction(Types.RESET_PASSWORD.FAILURE);

export const resetpasswordEmailConfirm = createAction(Types.RESET_PASSWORD_EMAIL_CONFIRM.REQUEST);
const resetpasswordEmailConfirmSuccess = createAction(Types.RESET_PASSWORD_EMAIL_CONFIRM.SUCCESS);
const resetpasswordEmailConfirmFailure = createAction(Types.RESET_PASSWORD_EMAIL_CONFIRM.FAILURE);

export const initpassword = createAction(Types.INIT_PASSWORD.REQUEST);
const initpasswordSucess = createAction(Types.INIT_PASSWORD.SUCCESS);
const initpasswordFailure = createAction(Types.INIT_PASSWORD.FAILURE);

/**
 * Epic
 */
export const forgotpasswordEpic = pipe(
  ofType(Types.FORGOT_PASSWORD.REQUEST),
  pluck('payload'),
  switchMap(payload =>
    forgotpasswordAPI(payload).pipe(
      map(res => forgotpasswordSucess({ res })),
      catchRequestError(err => {
        error({ content: err.response.message });
        return forgotpasswordFailure(err);
      }),
    ),
  ),
);

export const resetpasswordEpic = (actions, { dispatch }) =>
  actions.pipe(
    ofType(Types.RESET_PASSWORD.REQUEST),
    pluck('payload'),
    switchMap(({ token, password }) =>
      forkJoin([resetPasswordEmailconfirmAPI(token), resetPasswordAPI({ token, password })]).pipe(
        map(([{ data: { memberId } }]) => {
          info({
            content: '密碼已變更成功',
            onOk() {
              window.location = '/';
            },
          });
          return resetpasswordSuccess();
        }),
        catchRequestError(err => {
          error({
            content: err.response.message,
            onOk() {
              if (err.response.message === '此認証連結已失效') {
                dispatch(push(ACTIVITY_MAP));
              }
            },
          });
          return resetpasswordFailure(err);
        }),
      ),
    ),
  );

export const resetpasswordEmailConfirmEpic = pipe(
  ofType(Types.RESET_PASSWORD_EMAIL_CONFIRM.REQUEST),
  pluck('payload'),
  switchMap(payload =>
    resetPasswordEmailconfirmAPI(payload).pipe(
      map(res => resetpasswordEmailConfirmSuccess({ res })),
      catchRequestError(resetpasswordEmailConfirmFailure),
    ),
  ),
);

export const initpasswordEpic = pipe(
  ofType(Types.INIT_PASSWORD.REQUEST),
  pluck('payload'),
  map(() => initpasswordSucess()),
  catchRequestError(err => initpasswordFailure(err)),
);

/**
 * Reducer
 */

const initialState = {
  isLoading: false,
  isDone: false,
  errMsg: '',
  username: '',
  useremail: '',
  userid: '',
};

export default handleActions(
  {
    [Types.FORGOT_PASSWORD.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [Types.FORGOT_PASSWORD.SUCCESS]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isDone: true,
        errMsg: action.payload.res.errorMsg == null ? '' : action.payload.res.errorMsg,
      };
    },
    [Types.FORGOT_PASSWORD.FAILURE]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        isDone: true,
        errMsg: action.payload.error,
      };
    },
    [Types.RESET_PASSWORD.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [Types.RESET_PASSWORD.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [Types.RESET_PASSWORD.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [Types.RESET_PASSWORD_EMAIL_CONFIRM.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [Types.RESET_PASSWORD_EMAIL_CONFIRM.SUCCESS]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        errMsg: action.payload.res.errorMsg == null ? '' : action.payload.res.errorMsg,
        username: action.payload.res.data.name,
        useremail: action.payload.res.data.email,
        userid: action.payload.res.data.memberId,
      };
    },
    [Types.RESET_PASSWORD_EMAIL_CONFIRM.FAILURE]: (state, action) => {
      return {
        ...state,
        isLoading: false,
        errMsg: action.payload.error,
      };
    },
    [Types.INIT_PASSWORD.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false,
      isDone: false,
      errMsg: '',
      username: '',
      useremail: '',
      userid: '',
    }),
    [Types.INIT_PASSWORD.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
  },
  initialState,
);
