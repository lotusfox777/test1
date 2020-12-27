import { FORM_FIELDS } from 'constants/formFields';

export function checkUserAuth({
  permissions = {},
  func = null,
  actionTypes = [FORM_FIELDS.READABLE, FORM_FIELDS.EDITABLE]
}) {
  if (!func) {
    return false;
  }

  if (!permissions[func]) {
    return false;
  }

  if (!Array.isArray(actionTypes)) {
    return permissions[func][actionTypes];
  }

  return actionTypes.some(action => permissions[func][action]);
}
