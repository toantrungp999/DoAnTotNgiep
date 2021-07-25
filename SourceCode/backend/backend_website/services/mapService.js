const { Client } = require("@googlemaps/google-maps-services-js");
const { LatLng } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

// module.exports =  function calculateShippingFee(address){

// }

module.exports.getGeocode = async function getGeocode(address) {
  return await client.geocode({
    params: {
      address: address,
      language: "VI",
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });
};

module.exports.getLocation = async function getLocation(latlng) {
  return await client.geocode({
    params: {
      latlng: latlng,
      language: "VI",
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });
};
