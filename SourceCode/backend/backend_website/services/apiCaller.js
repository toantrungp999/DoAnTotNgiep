const axios = require("axios");

function apiCallerDelivery(method, url, data) {
  return axios({
    method: method,
    headers: {
      token: process.env.GHN_TOKEN,
      "Content-Type": "application/json",
    },
    url: url,
    data: data,
  });
}

function apiCaller(method, url, data) {
  return axios({
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    url: url,
    data: data,
  });
}

module.exports = { apiCallerDelivery, apiCaller };
