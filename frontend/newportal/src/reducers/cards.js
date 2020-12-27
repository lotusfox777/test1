import { createAction, handleActions, combineActions } from 'redux-actions';
import { pipe, concat, find, propEq, filter, compose, pluck, slice, forEach, length } from 'ramda';
import { message, Modal } from 'antd';
import { switchMap, map, tap, mapTo, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { push } from 'connected-react-router';
import { createRequestTypes } from 'actions/Types';
import { SUBMANAGER_LIST } from 'constants/routes';
import { ofType, catchRequestError, getPayloadByType } from '../utils/extendOperators';
import {
  listCardsAPI,
  addCardAPI,
  updateCardAPI,
  deleteCardAPI,
  listCardActivitiesAPI,
  addCardAuthAPI,
  deleteCardAuthAPI,
  listMultipleCardsActivitiesAPI,
  acceptCardInviteAPI,
  listCardAuthAPI,
  listCardsCurrentInfoAPI,
  getCardDetailAPI,
  listNotifyByCardAPI,
} from '../apis';

const { error, success } = Modal;

/**
 * Enum
 */

export const Status = {
  1: '綁定中',
  '-1': '未綁定',
};

/**
 * Action Types
 */

const LIST_CARDS = createRequestTypes('LIST_CARDS');
const LIST_ALL_CARDS = createRequestTypes('LIST_ALL_CARDS');
const ADD_CARD = createRequestTypes('ADD_CARD');
const ADD_CARDS = createRequestTypes('ADD_CARDS');
const UPDATE_CARD = createRequestTypes('UPDATE_CARD');
const DELETE_CARD = createRequestTypes('DELETE_CARD');
const LIST_CARD_ACTIVITIES = createRequestTypes('LIST_CARD_ACTIVITIES');
const LIST_MULTIPLE_CARDS_ACTIVITIES = createRequestTypes('LIST_MULTIPLE_CARDS_ACTIVITIES');
const ADD_CARD_INVITE = createRequestTypes('ADD_CARD_INVITE');
const DELETE_CARD_INVITE = createRequestTypes('DELETE_CARD_INVITE');
const ACCEPT_CARD_INVITE = createRequestTypes('ACCEPT_CARD_INVITE');
const LIST_CARDS_CURRENT_INFO = createRequestTypes('LIST_CARDS_CURRENT_INFO');
const GET_CARD_DETAIL = createRequestTypes('GET_CARD_DETAIL');
const CLEAR_CARD_DETAIL = createRequestTypes('CLEAR_CARD_DETAIL');
const CLEAR_CARD_ACTIVITIES = createRequestTypes('CLEAR_CARD_ACTIVITIES');
// 授權管理
const LIST_CARD_AUTH = createRequestTypes('LIST_CARD_AUTH');
const ADD_CARD_AUTH = createRequestTypes('ADD_CARD_AUTH');
const DELETE_CARD_AUTH = createRequestTypes('DELETE_CARD_AUTH');
// 守護紀錄
const LIST_NOTIFY_BY_CARD = createRequestTypes('LIST_NOTIFY_BY_CARD');

/**
 * Action Creator
 */
export const listCards = createAction(LIST_CARDS.REQUEST);
export const listAllCards = createAction(LIST_ALL_CARDS.REQUEST);
export const addCard = createAction(ADD_CARD.REQUEST);
export const addCards = createAction(ADD_CARDS.REQUEST);
export const updateCard = createAction(UPDATE_CARD.REQUEST);
export const deleteCard = createAction(DELETE_CARD.REQUEST);
export const listCardActivities = createAction(LIST_CARD_ACTIVITIES.REQUEST);
export const listMultipleCardsActivities = createAction(LIST_MULTIPLE_CARDS_ACTIVITIES.REQUEST);
export const addCardInvite = createAction(ADD_CARD_INVITE.REQUEST);
export const deleteCardInvite = createAction(DELETE_CARD_INVITE.REQUEST);
export const acceptCardInvite = createAction(ACCEPT_CARD_INVITE.REQUEST);
export const listCardsCurrentInfo = createAction(LIST_CARDS_CURRENT_INFO.REQUEST);
export const getCardDetail = createAction(GET_CARD_DETAIL.REQUEST);
export const clearCardDetail = createAction(CLEAR_CARD_DETAIL.REQUEST);
export const clearCardActivities = createAction(CLEAR_CARD_ACTIVITIES.REQUEST);
export const listCardAuth = createAction(LIST_CARD_AUTH.REQUEST);
export const addCardAuth = createAction(ADD_CARD_AUTH.REQUEST);
export const deleteCardAuth = createAction(DELETE_CARD_AUTH.REQUEST);
export const listNotifyByCard = createAction(LIST_NOTIFY_BY_CARD.REQUEST);

/**
 * Epics
 */

export const listCardsEpic = pipe(
  ofType(LIST_CARDS.REQUEST),
  switchMap(({ payload = {} }) =>
    listCardsAPI(payload).pipe(
      map((response) =>
        createAction(LIST_CARDS.SUCCESS)({
          ...payload,
          ...response,
        }),
      ),
      catchRequestError(createAction(LIST_CARDS.FAILURE)),
    ),
  ),
);

export const listAllCardsEpic = pipe(
  ofType(LIST_ALL_CARDS.REQUEST),
  switchMap(() =>
    listCardsAPI({ type: -1, size: 9999 }).pipe(
      map(createAction(LIST_ALL_CARDS.SUCCESS)),
      catchRequestError(createAction(LIST_ALL_CARDS.FAILURE)),
    ),
  ),
);

export const addCardEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(ADD_CARD.REQUEST),
    switchMap(({ payload = '' }) =>
      addCardAPI(payload).pipe(
        tap(() => message.success('新增裝置成功')),
        mapTo(listCards(makeGetQueryParams(getState()))),
        catchRequestError((e) => {
          message.error(`新增裝置失敗: ${e.message}`);
          return createAction(ADD_CARD.FAILURE)();
        }),
      ),
    ),
  );

export const addCardsEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(ADD_CARDS.REQUEST),
    switchMap(({ payload = {} }) =>
      forkJoin(...payload.map((card) => addCardAPI(card))).pipe(
        tap(() => message.success('批次新增裝置成功')),
        mapTo(listCards(makeGetQueryParams(getState()))),
        catchRequestError((e) => {
          message.error(`批次新增裝置失敗: ${e.message}`);
          return createAction(ADD_CARDS.FAILURE)();
        }),
      ),
    ),
  );

export const updateCardEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(UPDATE_CARD.REQUEST),
    switchMap(({ payload = {} }) =>
      updateCardAPI(payload).pipe(
        tap(() => message.success('修改裝置成功')),
        mergeMap(() => [listCards(makeGetQueryParams(getState())), getCardDetail(payload.id)]),
        catchRequestError((e) => {
          message.error(`修改裝置失敗 (${e.message})`);
          return createAction(UPDATE_CARD.FAILURE)();
        }),
      ),
    ),
  );

export const deleteCardEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(DELETE_CARD.REQUEST),
    switchMap(({ payload: { id, onCompleted } = {} }) =>
      deleteCardAPI(id).pipe(
        tap(() => {
          message.success('刪除裝置成功');
          onCompleted();
        }),
        mapTo(listCards(makeGetQueryParams(getState()))),
        catchRequestError((e) => {
          message.error(`刪除裝置失敗 (${e.message})`);
          return createAction(DELETE_CARD.FAILURE)();
        }),
      ),
    ),
  );

export const listCardActivitiesEpic = pipe(
  ofType(LIST_CARD_ACTIVITIES.REQUEST),
  switchMap(({ payload = '' }) =>
    listCardActivitiesAPI(payload).pipe(
      mergeMap((res) => {
        if (payload.defaultTimePeriod && res.data[0].cardPositions.length <= 0) {
          message.warning('近一小時並無動態');
        }

        return [createAction(LIST_CARD_ACTIVITIES.SUCCESS)(res)];
      }),
      catchRequestError((e) => {
        message.error(`搜尋裝置軌跡失敗 (${e.message})`);
        return createAction(LIST_CARD_ACTIVITIES.FAILURE)();
      }),
    ),
  ),
);

export const listMultipleCardsActivitiesEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(LIST_MULTIPLE_CARDS_ACTIVITIES.REQUEST),
    switchMap(({ payload = {} }) =>
      listMultipleCardsActivitiesAPI(payload).pipe(
        tap((result) => {
          if (result.data === null) {
            message.error('無裝置軌跡資料');
          }
        }),
        // Todo: handle pagination with rxjs expand or sth else
        map(createAction(LIST_MULTIPLE_CARDS_ACTIVITIES.SUCCESS)),
        catchRequestError((e) => {
          message.error(`搜尋裝置軌跡失敗 (${e.message})`);
          return createAction(LIST_MULTIPLE_CARDS_ACTIVITIES.FAILURE)();
        }),
      ),
    ),
  );

export const listCardsCurrentInfoEpic = pipe(
  getPayloadByType(LIST_CARDS_CURRENT_INFO.REQUEST),
  switchMap(({ id, onMapChange, onMarkerFocus, onFitBounds, ...params } = {}) =>
    listCardsCurrentInfoAPI(params).pipe(
      tap(({ data }) => {
        let card;
        if (id) {
          card = find(propEq('id', id))(data);
        }

        if (params.search) {
          card = filter((c) => c.cardName && c.cardName.toLowerCase().includes(params.search))(
            data,
          )[0];
        }

        if (id) {
          const hasCard = id && card && card.current;

          if (!hasCard) {
            message.warning('查無資料');
          }

          if (hasCard) {
            if (onMapChange) {
              onMapChange({
                mapCenter: {
                  lat: card.current.latitude,
                  lng: card.current.longitude,
                },
                mapZoom: 19,
              });
            }

            if (onMarkerFocus) {
              onMarkerFocus(card.id);
            }
          }
        }

        if (length(data) > 0 && onFitBounds) {
          const bounds = new window.google.maps.LatLngBounds();

          compose(
            forEach((x) =>
              bounds.extend(
                new window.google.maps.LatLng({
                  lat: x.latitude,
                  lng: x.longitude,
                }),
              ),
            ),
            slice(0, 1000),
            pluck('current'),
          )(data);

          onFitBounds(bounds);

          if (card && onMarkerFocus) {
            onMarkerFocus(card.id);
          }
        }
      }),
      map(createAction(LIST_CARDS_CURRENT_INFO.SUCCESS)),
      catchRequestError(createAction(LIST_CARDS_CURRENT_INFO.FAILURE)),
    ),
  ),
);

export const addCardInviteEpic = pipe(
  ofType(ADD_CARD_INVITE.REQUEST),
  switchMap(({ payload = {} }) =>
    addCardAuthAPI(payload).pipe(
      mergeMap(() => [createAction(ADD_CARD_INVITE.SUCCESS)(), getCardDetail(payload.id)]),
      catchRequestError((e) => {
        message.error(`新增裝置副管理者失敗: ${e.message}`);
        return createAction(ADD_CARD_INVITE.FAILURE)();
      }),
    ),
  ),
);

export const deleteCardInviteEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(DELETE_CARD_INVITE.REQUEST),
    switchMap(({ payload = {} }) =>
      deleteCardAuthAPI(payload).pipe(
        mergeMap(() => [
          createAction(DELETE_CARD_INVITE.SUCCESS)(),
          getCardDetail(payload.id),
          listCards(makeGetQueryParams(getState())),
        ]),
        catchRequestError((e) => {
          message.error(`刪除裝置副管理者失敗: ${e.message}`);
          return createAction(DELETE_CARD_INVITE.FAILURE)();
        }),
      ),
    ),
  );

export const acceptCardInviteEpic = (actions, { dispatch }) =>
  actions.pipe(
    ofType(ACCEPT_CARD_INVITE.REQUEST),
    switchMap(({ payload = '' }) =>
      acceptCardInviteAPI(payload).pipe(
        tap(
          success({
            title: '授權成功',
            content: '您可至副管理者清單查看此裝置資料',
            okText: '確認',
            onOk() {
              dispatch(push(SUBMANAGER_LIST));
            },
          }),
        ),
        map(createAction(ACCEPT_CARD_INVITE.SUCCESS)),
        catchRequestError((e) => {
          error({ title: '授權失敗', content: e.message });
          return createAction(ACCEPT_CARD_INVITE.FAILURE)();
        }),
      ),
    ),
  );

export const listCardAuthEpic = pipe(
  ofType(LIST_CARD_AUTH.REQUEST),
  switchMap(({ payload = {} }) =>
    listCardAuthAPI(payload).pipe(
      map((response) => createAction(LIST_CARD_AUTH.SUCCESS)({ ...response, ...payload })),
      catchRequestError((error) => {
        message.error(`取得授權管理清單錯誤: ${error.response.message}`);
        return createAction(LIST_CARD_AUTH.FAILURE)(error);
      }),
    ),
  ),
);

export const addCardAuthEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(ADD_CARD_AUTH.REQUEST),
    switchMap(({ payload = {} }) =>
      addCardAuthAPI(payload).pipe(
        mergeMap(() => [
          createAction(ADD_CARD_AUTH.SUCCESS)(),
          getCardDetail(payload.id),
          listCardAuth(makeGetQueryParams(getState())),
        ]),
        catchRequestError((e) => {
          message.error(`新增裝置授權失敗: ${e.message}`);
          return createAction(ADD_CARD_AUTH.FAILURE)();
        }),
      ),
    ),
  );

export const deleteCardAuthEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(DELETE_CARD_AUTH.REQUEST),
    switchMap(({ payload = {} }) =>
      deleteCardAuthAPI(payload).pipe(
        mergeMap(() => [
          createAction(DELETE_CARD_AUTH.SUCCESS)(),
          getCardDetail(payload.id),
          listCardAuth(makeGetQueryParams(getState())),
        ]),
        catchRequestError((e) => {
          message.error(`刪除裝置授權失敗: ${e.message}`);
          return createAction(DELETE_CARD_AUTH.FAILURE)();
        }),
      ),
    ),
  );

export const getCardDetailEpic = pipe(
  ofType(GET_CARD_DETAIL.REQUEST),
  switchMap(({ payload = '' }) =>
    getCardDetailAPI(payload).pipe(
      map(createAction(GET_CARD_DETAIL.SUCCESS)),
      catchRequestError((e) => {
        message.error(`取得裝置失敗: ${e.message}`);
        return createAction(GET_CARD_DETAIL.FAILURE)();
      }),
    ),
  ),
);

export const listNotifyByCardEpic = pipe(
  ofType(LIST_NOTIFY_BY_CARD.REQUEST),
  switchMap(({ payload = {} }) =>
    listNotifyByCardAPI(payload).pipe(
      map(createAction(LIST_NOTIFY_BY_CARD.SUCCESS)),
      catchRequestError((err) => {
        message.error(`取得守護紀錄失敗: ${err.response.message}`);
        return createAction(LIST_NOTIFY_BY_CARD.FAILURE)();
      }),
    ),
  ),
);

const initialState = {
  isLoading: false,
  isUpdating: false,
  isDeleting: false,
  data: {
    guardareaList: [],
    cardAuthorities: [],
  },
  content: [],
  primaryCards: [],
  secondaryCards: [],
  primaryCardCount: 0,
  secondaryCardCount: 0,
  activities: {
    content: [],
    totalPages: 0,
  },
  totalPages: 0,
  type: 1,
  page: 0,
  size: 10,
  total: 0,
  search: null,
  currentCard: undefined,
  activitiesLog: {
    page: 0,
    totalPages: 0,
    size: 10,
    hasMore: false,
    content: [],
  },
};

export default handleActions(
  {
    [combineActions(
      LIST_CARDS.REQUEST,
      LIST_ALL_CARDS.REQUEST,
      LIST_CARD_ACTIVITIES.REQUEST,
      LIST_MULTIPLE_CARDS_ACTIVITIES.REQUEST,
      LIST_CARDS_CURRENT_INFO.REQUEST,
      LIST_CARD_AUTH.REQUEST,
      LIST_NOTIFY_BY_CARD.REQUEST,
      ADD_CARD.SUCCESS,
      ADD_CARDS.REQUEST,
      UPDATE_CARD.REQUEST,
      DELETE_CARD.REQUEST,
      GET_CARD_DETAIL.REQUEST,
    )]: (state, action) => ({
      ...state,
      isLoading: true,
    }),

    [combineActions(
      LIST_CARDS.FAILURE,
      LIST_ALL_CARDS.FAILURE,
      LIST_CARD_ACTIVITIES.FAILURE,
      LIST_MULTIPLE_CARDS_ACTIVITIES.FAILURE,
      LIST_CARDS_CURRENT_INFO.FAILURE,
      LIST_CARD_AUTH.FAILURE,
      LIST_NOTIFY_BY_CARD.FAILURE,
      ADD_CARD.FAILURE,
      ADD_CARDS.FAILURE,
      UPDATE_CARD.FAILURE,
      DELETE_CARD.FAILURE,
      GET_CARD_DETAIL.FAILURE,
    )]: (state, action) => ({
      ...state,
      isLoading: false,
    }),

    [combineActions(ADD_CARD_INVITE.REQUEST, ADD_CARD_AUTH.REQUEST)]: (state) => ({
      ...state,
      isUpdating: true,
    }),

    [combineActions(
      ADD_CARD_INVITE.SUCCESS,
      ADD_CARD_AUTH.SUCCESS,
      ADD_CARD_AUTH.FAILURE,
      ADD_CARD_INVITE.FAILURE,
    )]: (state) => ({
      ...state,
      isUpdating: false,
    }),

    [combineActions(DELETE_CARD_INVITE.REQUEST, DELETE_CARD_AUTH.REQUEST)]: (state) => ({
      ...state,
      isDeleting: true,
    }),

    [combineActions(
      DELETE_CARD_INVITE.SUCCESS,
      DELETE_CARD_AUTH.SUCCESS,
      DELETE_CARD_AUTH.FAILURE,
      DELETE_CARD_INVITE.FAILURE,
    )]: (state) => ({
      ...state,
      isDeleting: false,
    }),

    [LIST_CARDS.SUCCESS]: (state, { payload: { data, ...rest } = {} }) => ({
      ...state,
      ...rest,
      content: data,
      isLoading: false,
    }),
    [LIST_ALL_CARDS.SUCCESS]: (state, { payload: { data } = {} }) => ({
      ...state,
      primaryCards: data.filter((x) => x.type === 1),
      primaryCardCount: data.filter((x) => x.type === 1).length,
      secondaryCards: data.filter((x) => x.type === 1),
      secondaryCardCount: data.filter((x) => x.type === 2).length,
      isLoading: false,
    }),
    [LIST_CARD_ACTIVITIES.SUCCESS]: (state, action) => {
      const { data, ...rest } = action.payload;
      let content = state.activities.content;
      if (data) {
        if (content.length === 0) {
          content = data;
        } else {
          content[0].cardPositions = content[0].cardPositions.concat(data[0].cardPositions);
        }
      }
      return {
        ...state,
        activities: {
          content,
          ...rest,
        },
        isLoading: false,
      };
    },
    [LIST_CARDS_CURRENT_INFO.SUCCESS]: (state, action) => {
      const content = action.payload.data.map((item) => item.current);
      return {
        ...state,
        content,
        isLoading: false,
      };
    },
    [LIST_CARD_AUTH.SUCCESS]: (state, { payload: { data, ...rest } = {} }) => ({
      ...state,
      ...rest,
      content: data,
      isLoading: false,
    }),
    [LIST_MULTIPLE_CARDS_ACTIVITIES.SUCCESS]: (state, action) => {
      // 依照card各自merge
      let content = state.activities.content;
      if (action.payload.data) {
        if (content.length === 0) {
          content = action.payload.data;
        } else {
          action.payload.data.forEach((val) => {
            for (let i in content) {
              if (content[i].id === val.id) {
                content[i].cardPositions = content[i].cardPositions.concat(val.cardPositions);
              }
            }
          });
        }
      }
      return {
        ...state,
        activities: {
          content,
        },
        isLoading: false,
      };
    },
    [LIST_CARDS_CURRENT_INFO.SUCCESS]: (state, action) => ({
      ...state,
      content: action.payload.data,
      isLoading: false,
    }),
    [GET_CARD_DETAIL.SUCCESS]: (state, action) => {
      const newCard = action.payload.data;
      // HOTFIX: guardareaList is null in some cases
      if (!newCard.guardareaList) {
        newCard.guardareaList = [];
      }
      return {
        ...state,
        data: newCard,
        currentCard: newCard,
        isLoading: false,
      };
    },
    [CLEAR_CARD_DETAIL.REQUEST]: (state, action) => ({
      ...state,
      data: initialState.data,
      currentCard: undefined,
    }),
    [CLEAR_CARD_ACTIVITIES.REQUEST]: (state, action) => {
      let content = [];
      // filter by specific card
      if (action.payload) {
        content = state.activities.content.filter((act) => act.id === action.payload);
      }

      return {
        ...state,
        activities: {
          content,
          totalPages: 0,
        },
        activitiesLog: initialState.activitiesLog,
      };
    },
    [LIST_NOTIFY_BY_CARD.SUCCESS]: (state, action) => ({
      ...state,
      isLoading: false,
      activitiesLog: {
        ...action.payload,
        hasMore: action.payload.page < action.payload.totalPages,
        content: action.payload.data
          ? concat(state.activitiesLog.content, action.payload.data)
          : state.activitiesLog.content,
      },
    }),
  },
  initialState,
);

const makeGetQueryParams = (state) => ({
  page: state.cards.page,
  size: state.cards.size,
  type: state.cards.type,
  search: state.cards.search,
});
