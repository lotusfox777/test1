export const downloadFile = response => {
  var disposition = response.xhr.getResponseHeader('Content-disposition');
  var matches = /=([^;]*)/.exec(disposition);
  var filename =
    matches != null && matches[1]
      ? decodeURIComponent(matches[1])
      : 'report.xlsx';
  var blob = new Blob([response.response], { type: response.response.type });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToCSV = (fileName, data) => {
  const blob = new Blob(['\uFEFF', data], { type: 'text/csv;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  document.body.appendChild(link);
  link.href = href;
  link.download = `${fileName}.csv`;
  link.click();
};
