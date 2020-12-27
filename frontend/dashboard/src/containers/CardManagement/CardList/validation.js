import { filter, map, compose, any, length } from 'ramda';

export const isEmpty = value =>
  value === undefined || value === null || value === '';

export function validateIdentityId(rule, value, callback) {
  const re = /[a-zA-Z]{1}[0-9]{9}$/;

  if (!isEmpty(value)) {
    if (value.length !== 10 || !re.test(value)) {
      return callback('身分證格式不正確');
    }

    const tab = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
    const A1 = [
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      3,
      3,
    ];
    const A2 = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      0,
      1,
      2,
      3,
      4,
      5,
    ];
    const Mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

    let i = tab.indexOf(value.charAt(0));
    if (i === -1) {
      return callback('身分證格式不正確');
    }

    let sum = A1[i] + A2[i] * 9;

    for (i = 1; i < 10; i++) {
      const v = parseInt(value.charAt(i), 10);
      if (isNaN(v)) {
        return callback('身分證格式不正確');
      }
      sum = sum + v * Mx[i];
    }
    if (sum % 10 !== 0) {
      return callback('身分證格式不正確');
    }
  }

  callback();
}

export function validateMobile(rule, value, callback) {
  const reMobile = /^[09]{2}[0-9]{8}$/;
  const rePhone = /[0-9]{2,3}-[0-9]{6,8}$/;

  if (!isEmpty(value) && !reMobile.test(value) && !rePhone.test(value)) {
    return callback('請輸入正確的手機(09xxxxxxxx)或市話(xx-xxxxxxx)格式');
  }

  callback();
}

export function number() {
  return { pattern: /^[0-9]*$/g, message: '請輸入數字' };
}

const contactFileds = ['name', 'contactMobile', 'sex', 'relationship'];

export function asyncValidate({ field, getFieldValue }) {
  return (rule, value, callback) => {
    const splitted = field.split('.');
    const prefix =
      length(splitted) === 2 ? splitted[0] : splitted.slice(0, 2).join('.');

    const fields = compose(
      filter(f => f !== field),
      map(f => `${prefix}.${f}`),
    )(contactFileds);

    const required = compose(
      any(v => !isEmpty(v)),
      map(f => getFieldValue(f)),
    )(fields);

    if (required && isEmpty(value)) {
      return callback('此欄位必填');
    }

    return callback();
  };
}
