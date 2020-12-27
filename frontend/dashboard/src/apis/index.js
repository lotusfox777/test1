/* eslint-disable indent */
import { ajax } from 'rxjs/ajax';
import { throwError } from 'rxjs';
import { pluck, catchError } from 'rxjs/operators';
import NormalError from '../utils/NormalError';
import { important } from '../utils/log';
import { API_ROOT } from '../constants/endpoint';

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
          `${key}=${paramsObject[key]
            .map(val => `${encodeURIComponent(val)}`)
            .join(',')}`
        : // convert to key=val string
          `${key}=${encodeURIComponent(paramsObject[key])}`,
    )
    .join('&');
};

/**
 * API Calls
 */
export const request = (
  path,
  method = 'GET',
  responseType = 'json',
) => body => {
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
export const login = data =>
  request('/v1/bLogin', 'POST')({
    loginId: data.loginId,
    password: data.password,
  });

// 卡片管理
export const listCardsAPI = ({ body = {}, size = 10, page = 0, ...params }) =>
  request(`/v1/card/list/${page}/${size}?${toQueryString(params)}`, 'POST')(
    body,
  );
export const getCardAPI = id => request(`/v1/card/${id}`, 'GET')();
export const addCardsAPI = body => request('/v1/card', 'POST')(body);
export const updateCardAPI = body => request('/v1/card', 'PUT')(body);
export const deleteCardAPI = id => request(`/v1/card/${id}`, 'DELETE')();
export const listCardActivitiesAPI = ({ body, page = 0, size = 10 }) =>
  request(`/v1/card/list/timeperiodPage/${page}/${size}`, 'POST')(body);
export const exportCardsAPI = ({ body = {} }) =>
  request('/v1/card/listExport', 'POST', 'blob')(body);
export const getCardHealthAPI = id => request(`/v1/health/${id}`, 'GET')();
export const listCardHealthAPI = ({ size = 10, page = 0, ...params }) =>
  request(
    `/v1/card/healthData/${page}/${size}?${toQueryString(params)}`,
    'GET',
  )();

// ufo管理
export const listUFOsAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/ufo/list/${page}/${size}`, 'POST')(body);
export const addUFOsAPI = body => request('/v1/ufo', 'POST')(body);
export const updateUFOAPI = body => request('/v1/ufo', 'PUT')(body);
export const deleteUFOAPI = id => request(`/v1/ufo/${id}`, 'DELETE')();
export const listUFOCardsAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/ufo/cardlist/timeperiod/${page}/${size}`, 'POST')(body);

// 守護區域管理
export const listGuardAreasAPI = ({ body = {}, size = 10, page = 0 }) =>
  request(`/v1/guardarea/list/${page}/${size}`, 'POST')(body);
export const addGuardAreaAPI = body => request('/v1/guardarea', 'POST')(body);
export const updateGuardAreaAPI = body => request('/v1/guardarea', 'PUT')(body);
export const updateGuardAreaUFOsAPI = body =>
  request('/v1/guardarea', 'PATCH')(body);
export const deleteGuardAreaAPI = id =>
  request(`/v1/guardarea/${id}`, 'DELETE')();
export const listUFOsInRangeAPI = body =>
  request('/v1/ufo/inRange', 'POST')(body);
export const listGuardAreaUFOsAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/guardarea/ufoList/${page}/${size}`, 'POST')(body);
export const deleteGuardAreaUFOsAPI = body =>
  request('/v1/guardarea/removeUfo', 'POST')(body);

// 用戶管理
export const listUsersAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/member/list/${page}/${size}`, 'POST')(body);
export const updateUserAPI = body =>
  request(`/v1/member/info/${body.id}`, 'PUT')(body);
export const getUserAPI = id => request(`/v1/member/info/${id}`, 'GET')();

// 系統管理
export const listManagersAPI = ({ body, size = 10, page = 0 }) =>
  request(`/v1/manager/list/${page}/${size}`, 'POST')(body);
export const addManagerAPI = body => request('/v1/manager', 'POST')(body);
export const updateManagerAPI = body => request('/v1/manager', 'PUT')(body);
export const deleteManagerAPI = id => request(`/v1/manager/${id}`, 'DELETE')();

// 協尋管理
export const listAssistFindingsAPI = ({ size = 10, page = 0, ...rest }) =>
  request(
    `/v1/card/assistFinding/all/${page}/${size}?${toQueryString(rest)}`,
    'GET',
  )();
export const updateAssistFindingStatAPI = (body = {}) =>
  request(`/v1/card/assistFinding/state/${body.id}`, 'PUT')(body);
// 區域清單
export const listRegionsAPI = () => request('/v1/region', 'GET')();
