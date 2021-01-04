/* eslint indent:0 */
export const isProd = process.env.NODE_ENV === 'production';

export const API_ROOT = process.env.REACT_APP_API_ROOT
  ? process.env.REACT_APP_API_ROOT
  : isProd
  ? 'https://trackerdplusweb.openlife.co'
  : 'http://59.120.53.132:8999';

export const GOOGLE_MAP_KEY = isProd
  ? 'AIzaSyAfSCgaoHbhWhhbYKaPdlzXgn1Jyn9gBFc'
  : 'AIzaSyD57VU1kusSrMnhUgDBW2AxidsQMAQDzIc';

export const BLOCK_CHAIN_SERVICE =
  process.env.REACT_APP_BLOCK_CHAIN_SERVICE ||
  (isProd
    ? 'https://smartcard.kkservice.cc/getGpsData'
    : 'http://test-coreserver.kkservice.cc:3001');

export const DEFAULT_MAP_CENTER = {
  lat: process.env.REACT_APP_DEFAULT_MAP_LAT
    ? Number(process.env.REACT_APP_DEFAULT_MAP_LAT)
    : 22.616461,
  lng: process.env.REACT_APP_DEFAULT_MAP_LNG
    ? Number(process.env.REACT_APP_DEFAULT_MAP_LNG)
    : 120.526413,
};

export const APP_TITLE =
  process.env.REACT_APP_TITLE || 'PUI backstage management';
