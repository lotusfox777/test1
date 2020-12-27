import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message, Modal } from 'antd';
import { switchMap, map, tap, mergeMap } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import {
  listUsersAPI,
  updateUserAPI,
  getUserAPI,
  getCurrentUserAPI,
  getLineBindingUrlAPI,
  linkingAccounToLineAPI,
  unbindingAccounToLineAPI,
  verifyPhoneAPI,
  getVerifyCodeAPI,
  changePasswordAPI,
  changeEmailAPI,
  changeEmailConfirmedAPI,
} from '../apis';

/**
 * Enum
 */

export const Status = {
  '1': '已綁定',
  '-1': '未綁定',
};

/**
 * Action Types
 */

const LIST_USERS = createRequestTypes('LIST_USERS');
const UPDATE_USER = createRequestTypes('UPDATE_USER');
const GET_USER = createRequestTypes('GET_USER');
const GET_CURRENT_USER = createRequestTypes('GET_CURRENT_USER');
const CLEAR_USER = createRequestTypes('CLEAR_USER');
const GET_LINE_BINDING_URL = createRequestTypes('GET_LINE_BINDING_URL');
const RESET_LINE_BINDING_URL = createRequestTypes('RESET_LINE_BINDING_URL');
const BINDING_LINE = createRequestTypes('BINDING_LINE');
const BINDING_MOBILE = createRequestTypes('BINDING_MOBILE');
const UNBINDING_LINE = createRequestTypes('UNBINDING_LINE');
const GET_VERIFY_CODE = createRequestTypes('GET_VERIFY_CODE');
const VERIFY_PHONE = createRequestTypes('VERIFY_PHONE');
const CHANGE_EMAIL = createRequestTypes('CHANGE_EMAIL');
const CHANGE_PASSWORD = createRequestTypes('CHANGE_PASSWORD');
const CHANGE_EMAIL_CONFIRMED = createRequestTypes('CHANGE_EMAIL_CONFIRMED');

/**
 * Action Creator
 */
export const listUsers = createAction(LIST_USERS.REQUEST);
export const updateUser = createAction(UPDATE_USER.REQUEST);
export const getUser = createAction(GET_USER.REQUEST);
export const getCurrentUser = createAction(GET_CURRENT_USER.REQUEST);
export const getLineBindingUrl = createAction(GET_LINE_BINDING_URL.REQUEST);
export const resetLineBindingUrl = createAction(RESET_LINE_BINDING_URL.SUCCESS);
export const clearUser = createAction(CLEAR_USER.REQUEST);
export const bindingLine = createAction(BINDING_LINE.REQUEST);
export const bindingMobile = createAction(BINDING_MOBILE.REQUEST);
export const unbindingLine = createAction(UNBINDING_LINE.REQUEST);
export const getVerifyCode = createAction(GET_VERIFY_CODE.REQUEST);
export const verifyPhone = createAction(VERIFY_PHONE.REQUEST);
export const changeEmail = createAction(CHANGE_EMAIL.REQUEST);
export const changePassword = createAction(CHANGE_PASSWORD.REQUEST);
export const changeEmailConfirmed = createAction(CHANGE_EMAIL_CONFIRMED.REQUEST);

/**
 * Epics
 */

export const listUsersEpic = pipe(
  ofType(LIST_USERS.REQUEST),
  switchMap(({ payload = '' }) =>
    listUsersAPI(payload).pipe(
      map(createAction(LIST_USERS.SUCCESS)),
      catchRequestError(createAction(LIST_USERS.FAILURE)),
    ),
  ),
);

export const updateUserEpic = pipe(
  ofType(UPDATE_USER.REQUEST),
  switchMap(({ payload = {} }) =>
    updateUserAPI(payload).pipe(
      tap(() => message.success('修改用戶成功')),
      mergeMap(() => [createAction(UPDATE_USER.SUCCESS)(), getCurrentUser()]),
      catchRequestError(e => {
        message.error(`修改用戶失敗 (${e.message})`);
        return createAction(UPDATE_USER.FAILURE)();
      }),
    ),
  ),
);

export const getUserEpic = pipe(
  ofType(GET_USER.REQUEST),
  switchMap(({ payload = '' }) =>
    getUserAPI(payload).pipe(
      map(createAction(GET_USER.SUCCESS)),
      catchRequestError(createAction(GET_USER.FAILURE)),
    ),
  ),
);

export const getCurrentUserEpic = pipe(
  ofType(GET_CURRENT_USER.REQUEST),
  switchMap(({ payload = '' }) =>
    getCurrentUserAPI(payload).pipe(
      map(createAction(GET_CURRENT_USER.SUCCESS)),
      catchRequestError(createAction(GET_CURRENT_USER.FAILURE)),
    ),
  ),
);

export const getLineBindingUrlEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(GET_LINE_BINDING_URL.REQUEST),
    switchMap(({ payload = {} }) =>
      getLineBindingUrlAPI(payload).pipe(
        map(url =>
          createAction(GET_LINE_BINDING_URL.SUCCESS)({
            url,
          }),
        ),
        catchRequestError(err => {
          message.error(`綁定 Line 失敗： ${err.response.message}`);
          return createAction(GET_LINE_BINDING_URL.FAILURE)();
        }),
      ),
    ),
  );

export const bindingLineEpic = pipe(
  ofType(BINDING_LINE.REQUEST),
  switchMap(({ payload = {} }) =>
    linkingAccounToLineAPI(payload).pipe(
      tap(() => message.success('Line 綁定成功')),
      mergeMap(() => [createAction(BINDING_LINE.SUCCESS)(), getCurrentUser()]),
      catchRequestError(err => {
        message.error(`綁定 Line 失敗： ${err.response.message}`);
        return createAction(BINDING_LINE.FAILURE)();
      }),
    ),
  ),
);

export const unbindingLineEpic = pipe(
  ofType(UNBINDING_LINE.REQUEST),
  switchMap(({ payload = {} }) =>
    unbindingAccounToLineAPI(payload).pipe(
      tap(() => message.success('Line 已解除綁定')),
      mergeMap(() => [createAction(UNBINDING_LINE.SUCCESS)(), getCurrentUser()]),
      catchRequestError(err => {
        Modal.error({ title: err.response.message });
        return createAction(UNBINDING_LINE.FAILURE)();
      }),
    ),
  ),
);

export const verifyPhoneEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(VERIFY_PHONE.REQUEST),
    switchMap(({ payload: { authToken, executeOnSuccess } = {} }) =>
      verifyPhoneAPI(authToken).pipe(
        tap(() =>
          Modal.success({
            title: '手機已認證成功',
            onOk() {
              executeOnSuccess && executeOnSuccess();
            },
          }),
        ),
        mergeMap(() => [createAction(VERIFY_PHONE.SUCCESS)(), getUser(makeGetUserId(getState()))]),
        catchRequestError(err => {
          Modal.error({ title: '驗證碼錯誤，請重新輸入' });
          return createAction(VERIFY_PHONE.FAILURE)();
        }),
      ),
    ),
  );

export const getVerifyCodeEpic = pipe(
  ofType(GET_VERIFY_CODE.REQUEST),
  switchMap(({ payload = {} }) =>
    getVerifyCodeAPI(payload).pipe(
      map(createAction(GET_VERIFY_CODE.SUCCESS)),
      catchRequestError(err => {
        message.error(err.response.message);
        return createAction(GET_VERIFY_CODE.FAILURE)();
      }),
    ),
  ),
);

export const changePasswordEpic = pipe(
  ofType(CHANGE_PASSWORD.REQUEST),
  switchMap(({ payload: { executeOnSuccess, ...body } = {} }) =>
    changePasswordAPI(body).pipe(
      tap(() => {
        Modal.success({ title: '密碼已變更成功' });
        executeOnSuccess && executeOnSuccess();
      }),
      map(createAction(CHANGE_PASSWORD.SUCCESS)),
      catchRequestError(error => {
        Modal.error({ title: error.response.message });
        return createAction(CHANGE_PASSWORD.FAILURE)();
      }),
    ),
  ),
);

export const changeEmailEpic = pipe(
  ofType(CHANGE_EMAIL.REQUEST),
  switchMap(({ payload: { body, executeOnSuccess } = {} }) =>
    changeEmailAPI(body).pipe(
      tap(() =>
        Modal.success({
          title: '已發送驗證信到您的新Email信箱，待驗證後完成變更',
          onOk() {
            executeOnSuccess();
          },
        }),
      ),
      map(createAction(CHANGE_EMAIL.SUCCESS)),
      catchRequestError(error => {
        Modal.error({ title: error.response.message });
        return createAction(CHANGE_EMAIL.FAILURE)();
      }),
    ),
  ),
);

export const changeEmailConfirmedEpic = pipe(
  ofType(CHANGE_EMAIL_CONFIRMED.REQUEST),
  switchMap(({ payload: { token, onCompleted } = {} }) =>
    changeEmailConfirmedAPI(token).pipe(
      tap(() =>
        Modal.success({
          title: '信箱已變更成功',
          onOk() {
            onCompleted();
          },
        }),
      ),
      map(createAction(CHANGE_EMAIL_CONFIRMED.SUCCESS)),
      catchRequestError(error => {
        Modal.error({ title: error.response.message });
        return createAction(CHANGE_EMAIL_CONFIRMED.FAILURE)();
      }),
    ),
  ),
);

const initalState = {
  isLoading: false,
  isUpdating: false,
  isUpdatingEmail: false,
  isVerifyingEmail: false,
  content: [],
  currentUser: {
    masterCards: [],
    slaveCards: [],
  },
  userById: {
    masterCards: [],
    slaveCards: [],
  },
  totalPages: 0,
  verifyPhone: {
    isSending: false,
    isSended: false,
    isVerifying: false,
    isVerified: false,
    isFailed: false,
  },
  lineOAuthParams: {},
};

export default handleActions(
  {
    [LIST_USERS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_USERS.SUCCESS]: (state, action) => ({
      ...state,
      content: action.payload.data,
      totalPages: action.payload.totalPages,
      isLoading: false,
    }),
    [LIST_USERS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [UPDATE_USER.REQUEST]: (state, action) => ({
      ...state,
      isUpdating: true,
    }),
    [UPDATE_USER.SUCCESS]: (state, action) => ({
      ...state,
      isUpdating: false,
    }),
    [UPDATE_USER.FAILURE]: (state, action) => ({
      ...state,
      isUpdating: false,
    }),
    [GET_USER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [GET_USER.SUCCESS]: (state, action) => ({
      ...state,
      userById: action.payload.data,
      isLoading: false,
    }),
    [GET_USER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [GET_CURRENT_USER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [GET_CURRENT_USER.SUCCESS]: (state, action) => ({
      ...state,
      currentUser: action.payload.data,
      isLoading: false,
    }),
    [GET_CURRENT_USER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [CLEAR_USER.REQUEST]: (state, action) => ({
      ...state,
      currentUser: initalState.currentUser,
    }),
    [GET_VERIFY_CODE.REQUEST]: (state, action) => ({
      ...state,
      verifyPhone: {
        ...state.verifyPhone,
        isSending: true,
      },
    }),
    [GET_VERIFY_CODE.SUCCESS]: (state, action) => ({
      ...state,
      verifyPhone: {
        ...state.verifyPhone,
        isSending: false,
        isSended: true,
      },
    }),
    [GET_VERIFY_CODE.FAILURE]: (state, action) => ({
      ...state,
      verifyPhone: {
        ...state.verifyPhone,
        isSending: false,
      },
    }),
    [VERIFY_PHONE.REQUEST]: (state, action) => ({
      ...state,
      verifyPhone: {
        ...state.verifyPhone,
        isVerifying: true,
        isVerified: false,
        isFailed: false,
      },
    }),
    [VERIFY_PHONE.SUCCESS]: (state, action) => ({
      ...state,
      verifyPhone: {
        ...state.verifyPhone,
        isVerifying: false,
        isVerified: true,
        isFailed: false,
      },
    }),
    [VERIFY_PHONE.FAILURE]: (state, action) => ({
      ...state,
      verifyPhone: {
        ...state.verifyPhone,
        isVerifying: false,
        isFailed: true,
        isVerified: false,
      },
    }),
    [CHANGE_PASSWORD.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [CHANGE_PASSWORD.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [CHANGE_PASSWORD.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [CHANGE_EMAIL.REQUEST]: (state, action) => ({
      ...state,
      isUpdatingEmail: true,
    }),
    [CHANGE_EMAIL.SUCCESS]: (state, action) => ({
      ...state,
      isUpdatingEmail: false,
    }),
    [CHANGE_EMAIL.FAILURE]: (state, action) => ({
      ...state,
      isUpdatingEmail: false,
    }),
    [CHANGE_EMAIL_CONFIRMED.REQUEST]: (state, action) => ({
      ...state,
      isVerifyingEmail: true,
    }),
    [CHANGE_EMAIL_CONFIRMED.SUCCESS]: (state, action) => ({
      ...state,
      isVerifyingEmail: false,
    }),
    [CHANGE_EMAIL_CONFIRMED.FAILURE]: (state, action) => ({
      ...state,
      isVerifyingEmail: false,
    }),
    [GET_LINE_BINDING_URL.REQUEST]: (state, action) => ({
      ...state,
    }),
    [GET_LINE_BINDING_URL.SUCCESS]: (state, action) => ({
      ...state,
      lineOAuthParams: action.payload,
    }),
    [GET_LINE_BINDING_URL.FAILURE]: (state, action) => ({
      ...state,
    }),
    [RESET_LINE_BINDING_URL.SUCCESS]: (state, action) => ({
      ...state,
      lineOAuthParams: {},
    }),
    [UNBINDING_LINE.SUCCESS]: (state, action) => ({
      ...state,
      lineOAuthParams: initalState.lineOAuthParams,
    }),
  },
  initalState,
);

const makeGetUserId = state => state.users.currentUser.id;
