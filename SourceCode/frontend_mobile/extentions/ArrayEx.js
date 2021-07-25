function findIndexById(array, _id) {
  for (var i = array.length - 1; i >= 0; i--)
    if (array[i]._id === _id) return i;
  return -1;
}

function convertNumberToVND(number) {
  var price = number.toString();
  var count = 0;
  var result = '';
  for (var i = price.length - 1; i >= 0; i--) {
    if (count % 3 === 0 && count !== 0) result += '.';
    result += price[i];
    count++;
  }
  return result.split('').reverse().join('');
}

function time_ago(time) {
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) time = time.getTime();
      break;
    default:
      time = +new Date();
  }
  var time_formats = [
    [60, 'giây trước', 1], // 60
    [120, '1 phút', '1 minute from now'], // 60*2
    [3600, 'phút trước', 60], // 60*60, 60
    [7200, '1 giờ', '1 hour from now'], // 60*60*2
    [86400, 'giờ trước', 3600], // 60*60*24, 60*60
    [172800, 'Hôm qua', 'Tomorrow'], // 60*60*24*2
    [604800, 'ngày trước', 86400], // 60*60*24*7, 60*60*24
    [1209600, 'Tuần trước', 'Next week'], // 60*60*24*7*4*2
    [2419200, 'tuần trước', 604800], // 60*60*24*7*4, 60*60*24*7
    [4838400, 'Tháng trước', 'Next month'], // 60*60*24*7*4*2
    [29030400, 'tháng trước', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
    [58060800, 'Năm trước', 'Next year'], // 60*60*24*7*4*12*2
    [2903040000, 'năm trước', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
    [5806080000, 'Thế kỷ trước', 'Next century'], // 60*60*24*7*4*12*100*2
    [58060800000, 'thể kỷ trước', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
  ];
  var seconds = (+new Date() - time) / 1000,
    list_choice = 1;

  if (seconds === 0) {
    return 'vừa mới';
  }
  if (seconds < 0) {
    seconds = Math.abs(seconds);
    list_choice = 2;
  }
  var i = 0;
  var length = time_formats.length;
  var format;
  while (i < length) {
    format = time_formats[i++];
    if (seconds < format[0]) {
      if (typeof format[2] === 'string') return format[list_choice];
      else return Math.floor(seconds / format[2]) + ' ' + format[1];
    }
  }
  return time;
}

function isNumber(n) {
  // var isNumber = (!isNaN(parseInt(n)) && !isNaN(n - 0));
  var isNumber = Number.isInteger(Number(n)) && !n.includes('.');
  if (isNumber)
    return {
      valid: isNumber,
      error: '',
    };
  return {
    valid: isNumber,
    error: 'Vui lòng nhập số',
  };
}

function isValidLength(n, start, end) {
  if (n.length >= start && n.length <= end)
    return {
      valid: true,
      error: '',
    };
  return {
    valid: false,
    error: 'Độ dài từ ' + start + ' đến ' + end,
  };
}

function isPhoneNumber(n) {
  var isNumberr = isNumber(n);
  if (!isNumberr.valid) {
    return false;
  }
  if (n.length > 11 || n.length < 10) {
    return false;
  }
  if (n.charAt(0) !== '0') {
    return false;
  }
  return true;
}

function isEmail(value) {
  const re = /\S+@\S+\.\S+/;
  if (!re.test(value)) return 'Ooops! We need a valid email address.';
  return '';
}

function isValidDate(date) {
  var yearNow = new Date().getFullYear();
  var year = new Date(date).getFullYear();
  if (year < yearNow - 120 || year > yearNow) return false;
  return true;
}

function formatDate(dateVal) {
  var newDate = new Date(dateVal);

  var sMonth = padValue(newDate.getMonth() + 1);
  var sDay = padValue(newDate.getDate());
  var sYear = newDate.getFullYear();
  var sHour = newDate.getHours();
  var sMinute = padValue(newDate.getMinutes());

  sHour = padValue(sHour);

  return sHour + ':' + sMinute + ' ' + sDay + '-' + sMonth + '-' + sYear;
}

function padValue(value) {
  return value < 10 ? '0' + value : value;
}

function getStringDate(miliSec) {
  const date = new Date(miliSec);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  // str = str.replace(
  //   /!|@|%|\^|\*|\(|\)|\+|\\=|\\<|\\>|\?|\/|,|\.|\\:|\\;|\\'|\\"|\\&|\\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
  //   " "
  // );
  return str;
}

export {
  removeVietnameseTones,
  findIndexById,
  convertNumberToVND,
  time_ago,
  isNumber,
  isValidLength,
  isValidDate,
  isPhoneNumber,
  isEmail,
  formatDate,
  getStringDate,
};
