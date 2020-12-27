import { createAction, handleActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message } from 'antd';
import { switchMap, map, mergeMap, tap, pluck } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError, getPayloadByType } from '../utils/extendOperators';
import {
  listCardGroupsAPI,
  addCardGroupAPI,
  getCardGroupAPI,
  updateCardGroupAPI,
  deleteCardGroupAPI,
} from '../apis';

/**
 * Action Types
 */

const LIST_CARD_GROUPS = createRequestTypes('LIST_CARD_GROUPS');
const GET_CARD_GROUP = createRequestTypes('GET_CARD_GROUP');
const ADD_CARD_GROUP = createRequestTypes('ADD_CARD_GROUP');
const UPDATE_CARD_GROUP = createRequestTypes('UPDATE_CARD_GROUP');
const DELETE_CARD_GROUP = createRequestTypes('DELETE_CARD_GROUP');

/**
 * Action Creator
 */
export const listCardGroups = createAction(LIST_CARD_GROUPS.REQUEST);
export const getCardGroup = createAction(GET_CARD_GROUP.REQUEST);
export const addCardGroup = createAction(ADD_CARD_GROUP.REQUEST);
export const updateCardGroup = createAction(UPDATE_CARD_GROUP.REQUEST);
export const deleteCardGroup = createAction(DELETE_CARD_GROUP.REQUEST);

/**
 * Epics
 */

export const listCardGroupsEpic = pipe(
  ofType(LIST_CARD_GROUPS.REQUEST),
  switchMap(({ payload = {} }) =>
    listCardGroupsAPI(payload).pipe(
      map(createAction(LIST_CARD_GROUPS.SUCCESS)),
      catchRequestError(createAction(LIST_CARD_GROUPS.FAILURE)),
    ),
  ),
);

export const getCardGroupsEpic = pipe(
  ofType(GET_CARD_GROUP.REQUEST),
  switchMap(({ payload = '' }) =>
    getCardGroupAPI(payload).pipe(
      map(createAction(GET_CARD_GROUP.SUCCESS)),
      catchRequestError((error) => {
        message.error(`取得裝置群組失敗: ${error.response.message}`);
        return createAction(GET_CARD_GROUP.FAILURE)(error);
      }),
    ),
  ),
);

export const addCardGroupEpic = (actions, { getState }) =>
  actions.pipe(
    getPayloadByType(ADD_CARD_GROUP.REQUEST),
    switchMap(({ groupName, cardInfos = [] } = {}) =>
      addCardGroupAPI({ groupName }).pipe(
        pluck('data', 'id'),
        switchMap((id) =>
          updateCardGroupAPI({ id, cardInfos }).pipe(
            tap(() => message.success('新增裝置群組成功')),
            mergeMap(() => [
              createAction(ADD_CARD_GROUP.SUCCESS)(),
              listCardGroups(makeGetRequestParams(getState())),
            ]),
          ),
        ),
        catchRequestError((error) => {
          message.error(`新增裝置群組失敗: ${error.response.message}`);
          return createAction(ADD_CARD_GROUP.FAILURE)(error);
        }),
      ),
    ),
  );

export const updateCardGroupEpic = (actions, { getState }) =>
  actions.pipe(
    getPayloadByType(UPDATE_CARD_GROUP.REQUEST),
    switchMap(({ id, cardInfos = [] }) =>
      updateCardGroupAPI({ id, cardInfos }).pipe(
        tap(() => message.success('修改裝置群組成功')),
        mergeMap(() => [
          createAction(UPDATE_CARD_GROUP.SUCCESS)(),
          listCardGroups(makeGetRequestParams(getState())),
        ]),
        catchRequestError((error) => {
          message.error(`修改裝置群組失敗: ${error.response.message}`);
          return createAction(UPDATE_CARD_GROUP.FAILURE)(error);
        }),
      ),
    ),
  );

export const deleteCardGroupEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(DELETE_CARD_GROUP.REQUEST),
    switchMap(({ payload = '' }) =>
      deleteCardGroupAPI(payload).pipe(
        tap(() => message.success('刪除裝置群組成功')),
        mergeMap(() => [
          createAction(DELETE_CARD_GROUP.SUCCESS)(),
          listCardGroups(makeGetRequestParams(getState())),
        ]),
        catchRequestError((error) => {
          message.error(`刪除裝置群組失敗: ${error.response.message}`);
          return createAction(DELETE_CARD_GROUP.FAILURE)(error);
        }),
      ),
    ),
  );

const initalState = {
  isLoading: false,
  content: [],
  totalPages: 0,
  page: 0,
  size: 10,
  total: 0,
  search: null,
};

export default handleActions(
  {
    [LIST_CARD_GROUPS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_CARD_GROUPS.SUCCESS]: (state, action) => ({
      ...state,
      page: action.payload.page,
      size: action.payload.size,
      total: action.payload.total,
      content: action.payload.data,
      isLoading: false,
    }),
    [LIST_CARD_GROUPS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),

    [GET_CARD_GROUP.SUCCESS]: (state, action) => ({
      ...state,
      data: action.payload.data,
    }),
  },
  initalState,
);

export const makeGetRequestParams = (state) => ({
  page: state.cardGroups.page,
  size: state.cardGroups.size,
  search: state.cardGroups.search,
});
