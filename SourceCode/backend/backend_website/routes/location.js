const router = require("express").Router();
const cities = require("../resources/cities.json");
const all = require("../resources/standardData.json");
const Respones = require("../models/Respones");
const STATUS = require("../constants/ResponseStatus");
const { getGeocode, getLocation } = require("../services/mapService");
const { postAddressValidation } = require("./../validation/userValidation");

router.get("/cities", async (req, res) => {
  const result = cities.map((city) => ({ id: city.id, name: city.name }));
  res.send(new Respones(0, result));
});

router.get("/districts/:id", async (req, res) => {
  const result = all
    .filter((city) => city.id == req.params.id)
    .map((city) => city.districts);
  res.send(new Respones(0, result[0]));
});

router.get("/geocode", async (req, res) => {
  var data = req.query;
  const { error } = postAddressValidation({
    city: data.city,
    district: data.district,
    ward: data.ward,
    streetOrBuilding: data.streetOrBuilding,
    isDefault: true,
  });
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    const address =
      data.streetOrBuilding +
      "," +
      data.ward +
      "," +
      data.district +
      "," +
      data.city;
    const result = await getGeocode(address);
    console.log(result);
    res.send(new Respones(0, result.data.results[0]));
  } catch (error) {
    console.log(error);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/location", async (req, res) => {
  var data = req.query;
  try {
    const latlng = `${data.lat},${data.lng}`;
    const result = await getLocation(latlng);
    console.log(result);
    res.send(new Respones(0, result.data.results[0]));
  } catch (error) {
    console.log(error);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
