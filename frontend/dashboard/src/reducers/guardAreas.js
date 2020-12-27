import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message } from 'antd';
import { switchMap, map, tap, mapTo, mergeMap } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import {
  listGuardAreasAPI,
  addGuardAreaAPI,
  updateGuardAreaAPI,
  updateGuardAreaUFOsAPI,
  deleteGuardAreaAPI,
  listUFOsInRangeAPI,
  listGuardAreaUFOsAPI,
  deleteGuardAreaUFOsAPI
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
const LIST_GUARD_AREA_UFOS = createRequestTypes('LIST_GUARD_AREA_UFOS');
const DELETE_GUARD_AREA_UFOS = createRequestTypes('DELETE_GUARD_AREA_UFOS');

/**
 * Action Creator
 */
export const listGuardAreas = createAction(LIST_GUARD_AREAS.REQUEST);
export const addGuardArea = createAction(ADD_GUARD_AREA.REQUEST);
export const updateGuardArea = createAction(UPDATE_GUARD_AREA.REQUEST);
export const updateGuardAreaUFOs = createAction(UPDATE_GUARD_AREA_UFOS.REQUEST);
export const deleteGuardArea = createAction(DELETE_GUARD_AREA.REQUEST);
export const listUFOsInRange = createAction(LIST_UFOS_IN_RANGE.REQUEST);
export const listGuardAreaUFOs = createAction(LIST_GUARD_AREA_UFOS.REQUEST);
export const deleteGuardAreaUFOs = createAction(DELETE_GUARD_AREA_UFOS.REQUEST);

/**
 * Epics
 */

export const listGuardAreasEpic = pipe(
  ofType(LIST_GUARD_AREAS.REQUEST),
  switchMap(({ payload = {} }) =>
    listGuardAreasAPI(payload).pipe(
      map(res =>
        createAction(LIST_GUARD_AREAS.SUCCESS)({ ...payload, ...res })
      ),
      catchRequestError(createAction(LIST_GUARD_AREAS.FAILURE))
    )
  )
);

export const addGuardAreaEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(ADD_GUARD_AREA.REQUEST),
    switchMap(({ payload = '' }) =>
      addGuardAreaAPI(payload).pipe(
        tap(() => message.success('新增守護區域成功')),
        mergeMap(() => [
          createAction(ADD_GUARD_AREA.SUCCESS)(),
          listGuardAreas(makeGetQueryParams(getState()))
        ]),
        catchRequestError(e => {
          message.error(`新增守護區域失敗 (${e.message})`);
          return createAction(ADD_GUARD_AREA.FAILURE)();
        })
      )
    )
  );

export const updateGuardAreaEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(UPDATE_GUARD_AREA.REQUEST),
    switchMap(({ payload = '' }) =>
      updateGuardAreaAPI(payload).pipe(
        tap(() => message.success('修改守護區域成功')),
        mergeMap(() => [
          createAction(UPDATE_GUARD_AREA.SUCCESS)(),
          listGuardAreas(makeGetQueryParams(getState()))
        ]),
        catchRequestError(e => {
          message.error(`修改守護區域失敗 (${e.message})`);
          return createAction(UPDATE_GUARD_AREA.FAILURE)();
        })
      )
    )
  );

export const updateGuardAreaUFOsEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(UPDATE_GUARD_AREA_UFOS.REQUEST),
    switchMap(({ payload = '' }) =>
      updateGuardAreaUFOsAPI(payload).pipe(
        tap(() => message.success('修改守護區域成功')),
        mergeMap(createAction(UPDATE_GUARD_AREA_UFOS.SUCCESS)(payload)),
        catchRequestError(e => {
          message.error(`修改守護區域失敗 (${e.message})`);
          return createAction(UPDATE_GUARD_AREA_UFOS.FAILURE)();
        })
      )
    )
  );

export const deleteGuardAreaEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(DELETE_GUARD_AREA.REQUEST),
    switchMap(({ payload = '' }) =>
      deleteGuardAreaAPI(payload).pipe(
        tap(() => message.success('刪除守護區域成功')),
        mergeMap(() => [
          createAction(DELETE_GUARD_AREA.SUCCESS)(),
          listGuardAreas(makeGetQueryParams(getState()))
        ]),
        catchRequestError(e => {
          message.error(`刪除守護區域失敗 (${e.message})`);
          return createAction(DELETE_GUARD_AREA.FAILURE)();
        })
      )
    )
  );

export const listUFOsInRangeEpic = pipe(
  ofType(LIST_UFOS_IN_RANGE.REQUEST),
  switchMap(({ payload = '' }) =>
    listUFOsInRangeAPI(payload).pipe(
      map(createAction(LIST_UFOS_IN_RANGE.SUCCESS)),
      catchRequestError(createAction(LIST_UFOS_IN_RANGE.FAILURE))
    )
  )
);

export const listGuardAreaUFOsEpic = pipe(
  ofType(LIST_GUARD_AREA_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    listGuardAreaUFOsAPI(payload).pipe(
      map(createAction(LIST_GUARD_AREA_UFOS.SUCCESS)),
      catchRequestError(createAction(LIST_GUARD_AREA_UFOS.FAILURE))
    )
  )
);

export const deleteGuardAreaUFOsEpic = pipe(
  ofType(DELETE_GUARD_AREA_UFOS.REQUEST),
  switchMap(({ payload = '' }) =>
    deleteGuardAreaUFOsAPI(payload).pipe(
      tap(() => message.success('刪除守護區域UFO成功')),
      mapTo(listGuardAreaUFOs({ body: { id: payload.id } })),
      catchRequestError(e => {
        message.error(`刪除守護區域UFO失敗 (${e.message})`);
        return createAction(DELETE_GUARD_AREA_UFOS.FAILURE)();
      })
    )
  )
);

const initalState = {
  isLoading: false,
  content: [],
  ufos: [],
  ufosInRange: [],
  totalPages: 0,
  ufosTotalPages: 0,
  ufosTotalCount: 0,
  body: {},
  page: 0,
  size: 10
};

export default handleActions(
  {
    [LIST_GUARD_AREAS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [LIST_GUARD_AREAS.SUCCESS]: (state, { payload: { data, ...rest } }) => ({
      ...state,
      ...rest,
      content: data,
      isLoading: false
    }),
    [LIST_GUARD_AREAS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [ADD_GUARD_AREA.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [ADD_GUARD_AREA.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [UPDATE_GUARD_AREA.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [UPDATE_GUARD_AREA.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [UPDATE_GUARD_AREA_UFOS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [UPDATE_GUARD_AREA_UFOS.SUCCESS]: (state, action) => ({
      ...state,
      ufosTotalCount: action.payload.ufoSeqs.length,
      isLoading: false
    }),
    [UPDATE_GUARD_AREA_UFOS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [DELETE_GUARD_AREA.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [DELETE_GUARD_AREA.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [LIST_UFOS_IN_RANGE.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [LIST_UFOS_IN_RANGE.SUCCESS]: (state, action) => ({
      ...state,
      ufosInRange: action.payload.data,
      isLoading: false
    }),
    [LIST_UFOS_IN_RANGE.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    }),
    [LIST_GUARD_AREA_UFOS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true
    }),
    [LIST_GUARD_AREA_UFOS.SUCCESS]: (state, action) => ({
      ...state,
      ufos: action.payload.data,
      ufosTotalPage: action.payload.totalPages,
      ufosTotalCount: action.payload.total,
      isLoading: false
    }),
    [LIST_GUARD_AREA_UFOS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false
    })
  },
  initalState
);

export const makeGetQueryParams = state => ({
  body: {},
  page: state.guardAreas.page,
  size: state.guardAreas.size
});
