const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("./../middleware/verifyToken");
const Brand = require("../models/Brand");
const Product = require("../models/Product");
const {
  postBrandValidation,
  putBrandValidation,
} = require("../validation/brandValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/:status", async (req, res) => {
  try {
    let status = req.params.status;
    if (status == "all") status = null;
    else if (status == "true") status = true;
    else if (status == false) status == false;
    const brands = await Brand.find(status ? { status } : {});
    res.send(new Respones(0, brands));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = postBrandValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  const brand = new Brand({
    name: req.body.name,
    status: true,
    description: req.body.description ? req.body.description : "",
  });
  try {
    const saveBrand = await brand.save();
    res.send(new Respones(0, saveBrand));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/detail/:_id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params._id);
    res.send(new Respones(0, brand));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = putBrandValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await Brand.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description ? req.body.description : "",
          status: req.body.status,
        },
      }
    );
    await Product.updateMany(
      { brandId: req.body._id },
      { $set: { status: req.body.status } }
    );
    res.send(new Respones(0, req.body));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
