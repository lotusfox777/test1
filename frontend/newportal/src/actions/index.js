import * as Types from './Types';
import { createAction } from 'redux-actions';

export const showServerError = createAction(Types.AUTH_SERVER_ERROR);
