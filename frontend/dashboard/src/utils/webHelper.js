import moment from 'moment';

export function padStart(val = '', targetLength = 3, padString = '0') {
  targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
  padString = String(typeof padString !== 'undefined' ? padString : ' ');
  if (val.length > targetLength) {
    return String(val);
  } else {
    targetLength = targetLength - val.length;
    if (targetLength > padString.length) {
      padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
    }
    return padString.slice(0, targetLength) + String(val);
  }
}

export function arrayToObject(arr, key) {
  return Object.assign({}, ...arr.map(t => ({ [t[key]]: t })));
}

export function isWindows() {
  return navigator.platform.indexOf('Win') > -1;
}

export function downloadFile({ blob, filename }) {
  const a = document.createElement('a');
  let objectUrl = window.URL.createObjectURL(blob);

  a.href = objectUrl;
  a.download = `${moment().format('YYYYMMDDHHMMss')}_${filename}.xlsx`;
  a.click();

  return blob;
}

export function downloadCSV({ text, filename }) {
  const encode = isWindows() ? '%EF%BB%BF' : '';
  const dataStr = `data:text/csv;charset=utf-8,${encode}${encodeURIComponent(text)}`;
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute(
    'download',
    `${moment().format('YYYYMMDDHHMMss')}_${filename}.csv`,
  );
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

  return text;
}

export function downloadAsJson({ json, filename }) {
  const dataStr =
    'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', filename + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

  return json;
}
