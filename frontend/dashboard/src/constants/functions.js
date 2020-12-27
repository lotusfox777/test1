import { find, keys } from 'ramda';
import {
  CARD_MANAGEMENT,
  MEMBER_MANAGEMENT,
  DEVICE_MANAGEMENT,
  SYSTEM_MANAGEMENT,
  ASSIST_FINDING_MANAGEMENT,
} from './routes';

export function getFunc(pathname) {
  const funcName = pathname.split('/')[1];
  return find(key => functions[key] === funcName)(keys(functions));
}

export const functions = {
  CARD_MANAGEMENT,
  MEMBER_MANAGEMENT,
  DEVICE_MANAGEMENT,
  SYSTEM_MANAGEMENT,
  ASSIST_FINDING_MANAGEMENT,
};

export default functions;
