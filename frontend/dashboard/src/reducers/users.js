import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message } from 'antd';
import { switchMap, map, tap } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { listUsersAPI, updateUserAPI, getUserAPI } from '../apis';

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

/**
 * Action Creator
 */
export const listUsers = createAction(LIST_USERS.REQUEST);
export const updateUser = createAction(UPDATE_USER.REQUEST);
export const getUser = createAction(GET_USER.REQUEST);

/**
 * Epics
 */

export const listUsersEpic = pipe(
  ofType(LIST_USERS.REQUEST),
  switchMap(({ payload = '' }) =>
    listUsersAPI(payload).pipe(
      map(createAction(LIST_USERS.SUCCESS)),
      catchRequestError(createAction(LIST_USERS.FAILURE))
    )
  )
);

export const updateUserEpic = pipe(
  ofType(UPDATE_USER.REQUEST),
  switchMap(({ payload = '' }) =>
    updateUserAPI(payload).pipe(
      tap(() => message.success('修改用戶成功')),
      map(createAction(UPDATE_USER.SUCCESS)),
      catchRequestError(e => {
        message.error(`修改用戶失敗 (${e.message})`);
        return createAction(UPDATE_USER.FAILURE)();
      })
    )
  )
);

export const getUserEpic = pipe(
  ofType(GET_USER.REQUEST),
  switchMap(({ payload = '' }) =>
    getUserAPI(payload).pipe(
      map(createAction(GET_USER.SUCCESS)),
      catchRequestError(createAction(GET_USER.FAILURE))
    )
  )
);

const initalState = {
  isLoading: false,
  content: [],
  currentUser: undefined,
  totalPages: 0,
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
      isLoading: true,
    }),
    [UPDATE_USER.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [UPDATE_USER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [GET_USER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [GET_USER.SUCCESS]: (state, action) => ({
      ...state,
      currentUser: action.payload.data,
      isLoading: false,
    }),
    [GET_USER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
  },
  initalState
);
