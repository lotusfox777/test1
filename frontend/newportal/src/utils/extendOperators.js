import { from } from 'rxjs';
import { ofType as rxOfType } from 'redux-observable';
import { pipe } from 'ramda';
import { filter, pluck, catchError } from 'rxjs/operators';
import NormalError, { shouldDisplayError } from './NormalError';
import { showServerError } from '../actions/index';

/**
 * filter action's type
 * @param {string} type action's type
 */
export const ofType = type => filter(action => action.type === type);

/**
 * filter action's type & return action's payload
 * @param {string} type type of action
 */
export const getPayloadByType = type =>
  pipe(
    rxOfType(type),
    pluck('payload')
  );
export const catchRequestError = callback =>
  catchError(error => {
    let errorList = [callback(error)];
    if (error instanceof NormalError && shouldDisplayError(error)) {
      errorList.push(showServerError(error));
    }
    if (!(error instanceof NormalError) && shouldDisplayError(error)) {
      errorList.push(
        showServerError(NormalError(error.status, 'Server Error', error))
      );
    }
    return from(errorList);
  });
