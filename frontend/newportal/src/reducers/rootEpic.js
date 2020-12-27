import { combineEpics } from 'redux-observable';

import { loginEpic, logoutEpic, loginInitEpic } from './auth';
import { registerEpic, registerEmailConfirmEpic } from './register';
import {
  forgotpasswordEpic,
  resetpasswordEpic,
  resetpasswordEmailConfirmEpic,
  initpasswordEpic,
} from './forgotpassword';

import {
  listCardsEpic,
  listAllCardsEpic,
  addCardsEpic,
  updateCardEpic,
  deleteCardEpic,
  listCardActivitiesEpic,
  listMultipleCardsActivitiesEpic,
  addCardEpic,
  addCardInviteEpic,
  deleteCardInviteEpic,
  acceptCardInviteEpic,
  listCardAuthEpic,
  addCardAuthEpic,
  deleteCardAuthEpic,
  listCardsCurrentInfoEpic,
  getCardDetailEpic,
  listNotifyByCardEpic,
} from './cards';

import { listUFOsEpic, addUFOsEpic, updateUFOEpic, deleteUFOEpic, listUFOCardsEpic } from './ufos';

import {
  listGuardAreasEpic,
  addGuardAreaEpic,
  updateGuardAreaEpic,
  updateGuardAreaUFOsEpic,
  deleteGuardAreaEpic,
  listUFOsInRangeEpic,
  listUFOsInRoundRangeEpic,
  listGuardAreaUFOsEpic,
  deleteGuardAreaUFOsEpic,
  listEnabledGuardAreasEpic,
  getGuardAreaEpic,
  listNotifyEpic,
  unreadNotifyEpic
} from './guardAreas';

import {
  listUsersEpic,
  updateUserEpic,
  getUserEpic,
  getCurrentUserEpic,
  getLineBindingUrlEpic,
  bindingLineEpic,
  unbindingLineEpic,
  verifyPhoneEpic,
  getVerifyCodeEpic,
  changeEmailEpic,
  changePasswordEpic,
  changeEmailConfirmedEpic,
} from './users';

import { listManagersEpic, addManagerEpic, updateManagerEpic, deleteManagerEpic } from './managers';

import {
  listCardGroupsEpic,
  addCardGroupEpic,
  getCardGroupsEpic,
  updateCardGroupEpic,
  deleteCardGroupEpic,
} from './cardGroups';

import { listHeartRateEpic } from './device';

const deviceEpics = [listHeartRateEpic];

const cardsEpics = [
  listCardsEpic,
  listAllCardsEpic,
  addCardsEpic,
  updateCardEpic,
  deleteCardEpic,
  listCardActivitiesEpic,
  listMultipleCardsActivitiesEpic,
  addCardEpic,
  addCardInviteEpic,
  deleteCardInviteEpic,
  acceptCardInviteEpic,
  listCardAuthEpic,
  addCardAuthEpic,
  deleteCardAuthEpic,
  listCardsCurrentInfoEpic,
  getCardDetailEpic,
  listNotifyByCardEpic,
];

const ufosEpics = [listUFOsEpic, addUFOsEpic, updateUFOEpic, deleteUFOEpic, listUFOCardsEpic];

const guardAreasEpics = [
  listGuardAreasEpic,
  addGuardAreaEpic,
  updateGuardAreaEpic,
  updateGuardAreaUFOsEpic,
  deleteGuardAreaEpic,
  listUFOsInRangeEpic,
  listUFOsInRoundRangeEpic,
  listGuardAreaUFOsEpic,
  deleteGuardAreaUFOsEpic,
  listEnabledGuardAreasEpic,
  getGuardAreaEpic,
  listNotifyEpic,
  unreadNotifyEpic,
];

const usersEpics = [
  listUsersEpic,
  updateUserEpic,
  getUserEpic,
  getCurrentUserEpic,
  getLineBindingUrlEpic,
  bindingLineEpic,
  unbindingLineEpic,
  verifyPhoneEpic,
  getVerifyCodeEpic,
  changeEmailEpic,
  changePasswordEpic,
  changeEmailConfirmedEpic,
];

const managersEpics = [listManagersEpic, addManagerEpic, updateManagerEpic, deleteManagerEpic];

const registerEpics = [registerEpic, registerEmailConfirmEpic];

const cardGroupsEpics = [
  listCardGroupsEpic,
  addCardGroupEpic,
  getCardGroupsEpic,
  updateCardGroupEpic,
  deleteCardGroupEpic,
];

const forgotpassowrdEpics = [
  forgotpasswordEpic,
  resetpasswordEpic,
  resetpasswordEmailConfirmEpic,
  initpasswordEpic,
];

export default combineEpics(
  loginEpic,
  logoutEpic,
  loginInitEpic,
  ...forgotpassowrdEpics,
  ...registerEpics,
  ...cardsEpics,
  ...ufosEpics,
  ...guardAreasEpics,
  ...usersEpics,
  ...managersEpics,
  ...cardGroupsEpics,
  ...deviceEpics,
);
