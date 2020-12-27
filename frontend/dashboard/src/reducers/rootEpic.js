import { combineEpics } from 'redux-observable';
import { loginEpic, logoutEpic, loginInitEpic } from './auth';
import {
  listCardsEpic,
  getCardEpic,
  addCardsEpic,
  updateCardEpic,
  deleteCardEpic,
  listCardActivitiesEpic,
  exportCardsEpic,
  getEditCardEpic,
  listRegionsEpic,
  listCardHealthEpic,
} from './cards';

import {
  listUFOsEpic,
  addUFOsEpic,
  updateUFOEpic,
  deleteUFOEpic,
  listUFOCardsEpic,
} from './ufos';

import {
  listGuardAreasEpic,
  addGuardAreaEpic,
  updateGuardAreaEpic,
  updateGuardAreaUFOsEpic,
  deleteGuardAreaEpic,
  listUFOsInRangeEpic,
  listGuardAreaUFOsEpic,
  deleteGuardAreaUFOsEpic,
} from './guardAreas';

import { listUsersEpic, updateUserEpic, getUserEpic } from './users';

import {
  listManagersEpic,
  addManagerEpic,
  updateManagerEpic,
  deleteManagerEpic,
} from './managers';

import {
  listAssistFindingsEpic,
  updateAssistFindingEpic,
} from './assistFinding';

const cardsEpics = [
  listCardsEpic,
  getCardEpic,
  addCardsEpic,
  updateCardEpic,
  deleteCardEpic,
  listCardActivitiesEpic,
  exportCardsEpic,
  getEditCardEpic,
  listRegionsEpic,
  listCardHealthEpic,
];

const ufosEpics = [
  listUFOsEpic,
  addUFOsEpic,
  updateUFOEpic,
  deleteUFOEpic,
  listUFOCardsEpic,
];

const guardAreasEpics = [
  listGuardAreasEpic,
  addGuardAreaEpic,
  updateGuardAreaEpic,
  updateGuardAreaUFOsEpic,
  deleteGuardAreaEpic,
  listUFOsInRangeEpic,
  listGuardAreaUFOsEpic,
  deleteGuardAreaUFOsEpic,
];

const usersEpics = [listUsersEpic, updateUserEpic, getUserEpic];

const managersEpics = [
  listManagersEpic,
  addManagerEpic,
  updateManagerEpic,
  deleteManagerEpic,
];

export default combineEpics(
  loginEpic,
  logoutEpic,
  loginInitEpic,
  ...cardsEpics,
  ...ufosEpics,
  ...guardAreasEpics,
  ...usersEpics,
  ...managersEpics,
  listAssistFindingsEpic,
  updateAssistFindingEpic,
);
