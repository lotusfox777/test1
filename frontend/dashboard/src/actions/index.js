import * as Types from './Types';
import { createAction } from 'redux-actions';

export const showServerError = createAction(Types.AUTH_SERVER_ERROR);
export const login = createAction(Types.AUTH_LOGIN.REQUEST);
export const logout = createAction(Types.AUTH_LOGOUT.REQUEST);
