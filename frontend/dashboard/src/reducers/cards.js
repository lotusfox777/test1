import React from 'react';
import { createAction, handleActions } from 'redux-actions';
import {
  concat,
  pipe,
  path,
  pathOr,
  compose,
  head,
  forEach,
  slice,
} from 'ramda';
import { message, Modal } from 'antd';
import { Observable } from 'rxjs';
import { switchMap, map, tap, mergeMap, pluck } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { exportToCSV } from 'utils/downloadFile';
import {
  listCardsAPI,
  listCardHealthAPI,
  getCardAPI,
  addCardsAPI,
  updateCardAPI,
  deleteCardAPI,
  listCardActivitiesAPI,
  exportCardsAPI,
  getCardHealthAPI,
  listRegionsAPI,
} from '../apis';

import i18n from 'i18next';
/**
 * Enum
 */

const createObservable = () => Observable.create((observer) => observer.next());

export const Status = {
  1: i18n.t('all:On'),
  '-1': i18n.t('all:Off'),
};

export const UsageStatus = {
  1: '使用中',
  0: '未使用',
};

export const Sex = {
  1: i18n.t('all:Male'),
  0: i18n.t('all:Female'),
};

export const convetGetSexValue = (value) => {
  if (!value) {
    return null;
  }

  return { ...value, sex: value.sex === -1 ? '' : value.sex };
};

export const convetUpdateSexValue = (value) => {
  return value ? (value.sex === undefined ? -1 : value.sex) : undefined;
};

/**
 * Action Types
 */

const LIST_CARDS = createRequestTypes('LIST_CARDS');
const LIST_CARD_HEALTH = createRequestTypes('LIST_CARD_HEALTH');
const GET_CARD = createRequestTypes('GET_CARD');
const GET_EDIT_CARD = createRequestTypes('GET_EDIT_CARD');
const ADD_CARDS = createRequestTypes('ADD_CARDS');
const UPDATE_CARD = createRequestTypes('UPDATE_CARD');
const DELETE_CARD = createRequestTypes('DELETE_CARD');
const LIST_CARD_ACTIVITIES = createRequestTypes('LIST_CARD_ACTIVITIES');
const EXPORT_CARDS = createRequestTypes('EXPORT_CARDS');
const CLEAR_CARD_ACTIVITIES = createRequestTypes('CLEAR_CARD_ACTIVITIES');
const LIST_REGIONS = createRequestTypes('LIST_REGIONS');
/**
 * Action Creator
 */
export const listCards = createAction(LIST_CARDS.REQUEST);
export const listCardHealth = createAction(LIST_CARD_HEALTH.REQUEST);
export const getCard = createAction(GET_CARD.REQUEST);
export const getEditCard = createAction(GET_EDIT_CARD.REQUEST);
export const addCards = createAction(ADD_CARDS.REQUEST);
export const updateCard = createAction(UPDATE_CARD.REQUEST);
export const deleteCard = createAction(DELETE_CARD.REQUEST);
export const listCardActivities = createAction(LIST_CARD_ACTIVITIES.REQUEST);
export const exportCards = createAction(EXPORT_CARDS.REQUEST);
export const clearCardActivities = createAction(CLEAR_CARD_ACTIVITIES.REQUEST);
export const listRegions = createAction(LIST_REGIONS.REQUEST);

/**
 * Epics
 */

export const listCardsEpic = pipe(
  ofType(LIST_CARDS.REQUEST),
  switchMap(({ payload = {} }) =>
    listCardsAPI(payload).pipe(
      map((res) => createAction(LIST_CARDS.SUCCESS)({ ...res, ...payload })),
      catchRequestError(createAction(LIST_CARDS.FAILURE)),
    ),
  ),
);

export const getCardEpic = pipe(
  ofType(GET_CARD.REQUEST),
  switchMap(({ payload = {} }) =>
    getCardAPI(payload).pipe(
      pluck('data'),
      switchMap((card) => {
        const identityId = path(['cardOwner', 'identityId'], card);

        if (identityId) {
          return getCardHealthAPI(identityId).pipe(
            pluck('data'),
            map((userHealth) =>
              createAction(GET_CARD.SUCCESS)({
                cardInfo: {
                  ...card,
                  data: {
                    ...card.data,
                    cardContact1: convetGetSexValue(card.data.cardContact1),
                    cardContact2: convetGetSexValue(card.data.cardContact2),
                    cardOwner: convetGetSexValue(card.data.cardOwner),
                  },
                  health: userHealth,
                },
              }),
            ),
          );
        }

        return createObservable().pipe(
          map(() =>
            createAction(GET_CARD.SUCCESS)({
              cardInfo: { ...card, health: {} },
            }),
          ),
        );
      }),
      catchRequestError((error) => createAction(GET_CARD.FAILURE)({ error })),
    ),
  ),
);

export const listCardHealthEpic = pipe(
  ofType(LIST_CARD_HEALTH.REQUEST),
  switchMap(({ payload = {} }) =>
    listCardHealthAPI(payload).pipe(
      map((res) =>
        createAction(LIST_CARD_HEALTH.SUCCESS)({
          cardHealth: { ...res },
          ...payload,
        }),
      ),
      catchRequestError((error) =>
        createAction(LIST_CARD_HEALTH.FAILURE)({ error }),
      ),
    ),
  ),
);

export const getEditCardEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(GET_EDIT_CARD.REQUEST),
    switchMap(({ payload = '' }) =>
      getCardAPI(payload).pipe(
        map((res) => {
          const data = {
            ...res,
            data: {
              ...res.data,
              cardContact1: convetGetSexValue(res.data.cardContact1),
              cardContact2: convetGetSexValue(res.data.cardContact2),
              cardOwner: convetGetSexValue(res.data.cardOwner),
            },
          };

          return createAction(GET_EDIT_CARD.SUCCESS)(data);
        }),
        catchRequestError((e) => {
          message.error(`取得卡片失敗 (${e.message})`);
          return createAction(GET_EDIT_CARD.FAILURE)();
        }),
      ),
    ),
  );

export const addCardsEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(ADD_CARDS.REQUEST),
    switchMap(({ payload: { cards, closeModal } = {} }) =>
      addCardsAPI(cards).pipe(
        pluck('data'),
        mergeMap((data) => {
          const hasErrors = data.failList && data.failList.length > 0;
          if (hasErrors) {
            Modal.warning({
              title: '卡片資料重複',
              content: (
                <div>
                  <br />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.failList
                        .map(
                          (x) =>
                            `${x.uuid} major(${x.major}) minor(${x.minor})`,
                        )
                        .join('<br />'),
                    }}
                  />
                </div>
              ),
            });
          }
          if (!hasErrors) {
            message.success('新增卡片成功');
            closeModal();
          }
          return [
            createAction(ADD_CARDS.SUCCESS)(),
            listCards(makeGetQueryParams(getState())),
          ];
        }),
        catchRequestError((e) => {
          message.error(
            `新增卡片失敗 (${pathOr(e.message, ['response', 'message'], e)})`,
          );
          return createAction(ADD_CARDS.FAILURE)();
        }),
      ),
    ),
  );

export const updateCardEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(UPDATE_CARD.REQUEST),
    switchMap(({ payload: { closeModal, card } = {} }) => {
      const body = {
        ...card,
        cardContact1: {
          ...card.cardContact1,
          sex: convetUpdateSexValue(card.cardContact1),
        },
        cardContact2: {
          ...card.cardContact2,
          sex: convetUpdateSexValue(card.cardContact2),
        },
        cardOwner: {
          ...card.cardOwner,
          sex: convetUpdateSexValue(card.cardOwner),
        },
      };

      return updateCardAPI(body).pipe(
        mergeMap(() => {
          closeModal();
          message.success('修改卡片成功');

          return [
            createAction(UPDATE_CARD.SUCCESS)(),
            listCards(makeGetQueryParams(getState())),
          ];
        }),
        catchRequestError((e) => {
          message.error(
            `修改卡片失敗 (${pathOr(e.message, ['response', 'message'], e)})`,
          );
          return createAction(UPDATE_CARD.FAILURE)();
        }),
      );
    }),
  );

export const deleteCardEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(DELETE_CARD.REQUEST),
    switchMap(({ payload = '' }) =>
      deleteCardAPI(payload).pipe(
        tap(() => message.success('刪除卡片成功')),
        mergeMap(() => [
          createAction(DELETE_CARD.SUCCESS)(),
          listCards(makeGetQueryParams(getState())),
        ]),
        catchRequestError((e) => {
          message.error(
            `刪除卡片失敗 (${pathOr(e.message, ['response', 'message'], e)})`,
          );
          return createAction(DELETE_CARD.FAILURE)();
        }),
      ),
    ),
  );

export const listCardActivitiesEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(LIST_CARD_ACTIVITIES.REQUEST),
    switchMap(({ payload: { updateMapCenter, ...payload } = {} }) =>
      listCardActivitiesAPI(payload).pipe(
        map((response) => {
          const data = compose(
            pathOr([], ['cardPositions']),
            head,
            pathOr([], ['data']),
          )(response);

          if (response.totalPages === payload.page + 1) {
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
              concat(data),
              pathOr([], ['cards', 'activities', 'cardPositions']),
            )(getState());

            updateMapCenter(bounds);
          }

          return createAction(LIST_CARD_ACTIVITIES.SUCCESS)(response);
        }),
        catchRequestError((e) => {
          message.error(
            `搜尋卡片軌跡失敗 (${pathOr(
              e.message,
              ['response', 'message'],
              e,
            )})`,
          );
          return createAction(LIST_CARD_ACTIVITIES.FAILURE)();
        }),
      ),
    ),
  );

export const exportCardsEpic = pipe(
  ofType(EXPORT_CARDS.REQUEST),
  switchMap((payload) =>
    exportCardsAPI(payload).pipe(
      tap((res) => {
        exportToCSV('card-list', res);
        message.success('匯出資料成功');
      }),
      map(createAction(EXPORT_CARDS.SUCCESS)),
      catchRequestError((e) => {
        message.error(
          `匯出卡片資料失敗： ${pathOr(e.message, ['response', 'message'], e)}`,
        );
        return createAction(EXPORT_CARDS.FAILURE)();
      }),
    ),
  ),
);

export const listRegionsEpic = pipe(
  ofType(LIST_REGIONS.REQUEST),
  switchMap(({ payload = '' }) =>
    listRegionsAPI(payload).pipe(
      map(createAction(LIST_REGIONS.SUCCESS)),
      catchRequestError(createAction(LIST_REGIONS.FAILURE)),
    ),
  ),
);

const initalState = {
  isLoading: false,
  isUpdating: false,
  isDownloading: false,
  isLoadingHealth: false,
  cardInfo: {},
  cardHealth: [],
  content: [],
  activities: undefined,
  totalPages: 0,
  body: {},
  page: 0,
  size: 10,
  regions: [],
};

export default handleActions(
  {
    [LIST_CARDS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_CARDS.SUCCESS]: (state, { payload: { data, ...rest } }) => ({
      ...state,
      ...rest,
      content: data,
      isLoading: false,
    }),
    [LIST_CARDS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [LIST_CARD_HEALTH.REQUEST]: (state, action) => ({
      ...state,
      isLoadingHealth: true,
    }),
    [LIST_CARD_HEALTH.SUCCESS]: (
      state,
      { payload: { cardHealth, ...rest } },
    ) => ({
      ...state,
      ...rest,
      cardHealth,
      isLoadingHealth: false,
    }),
    [LIST_CARD_HEALTH.FAILURE]: (state, action) => ({
      ...state,
      isLoadingHealth: false,
    }),
    [GET_CARD.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [GET_CARD.SUCCESS]: (state, action) => ({
      ...state,
      ...action.payload,
      isLoading: false,
    }),
    [GET_CARD.FAILURE]: (state, action) => ({
      ...state,
      ...action.payload,
      isLoading: false,
    }),
    [ADD_CARDS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [ADD_CARDS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [GET_EDIT_CARD.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [GET_EDIT_CARD.SUCCESS]: (state, { payload: { data } }) => ({
      ...state,
      cardInfo: data,
      isLoading: false,
    }),
    [GET_EDIT_CARD.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [UPDATE_CARD.REQUEST]: (state, action) => ({
      ...state,
      isUpdating: true,
    }),
    [UPDATE_CARD.SUCCESS]: (state, action) => ({
      ...state,
      isUpdating: false,
    }),
    [UPDATE_CARD.FAILURE]: (state, action) => ({
      ...state,
      isUpdating: false,
    }),
    [DELETE_CARD.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [DELETE_CARD.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [CLEAR_CARD_ACTIVITIES.REQUEST]: (state, action) => ({
      ...state,
      activities: undefined,
    }),
    [LIST_CARD_ACTIVITIES.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_CARD_ACTIVITIES.SUCCESS]: (state, { payload: { data, ...rest } }) => {
      let activities = state.activities;
      if (data.length) {
        if (!activities) {
          activities = data[0];
          activities.total = rest.total;
          activities.totalPages = rest.totalPages;
        } else {
          activities.cardPositions = activities.cardPositions.concat(
            data[0].cardPositions,
          );
        }
      }
      return {
        ...state,
        ...rest,
        activities,
        isLoading: false,
      };
    },
    [LIST_CARD_ACTIVITIES.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
    [EXPORT_CARDS.REQUEST]: (state, action) => ({
      ...state,
      isDownloading: true,
    }),
    [EXPORT_CARDS.SUCCESS]: (state, action) => ({
      ...state,
      isDownloading: false,
    }),
    [EXPORT_CARDS.FAILURE]: (state, action) => ({
      ...state,
      isDownloading: false,
    }),
    [LIST_REGIONS.REQUEST]: (state, action) => ({
      ...state,
      isLoading: true,
    }),
    [LIST_REGIONS.SUCCESS]: (state, action) => ({
      ...state,
      regions: action.payload.data,
      isLoading: false,
    }),
    [LIST_REGIONS.FAILURE]: (state, action) => ({
      ...state,
      isLoading: false,
    }),
  },
  initalState,
);

export const makeGetQueryParams = (state) => ({
  body: {},
  page: state.cards.page,
  size: state.cards.size,
});
