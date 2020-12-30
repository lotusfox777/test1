import update from 'immutability-helper';
import { createAction, handleActions } from 'redux-actions';
import { pipe, findIndex, propEq, concat, uniqWith } from 'ramda';
import { message } from 'antd';
import { switchMap, map, tap, mapTo, mergeMap } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import {
  listGuardAreasByTypeAPI,
  addGuardAreaAPI,
  updateGuardAreaAPI,
  updateGuardAreaUFOsAPI,
  deleteGuardAreaAPI,
  listUFOsInRangeAPI,
  listUFOsInRoundRangeAPI,
  listGuardAreaUFOsAPI,
  deleteGuardAreaUFOsAPI,
  getGuardAreaAPI,
  listNotifyAPI,
  unreadNotifyAPI,
  readNotifyAPI,
} from '../apis';

/**
 * Action Types
 */

const LIST_GUARD_AREAS = createRequestTypes('LIST_GUARD_AREAS');
const ADD_GUARD_AREA = createRequestTypes('ADD_GUARD_AREA');
const UPDATE_GUARD_AREA = createRequestTypes('UPDATE_GUARD_AREA');
const UPDATE_GUARD_AREA_UFOS = createRequestTypes('UPDATE_GUARD_AREA_UFOS');
const DELETE_GUARD_AREA = createRequestTypes('DELETE_GUARD_AREA');
const LIST_UFOS_IN_RANGE = createRequestTypes('LIST_UFOS_IN_RANGE');
const LIST_UFOS_IN_ROUND_RANGE = createRequestTypes('LIST_UFOS_IN_ROUND_RANGE');
const LIST_GUARD_AREA_UFOS = createRequestTypes('LIST_GUARD_AREA_UFOS');
const DELETE_GUARD_AREA_UFOS = createRequestTypes('DELETE_GUARD_AREA_UFOS');
const LIST_ENABLED_GUARD_AREAS = createRequestTypes('LIST_ENABLED_GUARD_AREAS');
const GET_GUARD_AREA = createRequestTypes('GET_GUARD_AREA');
const LIST_NOTIFY = createRequestTypes('LIST_NOTIFY');
const CLEAR_NOTIFY = createRequestTypes('CLEAR_NOTIFY');
const CLEAR_UFOS = createRequestTypes('CLEAR_UFOS');
const UNREAD_NOTIFY = createRequestTypes('UNREAD_NOTIFY');
const READ_NOTIFY = createRequestTypes('READ_NOTIFY');

/**
 * Action Creator
 */
export const listGuardAreas = createAction(LIST_GUARD_AREAS.REQUEST);
export const addGuardArea = createAction(ADD_GUARD_AREA.REQUEST);
export const updateGuardArea = createAction(UPDATE_GUARD_AREA.REQUEST);
export const updateGuardAreaUFOs = createAction(UPDATE_GUARD_AREA_UFOS.REQUEST);
export const deleteGuardArea = createAction(DELETE_GUARD_AREA.REQUEST);
export const listUFOsInRange = createAction(LIST_UFOS_IN_RANGE.REQUEST);
export const listUFOsInRoundRange = createAction(LIST_UFOS_IN_ROUND_RANGE.REQUEST);
export const listGuardAreaUFOs = createAction(LIST_GUARD_AREA_UFOS.REQUEST);
export const deleteGuardAreaUFOs = createAction(DELETE_GUARD_AREA_UFOS.REQUEST);
export const listEnabledGuardAreas = createAction(LIST_ENABLED_GUARD_AREAS.REQUEST);
export const getGuardArea = createAction(GET_GUARD_AREA.REQUEST);
export const listNotify = createAction(LIST_NOTIFY.REQUEST);
export const clearNotify = createAction(CLEAR_NOTIFY.REQUEST);
export const clearUfos = createAction(CLEAR_UFOS.REQUEST);
export const unreadNotify = createAction(UNREAD_NOTIFY.REQUEST);
export const readNotify = createAction(READ_NOTIFY.REQUEST);

/**
 * Epics
 */

export const listGuardAreasEpic = pipe(
  ofType(LIST_GUARD_AREAS.REQUEST),
  switchMap(({ payload = '' }) =>
    listGuardAreasByTypeAPI({ type: payload }).pipe(
      map(createAction(LIST_GUARD_AREAS.SUCCESS)),
      catchRequestError(createAction(LIST_GUARD_AREAS.FAILURE)),
    ),
  ),
);

export const addGuardAreaEpic = pipe(
  ofType(ADD_GUARD_AREA.REQUEST),
  switchMap(({ payload: { onCompleted, ...payload } = {} }) =>
    addGuardAreaAPI(payload).pipe(
      tap(() => {
        message.success('新增守護區域成功');

        if (onCompleted) {
          onCompleted();
        }
      }),
      map(createAction(ADD_GUARD_AREA.SUCCESS)),
      catchRequestError((e) => {
        message.error(`新增守護區域失敗 (${e.message})`);
        return createAction(ADD_GUARD_AREA.FAILURE)();
      }),
    ),
  ),
);

export const updateGuardAreaEpic = pipe(
  ofType(UPDATE_GUARD_AREA.REQUEST),
  switchMap(({ payload = {} }) =>
    updateGuardAreaAPI(payload).pipe(
      tap(() => message.success('修改守護區域成功')),
      mergeMap(() => [
        // NOTE: 應該要打註解掉的 API 但為了 UX 不要重打... 更新 state 就好
        // 打 listEnabledGuardAreas 可能會導致列表排序亂掉，後端應該是用更新時間排序
        // 打 getGuardArea 會讓啟用狀態的 checkbox 卡卡的，要等 API 回應 checkbox 狀態才會改變
        // listEnabledGuardAreas(),
        createAction(UPDATE_GUARD_AREA.SUCCESS)(payload),
        // getGuardArea(payload.id)
      ]),
      catchRequestError((e) => {
        message.error(`修改守護區域失敗 (${e.message})`);
        return createAction(UPDATE_GUARD_AREA.FAILURE)();
      }),
    ),
  ),
);

export const updateGuardAreaUFOsEpic = pipe(
  ofType(UPDATE_GUARD_AREA_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    updateGuardAreaUFOsAPI(payload).pipe(
      tap(() => message.success('修改守護區域成功')),
      mapTo(createAction(UPDATE_GUARD_AREA_UFOS.SUCCESS)(payload)),
      catchRequestError((e) => {
        message.error(`修改守護區域失敗 (${e.message})`);
        return createAction(UPDATE_GUARD_AREA_UFOS.FAILURE)();
      }),
    ),
  ),
);

export const deleteGuardAreaEpic = pipe(
  ofType(DELETE_GUARD_AREA.REQUEST),
  switchMap(({ payload = '' }) =>
    deleteGuardAreaAPI(payload).pipe(
      tap(() => message.success('刪除守護區域成功')),
      mapTo(listEnabledGuardAreas()),
      catchRequestError((e) => {
        message.error(`刪除守護區域失敗 (${e.message})`);
        return createAction(DELETE_GUARD_AREA.FAILURE)();
      }),
    ),
  ),
);

export const listUFOsInRangeEpic = pipe(
  ofType(LIST_UFOS_IN_RANGE.REQUEST),
  switchMap(({ payload = '' }) =>
    listUFOsInRangeAPI(payload).pipe(
      map(createAction(LIST_UFOS_IN_RANGE.SUCCESS)),
      catchRequestError(createAction(LIST_UFOS_IN_RANGE.FAILURE)),
    ),
  ),
);

export const listUFOsInRoundRangeEpic = pipe(
  ofType(LIST_UFOS_IN_ROUND_RANGE.REQUEST),
  switchMap(({ payload = '' }) =>
    listUFOsInRoundRangeAPI(payload).pipe(
      map(createAction(LIST_UFOS_IN_ROUND_RANGE.SUCCESS)),
      catchRequestError(createAction(LIST_UFOS_IN_ROUND_RANGE.FAILURE)),
    ),
  ),
);

export const listGuardAreaUFOsEpic = pipe(
  ofType(LIST_GUARD_AREA_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    listGuardAreaUFOsAPI(payload).pipe(
      map(createAction(LIST_GUARD_AREA_UFOS.SUCCESS)),
      catchRequestError(createAction(LIST_GUARD_AREA_UFOS.FAILURE)),
    ),
  ),
);

export const deleteGuardAreaUFOsEpic = pipe(
  ofType(DELETE_GUARD_AREA_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    deleteGuardAreaUFOsAPI(payload).pipe(
      tap(() => message.success('刪除守護區域UFO成功')),
      mapTo(listGuardAreaUFOs({ body: { id: payload.id } })),
      catchRequestError((e) => {
        message.error(`刪除守護區域UFO失敗 (${e.message})`);
        return createAction(DELETE_GUARD_AREA_UFOS.FAILURE)();
      }),
    ),
  ),
);

export const listEnabledGuardAreasEpic = pipe(
  ofType(LIST_ENABLED_GUARD_AREAS.REQUEST),
  switchMap(({ payload = {} }) =>
    listGuardAreasByTypeAPI({ ...payload, type: 2 }).pipe(
      map(createAction(LIST_ENABLED_GUARD_AREAS.SUCCESS)),
      catchRequestError(createAction(LIST_ENABLED_GUARD_AREAS.FAILURE)),
    ),
  ),
);

export const getGuardAreaEpic = pipe(
  ofType(GET_GUARD_AREA.REQUEST),
  switchMap(({ payload = '' }) =>
    getGuardAreaAPI(payload).pipe(
      map(createAction(GET_GUARD_AREA.SUCCESS)),
      catchRequestError(createAction(GET_GUARD_AREA.FAILURE)),
    ),
  ),
);

export const unreadNotifyEpic = pipe(
  ofType(UNREAD_NOTIFY.REQUEST),
  switchMap(({ payload = {} }) =>
    unreadNotifyAPI(payload).pipe(
      map((response) => createAction(UNREAD_NOTIFY.SUCCESS)({ ...response, ...payload })),
      catchRequestError(createAction(UNREAD_NOTIFY.FAILURE)),
    ),
  ),
);

export const readNotifyEpic = pipe(
  ofType(READ_NOTIFY.REQUEST),
  tap(() => message.success('Case closed')),
  switchMap(({ payload = {} }) =>
    readNotifyAPI(payload).pipe(
      mapTo(unreadNotify()),
      catchRequestError(createAction(READ_NOTIFY.FAILURE)()),
    ),
  ),
);

export const listNotifyEpic = pipe(
  ofType(LIST_NOTIFY.REQUEST),
  switchMap(({ payload = {} }) =>
    listNotifyAPI(payload).pipe(
      map((response) => createAction(LIST_NOTIFY.SUCCESS)({ ...response, ...payload })),
      catchRequestError(createAction(LIST_NOTIFY.FAILURE)),
    ),
  ),
);

const initalState = {
  isLoading: false,
  isLoadingGuardArea: false,
  content: [],
  byId: {},
  currentGuardArea: {
    cards: [],
  },
  ufos: [],
  ufosInRange: [],
  totalPages: 0,
  ufosTotalPages: 0,
  ufosTotalCount: 0,
  sysGuardArea: [],
  customGuardArea: [],
  sysGuardAreaCount: 0,
  customGuardAreaCount: 0,
  notifyHistory: {
    page: 0,
    totalPages: 0,
    size: 10,
    hasMore: false,
    content: [],
  },
  unreadNotifyHistory: {
    page: 0,
    totalPages: 0,
    size: 10,
    hasMore: false,
    content: [],
  },
};

export default handleActions(
  {
    [LIST_GUARD_AREAS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_GUARD_AREAS.SUCCESS]: (state, action) => {
      //hide guardareaEnable: false
      let data = action.payload.data.filter((area) => area.guardareaEnable);

      let ufosInRange = [];
      data.forEach((area) => {
        if (area.ufoInfos) {
          ufosInRange = ufosInRange.concat(area.ufoInfos);
        }
      });
      // different guard areas might cover the same ufo
      const uniqUFOs = uniqWith((a, b) => a.id === b.id)(ufosInRange);
      return {
        ...state,
        ufosInRange: uniqUFOs,
        content: data,

        isLoading: false,
      };
    },
    [LIST_GUARD_AREAS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [ADD_GUARD_AREA.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [ADD_GUARD_AREA.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [ADD_GUARD_AREA.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [UPDATE_GUARD_AREA.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [UPDATE_GUARD_AREA.SUCCESS]: (state, { payload }) => ({
      ...state,
      byId: {
        ...state.byId,
        [payload.id]: {
          ...state.byId[payload.id],
          ...payload,
        },
      },
      content: update(state.content, {
        [findIndex(propEq('id', payload.id))(state.content)]: {
          $set: {
            ...state.byId[payload.id],
            ...payload,
          },
        },
      }),
      isLoading: false,
    }),
    [UPDATE_GUARD_AREA.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [UPDATE_GUARD_AREA_UFOS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [UPDATE_GUARD_AREA_UFOS.SUCCESS]: (state, action) => ({
      ...state,
      ufosTotalCount: action.payload.ufoSeqs.length,
      isLoading: false,
    }),
    [UPDATE_GUARD_AREA_UFOS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [DELETE_GUARD_AREA.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [DELETE_GUARD_AREA.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [LIST_UFOS_IN_RANGE.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_UFOS_IN_RANGE.SUCCESS]: (state, action) => ({
      ...state,
      ufosInRange: action.payload.data,
      isLoading: false,
    }),
    [LIST_UFOS_IN_RANGE.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [LIST_UFOS_IN_ROUND_RANGE.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_UFOS_IN_ROUND_RANGE.SUCCESS]: (state, action) => ({
      ...state,
      ufosInRange: action.payload.data,
      isLoading: false,
    }),
    [LIST_UFOS_IN_ROUND_RANGE.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [LIST_GUARD_AREA_UFOS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_GUARD_AREA_UFOS.SUCCESS]: (state, action) => {
      return {
        ...state,
        ufos: state.ufos.concat(action.payload.data),
        ufosTotalPage: action.payload.totalPages,
        ufosTotalCount: action.payload.total,
        isLoading: false,
      };
    },
    [LIST_GUARD_AREA_UFOS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [LIST_ENABLED_GUARD_AREAS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_ENABLED_GUARD_AREAS.SUCCESS]: (state, { payload }) => ({
      ...state,
      content: payload.data.map((x) => ({
        ...x,
        cards: x.cards || [],
        cardGroups: x.cardGroups || [],
      })),
      sysGuardArea: payload.data
        .filter((x) => x.isSystemArea)
        .map((x) => ({
          ...x,
          cards: x.cards || [],
          cardGroups: x.cardGroups || [],
        })),
      customGuardArea: payload.data
        .filter((x) => !x.isSystemArea)
        .map((x) => ({
          ...x,
          cards: x.cards || [],
          cardGroups: x.cardGroups || [],
        })),
      sysGuardAreaCount: payload.data.filter((x) => x.isSystemArea).length,
      customGuardAreaCount: payload.data.filter((x) => !x.isSystemArea).length,
      totalPages: payload.totalPages,
      isLoading: false,
    }),
    [LIST_ENABLED_GUARD_AREAS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [GET_GUARD_AREA.REQUEST]: (state) => ({
      ...state,
      isLoadingGuardArea: true,
    }),
    [GET_GUARD_AREA.SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      currentGuardArea: data,
      byId: {
        [data.id]: {
          ...data,
          cardGroups: data.cardGroups || [],
          cards: data.cards || [],
        },
      },
      isLoadingGuardArea: false,
    }),
    [GET_GUARD_AREA.FAILURE]: (state) => ({
      ...state,
      isLoadingGuardArea: false,
    }),
    [READ_NOTIFY.REQUEST]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [READ_NOTIFY.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [UNREAD_NOTIFY.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [UNREAD_NOTIFY.SUCCESS]: (state, action) => ({
      ...state,
      unreadNotifyHistory: {
        ...action.payload,
        content: concat(
          state.notifyHistory.content,
          action.payload.data ? action.payload.data : [],
        ),
      },
      isLoading: false,
    }),
    [UNREAD_NOTIFY.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [LIST_NOTIFY.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_NOTIFY.SUCCESS]: (state, action) => ({
      ...state,
      notifyHistory: {
        ...action.payload,
        hasMore: action.payload.page < action.payload.totalPages,
        content: concat(
          state.notifyHistory.content,
          action.payload.data ? action.payload.data : [],
        ),
      },
      isLoading: false,
    }),
    [LIST_NOTIFY.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [CLEAR_NOTIFY.REQUEST]: (state, action) => ({
      ...state,
      notifyHistory: initalState.notifyHistory,
    }),
    [CLEAR_UFOS.REQUEST]: (state, action) => ({
      ...state,
      ufos: [],
      ufosInRange: [],
    }),
  },
  initalState,
);
