import { createAction, handleActions, combineActions } from 'redux-actions';
import { pipe } from 'ramda';
import { message } from 'antd';
import { switchMap, map } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { listHeartRateAPI } from '../apis';

/**
 * Action Types
 */

const LIST_HEART_RATE = createRequestTypes('LIST_HEART_RATE');
/**
 * Action Creator
 */
export const listHeartRate = createAction(LIST_HEART_RATE.REQUEST);
/**
 * Epics
 */

export const listHeartRateEpic = pipe(
  ofType(LIST_HEART_RATE.REQUEST),
  switchMap(({ payload = '' }) =>
    listHeartRateAPI(payload).pipe(
      map(createAction(LIST_HEART_RATE.SUCCESS)),
      catchRequestError(e => {
        message.error(`存取失敗(${e.message})`);
        return createAction(LIST_HEART_RATE.FAILURE)();
      }),
    ),
  ),
);

const initialState = {
  isLoading: false,
  content: [],
  total: 0,
};

export default handleActions(
  {
    [combineActions(LIST_HEART_RATE.REQUEST)]: state => ({
      ...state,
      isLoading: true,
    }),

    [combineActions(LIST_HEART_RATE.FAILURE)]: state => ({
      ...state,
      isLoading: false,
    }),

    [combineActions(LIST_HEART_RATE.SUCCESS)]: (state, action) => ({
      ...state,
      content: action.payload.data,
      total: action.payload.total,
      isLoading: false,
    }),
  },
  initialState,
);
