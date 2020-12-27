import moment from 'moment';

export const today = moment().valueOf();
const perDay = 86400000;

/**
 * get some days ago time unix from today
 * @param {number} day how many days age
 * @return {string} time unix string
 */
const getStartDate = day => String(today - day * perDay, 10);

export const dateOptions = {
  week: getStartDate(7),
  month: getStartDate(30),
  quart: getStartDate(90),
  half: getStartDate(180),
  year: getStartDate(365),
};
