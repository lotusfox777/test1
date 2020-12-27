/* eslint-disable indent */
import { ajax } from 'rxjs/ajax';
import { throwError } from 'rxjs';
import { pluck, catchError, tap } from 'rxjs/operators';
import NormalError from '../utils/NormalError';
import { important } from '../utils/log';
import { API_ROOT } from '../constants/endpoint';

const RegionID = '05_01';
/**
 * API Constants
 */

let _headers = {
  'Content-Type': 'application/json;charset=UTF-8',
};
export const setHeader = headers => {
  _headers = Object.assign(
    {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    headers,
  );
};

export const setContentTypeIsNull = () => {
  delete _headers['Content-Type'];
};

export const createContentType = contentType => {
  _headers['Content-Type'] = contentType;
};

export const toQueryString = paramsObject => {
  return Object.keys(paramsObject)
    .filter(
      key =>
        paramsObject[key] !== '' &&
        paramsObject[key] !== null &&
        typeof paramsObject[key] !== 'undefined',
    )
    .map(key =>
      Array.isArray(paramsObject[key])
        ? // convert to key=val1,val2,val3 string
          `${key}=${paramsObject[key].map(val => `${encodeURIComponent(val)}`).join(',')}`
        : // convert to key=val string
          `${key}=${encodeURIComponent(paramsObject[key])}`,
    )
    .join('&');
};

/**
 * API Calls
 */
export const request = (path, method = 'GET', responseType = 'json') => body => {
  return ajax({
    url: API_ROOT + path,
    method,
    headers: _headers,
    crossDomain: true,
    responseType,
    body,
  }).pipe(
    catchError(error => {
      important('api request fails');
      if (error.status === 500) {
        important('500: internal server error');
        return throwError(new NormalError(500, 'Server Error', error));
      }
      return throwError(error);
    }),
    pluck('response'),
  );
};

/**
 * Custom Functions for API Call
 */
export const loginAPI = data =>
  request('/v1/login', 'POST')({ loginId: data.loginId, password: data.password });

export const registerAPI = data =>
  request('/v1/register', 'POST')({ email: data.email, name: data.name, fRegionInfoId: RegionID });

export const registerEmailConfirmAPI = data => request(`/v1/emailConfirmed/${data.token}`, 'GET')();

export const forgotpasswordAPI = data =>
  request('/v1/forgetPassword', 'POST')({ email: data.email, fRegionInfoId: RegionID });

export const resetPasswordAPI = data =>
  request('/v1/resetPassword', 'POST')({ token: data.token, password: data.password });

export const resetPasswordEmailconfirmAPI = authToken =>
  request(`/v1/forgetPasswordEmailConfirmed/${authToken}`, 'GET')();

/**
 * 裝置管理
 * GET /v1/card/list/{type}/{page}/{size} 個人裝置清單
 * POST /v1/card/auth 前台新增裝置
 * POST /v1/card/auth/list 前台批次新增裝置
 * GET /v1/card/detail/{cardSeq} (前台)取得裝置資料
 * DELETE /v1/card/detail/{cardSeq} (前台)刪除裝置
 * PUT /v1/card/detail/{cardSeq} (前台)編輯裝置
 * DELETE /v1/card/invite (前端)刪除副管理者名單 or 副管理者邀請
 * POST /v1/card/invite (前端)發送副管理者名單邀請
 * GET /v1/card/inviteAccept/{token} (前端)接受副管理者名單邀請
 * GET /v1/card/listWithAuthCount/{page}/{size} 個人裝置清單(含授權數量)
 */
export const listCardActivitiesAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/card/list/timeperiodPage/${page}/${size}`, 'POST')(body);
export const listMultipleCardsActivitiesAPI = ({ body, page, size }) =>
  request(`/v1/card/list/timeperiodsPage/${page}/${size}`, 'POST')(body);
export const listCardsAPI = ({ type = 1, size = 10, page = 0, ...params }) =>
  request(`/v1/card/list/${type}/${page}/${size}?${toQueryString(params)}`, 'GET')();
export const addCardAPI = ({ body, ...params }) => {
  setContentTypeIsNull();
  return request(`/v1/card/auth?${toQueryString(params)}`, 'POST')(body).pipe(
    tap(() => createContentType('application/json;charset=UTF-8')),
  );
};
export const addCardsAPI = body => request('/v1/card/auth/list', 'POST')(body);
export const getCardAPI = id => request(`/v1/card/detail/${id}`, 'GET')();
export const deleteCardAPI = id => request(`/v1/card/detail/${id}`, 'DELETE')();
export const updateCardAPI = ({ id, body, ...params }) => {
  setContentTypeIsNull();
  return request(`/v1/card/detail/${id}?${toQueryString(params)}`, 'PUT')(body).pipe(
    tap(() => createContentType('application/json;charset=UTF-8')),
  );
};
export const addCardAuthAPI = body =>
  request('/v1/card/invite', 'POST')({ ...body, fRegionInfoId: RegionID });
export const deleteCardAuthAPI = body => request('/v1/card/invite', 'DELETE')(body);
export const acceptCardInviteAPI = token => request(`/v1/card/inviteAccept/${token}`)();
export const listCardAuthAPI = ({ page = 0, size = 10, ...params }) =>
  request(`/v1/card/listWithAuthCount/${page}/${size}?${toQueryString(params)}`, 'GET')();
export const listCardsCurrentInfoAPI = params =>
  request(`/v1/card/cardsCurrentInfo?${toQueryString(params)}`, 'GET')();
export const getCardDetailAPI = id => request(`/v1/card/detail/${id}`, 'GET')();

// ufo管理
export const listUFOsAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/ufo/list/${page}/${size}`, 'POST')(body);
export const addUFOsAPI = body => request('/v1/ufo', 'POST')(body);
export const updateUFOAPI = body => request('/v1/ufo', 'PUT')(body);
export const deleteUFOAPI = id => request(`/v1/ufo/${id}`, 'DELETE')();
export const listUFOCardsAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/ufo/cardlist/timeperiod/${page}/${size}`, 'POST')(body);

// 守護區域管理
export const listGuardAreasAPI = () => request('/v1/guardarea/custom/list', 'GET')();
export const listGuardAreasByTypeAPI = ({ type = 0, ...params }) =>
  request(`/v1/guardarea/custom/list/${type}?${toQueryString(params)}`, 'GET')();
export const addGuardAreaAPI = body => request('/v1/guardarea/custom', 'POST')(body);
export const updateGuardAreaAPI = body => request('/v1/guardarea/custom', 'PUT')(body);
export const updateGuardAreaUFOsAPI = body => request('/v1/guardarea', 'PATCH')(body);
export const deleteGuardAreaAPI = id => request(`/v1/guardarea/${id}`, 'DELETE')();
export const listUFOsInRangeAPI = body => request('/v1/ufo/inRange', 'POST')(body);
export const listUFOsInRoundRangeAPI = body => request('/v1/ufo/inRoundRange', 'POST')(body);
export const listGuardAreaUFOsAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/guardarea/ufoList/${page}/${size}`, 'POST')(body);
export const deleteGuardAreaUFOsAPI = body => request('/v1/guardarea/removeUfo', 'POST')(body);
export const listEnabledGuardAreasAPI = () => request('/v1/guardarea/custom/enabledList', 'GET')();
export const getGuardAreaAPI = id => request(`/v1/guardarea/custom/${id}`, 'GET')();

// 用戶管理
export const listUsersAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/member/list/${page}/${size}`, 'POST')(body);
export const updateUserAPI = ({ body = {}, ...params }) => {
  setContentTypeIsNull();
  return request(`/v1/member/mineInfo?${toQueryString(params)}`, 'PUT')(body).pipe(
    tap(() => createContentType('application/json;charset=UTF-8')),
  );
};
export const getUserAPI = id => request(`/v1/member/info/${id}`, 'GET')();
export const getCurrentUserAPI = () =>
  request(`/v1/member/mineInfo?fRegionInfoId=${RegionID}`, 'GET')();

// 系統管理
export const listManagersAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/manager/list/${page}/${size}`, 'POST')(body);
export const addManagerAPI = body => request('/v1/manager', 'POST')(body);
export const updateManagerAPI = body => request('/v1/manager', 'PUT')(body);
export const deleteManagerAPI = id => request(`/v1/manager/${id}`, 'DELETE')();

/**
 * 裝置群組
 * GET /v1/cardGroup/list 取得個人裝置群組
 * POST /v1/cardGroup 新增個人裝置群組
 * PUT /v1/cardGroup/{cardGroupSeq} 更新該群組裡的裝置
 * DELETE /v1/cardGroup/{cardGroupSeq} 刪除個人裝置群組
 * GET /v1/cardGroup/{cardGroupSeq} 取得裝置群組
 */
export const listCardGroupsAPI = ({ page = 0, size = 10, ...params }) =>
  request(`/v1/cardGroup/list/${page}/${size}?${toQueryString(params)}`, 'GET')();
export const addCardGroupAPI = body => request('/v1/cardGroup', 'POST')(body);
export const updateCardGroupAPI = ({ id, cardInfos }) =>
  request(`/v1/cardGroup/${id}`, 'PUT')(cardInfos);
export const deleteCardGroupAPI = id => request(`/v1/cardGroup/${id}`, 'DELETE')();
export const getCardGroupAPI = id => request(`/v1/cardGroup/${id}`, 'GET')();

export const unreadNotifyAPI = ({ page = 0, size = 99999 }) =>
  request(`/v1/notify/list/${page}/${size}?readTag=false`, 'GET')();
export const readNotifyAPI = ({ id }) => request(`/v1/notify/read/${id}`, 'PUT')();

export const listNotifyAPI = ({ page = 0, size = 10 }) =>
  request(`/v1/notify/list/${page}/${size}`, 'GET')();
export const listNotifyByCardAPI = ({ id, page = 0, size = 10 }) =>
  request(`/v1/notify/listByCard/${id}/${page}/${size}`, 'GET')();
export const getLineBindingUrlAPI = params =>
  request(
    `/v1/member/lineBindingUrl?fRegionInfoId=${RegionID}&${toQueryString(params)}`,
    'GET',
    'text',
  )();
export const linkingAccounToLineAPI = params =>
  request(`/v1/member/lineBinding?${toQueryString(params)}`, 'GET')();
export const unbindingAccounToLineAPI = () =>
  request(`/v1/member/lineUnBinding?fRegionInfoId=${RegionID}`, 'GET')();
export const getVerifyCodeAPI = (body = {}) => request('/v1/member/verifPhone', 'POST')(body);

export const verifyPhoneAPI = smsToken => request(`/v1/member/verifPhone/${smsToken}`, 'GET')();
export const changeEmailAPI = (body = {}) =>
  request('/v1/member/replaceEmail', 'POST')({ ...body, fRegionInfoId: RegionID });
export const changeEmailConfirmedAPI = token => request(`/v1/emailReplace/${token}`, 'GET')();
export const changePasswordAPI = body => request('/v1/member/password', 'POST')(body);
export const resendEmailVerifyAPI = body =>
  request('/v1/resendEmailVerify', 'POST')({ ...body, fRegionInfoId: RegionID });

export const listHeartRateAPI = ({ page, size, ...params }) =>
  request(`/v1/card/healthData/${page}/${size}?${toQueryString(params)}`, 'GET')();
