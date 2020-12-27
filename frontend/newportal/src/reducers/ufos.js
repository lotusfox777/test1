import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message } from 'antd';
import { switchMap, map, tap, mapTo } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import {
  listUFOsAPI,
  addUFOsAPI,
  updateUFOAPI,
  deleteUFOAPI,
  listUFOCardsAPI
} from '../apis';

/**
 * Enum
 */

export const Status = {
  '1': '啟用中',
  '-1': '未啟用'
};

/**
 * Action Types
 */

const LIST_UFOS = createRequestTypes('LIST_UFOS');
const ADD_UFOS = createRequestTypes('ADD_UFOS');
const UPDATE_UFO = createRequestTypes('UPDATE_UFO');
const DELETE_UFO = createRequestTypes('DELETE_UFO');
const LIST_UFO_CARDS = createRequestTypes('LIST_UFO_CARDS');

/**
 * Action Creator
 */
export const listUFOs = createAction(LIST_UFOS.REQUEST);
export const addUFOs = createAction(ADD_UFOS.REQUEST);
export const updateUFO = createAction(UPDATE_UFO.REQUEST);
export const deleteUFO = createAction(DELETE_UFO.REQUEST);
export const listUFOCards = createAction(LIST_UFO_CARDS.REQUEST);

/**
 * Epics
 */

export const listUFOsEpic = pipe(
  ofType(LIST_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    listUFOsAPI(payload).pipe(
      map(createAction(LIST_UFOS.SUCCESS)),
      catchRequestError(createAction(LIST_UFOS.FAILURE))
    )
  )
);

export const addUFOsEpic = pipe(
  ofType(ADD_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    addUFOsAPI(payload).pipe(
      tap(() => message.success('新增UFO成功')),
      mapTo(listUFOs({ body: {} })),
      catchRequestError(e => {
        message.error(`新增UFO失敗 (${e.message})`);
        return createAction(ADD_UFOS.FAILURE)();
      })
    )
  )
);

export const updateUFOEpic = pipe(
  ofType(UPDATE_UFO.REQUEST),
  switchMap(({ payload = '' }) =>
    updateUFOAPI(payload).pipe(
      tap(() => message.success('修改UFO成功')),
      mapTo(listUFOs({ body: {} })),
      catchRequestError(e => {
        message.error(`修改UFO失敗 (${e.message})`);
        return createAction(UPDATE_UFO.FAILURE)();
      })
    )
  )
);

export const deleteUFOEpic = pipe(
  ofType(DELETE_UFO.REQUEST),
  switchMap(({ payload = '' }) =>
    deleteUFOAPI(payload).pipe(
      tap(() => message.success('刪除UFO成功')),
      mapTo(listUFOs({ body: {} })),
      catchRequestError(e => {
        message.error(`刪除UFO失敗 (${e.message})`);
        return createAction(DELETE_UFO.FAILURE)();
      })
    )
  )
);

export const listUFOCardsEpic = pipe(
  ofType(LIST_UFO_CARDS.REQUEST),
  switchMap(({ payload = '' }) =>
    listUFOCardsAPI(payload).pipe(
      map(createAction(LIST_UFO_CARDS.SUCCESS)),
      catchRequestError(createAction(LIST_UFO_CARDS.FAILURE))
    )
  )
);

const initalState = {
  isLoading: false,
  content: [],
  totalPages: 0,
  cards: [],
  cardsTotalPages: 0
};

export default handleActions(
  {
    [LIST_UFOS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [LIST_UFOS.SUCCESS]: (state, action) => ({
      ...state,
      content: action.payload.data,
      totalPages: action.payload.totalPages,
      isLoading: false
    }),
    [LIST_UFOS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [ADD_UFOS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [ADD_UFOS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [UPDATE_UFO.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [UPDATE_UFO.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [DELETE_UFO.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [DELETE_UFO.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [LIST_UFO_CARDS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [LIST_UFO_CARDS.SUCCESS]: (state, action) => ({
      ...state,
      cards: action.payload.data,
      cardsTotalPages: action.payload.totalPages,
      isLoading: false
    }),
    [LIST_UFO_CARDS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    })
  },
  initalState
);
