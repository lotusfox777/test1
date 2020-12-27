import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message } from 'antd';
import { switchMap, map, tap } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import {
  listManagersAPI,
  addManagerAPI,
  updateManagerAPI,
  deleteManagerAPI
} from '../apis';

/**
 * Enum
 */

export const ROLE_MAP = {
  1: '系統管理者',
  2: '副管理者',
  3: '一般管理者'
};

/**
 * Action Types
 */

const LIST_MANAGERS = createRequestTypes('LIST_MANAGERS');
const ADD_MANAGER = createRequestTypes('ADD_MANAGER');
const UPDATE_MANAGER = createRequestTypes('UPDATE_MANAGER');
const DELETE_MANAGER = createRequestTypes('DELETE_MANAGER');

/**
 * Action Creator
 */
export const listManagers = createAction(LIST_MANAGERS.REQUEST);
export const addManager = createAction(ADD_MANAGER.REQUEST);
export const updateManager = createAction(UPDATE_MANAGER.REQUEST);
export const deleteManager = createAction(DELETE_MANAGER.REQUEST);

/**
 * Epics
 */

export const listManagersEpic = pipe(
  ofType(LIST_MANAGERS.REQUEST),
  switchMap(({ payload = '' }) =>
    listManagersAPI(payload).pipe(
      map(createAction(LIST_MANAGERS.SUCCESS)),
      catchRequestError(createAction(LIST_MANAGERS.FAILURE))
    )
  )
);

export const addManagerEpic = pipe(
  ofType(ADD_MANAGER.REQUEST),
  switchMap(({ payload = '' }) =>
    addManagerAPI(payload).pipe(
      tap(() => message.success('新增帳號權限成功')),
      map(createAction(ADD_MANAGER.SUCCESS)),
      catchRequestError(e => {
        message.error(`新增帳號權限失敗 (${e.message})`);
        return createAction(ADD_MANAGER.FAILURE)();
      })
    )
  )
);

export const updateManagerEpic = pipe(
  ofType(UPDATE_MANAGER.REQUEST),
  switchMap(({ payload = '' }) =>
    updateManagerAPI(payload).pipe(
      tap(() => message.success('修改帳號權限成功')),
      map(createAction(UPDATE_MANAGER.SUCCESS)),
      catchRequestError(e => {
        message.error(`修改帳號權限失敗 (${e.message})`);
        return createAction(UPDATE_MANAGER.FAILURE)();
      })
    )
  )
);

export const deleteManagerEpic = pipe(
  ofType(DELETE_MANAGER.REQUEST),
  switchMap(({ payload = '' }) =>
    deleteManagerAPI(payload).pipe(
      tap(() => message.success('刪除帳號權限成功')),
      map(createAction(DELETE_MANAGER.SUCCESS)),
      catchRequestError(e => {
        message.error(`刪除帳號權限失敗 (${e.message})`);
        return createAction(DELETE_MANAGER.FAILURE)();
      })
    )
  )
);

const initalState = {
  isLoading: false,
  content: [],
  totalPages: 0
};

export default handleActions(
  {
    [LIST_MANAGERS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [LIST_MANAGERS.SUCCESS]: (state, action) => ({
      ...state,
      content: action.payload.data,
      totalPages: action.payload.totalPages,
      isLoading: false
    }),
    [LIST_MANAGERS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [ADD_MANAGER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [ADD_MANAGER.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [ADD_MANAGER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [UPDATE_MANAGER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [UPDATE_MANAGER.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [UPDATE_MANAGER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [DELETE_MANAGER.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [DELETE_MANAGER.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [DELETE_MANAGER.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    })
  },
  initalState
);
