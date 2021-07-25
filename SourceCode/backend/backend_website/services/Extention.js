const generator = require("generate-password");
const ListAccessToken = require("./Global");
const jwt = require("jsonwebtoken");

function findIndexById(list, _id) {
  for (var i = list.length - 1; i >= 0; i--) if (list[i]._id == _id) return i;
  return -1;
}

function addTokenAndTimeInArray(user, expirationTime) {
  let accessToken = generator.generate({
    length: 50,
    numbers: true,
  });
  let date = Date.now();
  let secondNow = date / 1000;
  for (let i = ListAccessToken.length - 1; i >= 0; i--) {
    if (ListAccessToken[i]._id == user._id) ListAccessToken.splice(i, 1);
    else if (ListAccessToken[i].date / 1000 - secondNow >= expirationTime)
      ListAccessToken.splice(i, 1);
  }
  ListAccessToken.push({ _id: user._id, accessToken, date: Date.now() });
  return jwt.sign({ _id: user._id, role: user.role }, accessToken);
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

function stringToSlug(str) {
  // remove accents
  var from =
      "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
    to =
      "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], "gi"), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return str;
}

const paginate = function (array, index, size) {
  // transform values
  index = Math.abs(parseInt(index));
  index = index > 0 ? index - 1 : index;
  size = parseInt(size);
  size = size < 1 ? 1 : size;

  // filter
  return [
    ...array.filter((value, n) => {
      return n >= index * size && n < (index + 1) * size;
    }),
  ];
};

const findMostFrequency = function (store) {
  var frequency = {}; // array of frequency.
  var max = 0; // holds the max frequency.
  var result = null; // holds the max frequency element.
  for (var v in store) {
    frequency[store[v]] = (frequency[store[v]] || 0) + 1; // increment frequency.
    if (frequency[store[v]] > max) {
      // is this frequency > max so far ?
      max = frequency[store[v]]; // update max.
      result = store[v]; // update result.
    }
  }
  return result;
};

module.exports = {
  findIndexById,
  isNumber,
  addTokenAndTimeInArray,
  stringToSlug,
  paginate,
  findMostFrequency,
};
