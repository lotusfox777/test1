import { createAction, handleActions } from 'redux-actions';
import { pipe, pathOr } from 'ramda';
import { message } from 'antd';
import { switchMap, map, mergeMap } from 'rxjs/operators';
import { createRequestTypes } from 'actions/Types';
import { ofType, catchRequestError } from '../utils/extendOperators';
import { listAssistFindingsAPI, updateAssistFindingStatAPI } from '../apis';

export const REVIEW_STATS = {
  0: '未申請',
  1: '未審核',
  2: '通過',
  3: '未通過',
  4: '協尋成功',
  5: '取消',
};

const LIST_ASSIST_FINDINGS = createRequestTypes('LIST_ASSIST_FINDINGS');
const UPDATE_ASSIST_FINDING = createRequestTypes('UPDATE_ASSIST_FINDING');

export const listAssistFindings = createAction(LIST_ASSIST_FINDINGS.REQUEST);
export const updateAssistFinding = createAction(UPDATE_ASSIST_FINDING.REQUEST);

export const listAssistFindingsEpic = pipe(
  ofType(LIST_ASSIST_FINDINGS.REQUEST),
  switchMap(({ payload = {} }) =>
    listAssistFindingsAPI(payload).pipe(
      map(res =>
        createAction(LIST_ASSIST_FINDINGS.SUCCESS)({ ...res, ...payload }),
      ),
      catchRequestError(createAction(LIST_ASSIST_FINDINGS.FAILURE)),
    ),
  ),
);

export const updateAssistFindingEpic = (actions, { getState }) =>
  actions.pipe(
    ofType(UPDATE_ASSIST_FINDING.REQUEST),
    switchMap(({ payload: { onCompleted, ...values } = {} }) =>
      updateAssistFindingStatAPI(values).pipe(
        mergeMap(() => {
          onCompleted();
          message.success('修改成功');

          return [
            createAction(UPDATE_ASSIST_FINDING.SUCCESS)(),
            listAssistFindings(makeGetQueryParams(getState())),
          ];
        }),
        catchRequestError(e => {
          message.error(
            `修改失敗 (${pathOr(e.message, ['response', 'message'], e)})`,
          );
          return createAction(UPDATE_ASSIST_FINDING.FAILURE)();
        }),
      ),
    ),
  );

const initalState = {
  loading: false,
  updating: false,
  content: [],
  totalPages: 0,
  page: 0,
  size: 10,
  status: null,
};

export default handleActions(
  {
    [LIST_ASSIST_FINDINGS.REQUEST]: (state, action) => ({
      ...state,
      loading: true,
    }),
    [LIST_ASSIST_FINDINGS.SUCCESS]: (
      state,
      { payload: { data, ...rest } },
    ) => ({
      ...state,
      ...rest,
      content: data,
      loading: false,
    }),
    [LIST_ASSIST_FINDINGS.FAILURE]: (state, action) => ({
      ...state,
      loading: false,
    }),
    [UPDATE_ASSIST_FINDING.REQUEST]: (state, action) => ({
      ...state,
      updating: true,
    }),
    [UPDATE_ASSIST_FINDING.SUCCESS]: (state, action) => ({
      ...state,
      updating: false,
    }),
    [UPDATE_ASSIST_FINDING.FAILURE]: (state, action) => ({
      ...state,
      updating: false,
    }),
  },
  initalState,
);

export const makeGetQueryParams = state => ({
  status: state.assistFinding.status,
  page: state.assistFinding.page,
  size: state.assistFinding.size,
});
