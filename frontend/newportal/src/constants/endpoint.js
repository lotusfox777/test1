export const isProd = process.env.NODE_ENV === 'production';

export const API_ROOT =
  process.env.REACT_APP_API_ROOT ||
  (isProd ? 'https://trackerdplusweb.openlife.co' : 'http://59.120.53.132:8999');

export const GOOGLE_MAP_KEY =
  process.env.REACT_APP_GOOGLE_MAP_KEY ||
  (isProd ? 'AIzaSyAfSCgaoHbhWhhbYKaPdlzXgn1Jyn9gBFc' : 'AIzaSyD57VU1kusSrMnhUgDBW2AxidsQMAQDzIc');

export const REFRESH_INTERVAL = 5; // in seconds

export const DEFAULT_MAP_CENTER = {
  lat: process.env.REACT_APP_DEFAULT_MAP_LAT
    ? Number(process.env.REACT_APP_DEFAULT_MAP_LAT)
    : 25.031265355352772,
  lng: process.env.REACT_APP_DEFAULT_MAP_LNG
    ? Number(process.env.REACT_APP_DEFAULT_MAP_LNG)
    : 121.55866247052585,
};

export const GOOGLE_RECAPTCHA_KEY =
  process.env.REACT_APP_GOOGLE_RECAPTCHA_KEY ||
  (isProd
    ? '6Lcoy3YUAAAAAMF4LeO7dq9DrCo5kpAUIDidi4Gv'
    : '6Leag2MUAAAAABwB8j-R_6PsFe2oEwH1h5uwkuhO');

export const OPEN_RECAPTCHA_CHECK = process.env.REACT_APP_OPEN_RECAPTCHA_CHECK || 'true';

export const host =
  process.env.REACT_APP_HOST || (isProd ? 'trackerdplusweb.openlife.co' : '59.120.53.132');
export const port = process.env.REACT_APP_PORT || (isProd ? '5050' : '3005');

export const MOBILE_PORT = process.env.REACT_APP_MOBILE_PORT || '5050';

export const mobileAppUrl = `${window.location.protocol}//${host}:${MOBILE_PORT}${window.location.pathname}${window.location.search}`;

export const TAIPEI_HOST = process.env.REACT_APP_TEST_IP
  ? process.env.REACT_APP_TEST_IP
  : isProd
  ? 'taipeidplus.openlife.co'
  : 'localhost';

export const APP_TITLE = process.env.REACT_APP_TITLE || 'DPlus';
