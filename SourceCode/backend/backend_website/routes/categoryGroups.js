const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("../middleware/verifyToken");
const CategoryGroup = require("../models/CategoryGroup");
const Product = require("../models/Product");
const Category = require("../models/Category");
const {
  postCategoryGroupValidation,
  putCategoryGroupValidation,
} = require("../validation/categoryGroupValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/:status", async (req, res) => {
  try {
    let status = req.params.status;
    if (status == "all") status = null;
    else if (status == "true") status = true;
    else if (status == false) status == false;
    const categoryGroups = await CategoryGroup.find(
      status ? { status } : {}
    ).sort([["date", "-1"]]);
    res.send(new Respones(0, categoryGroups));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/with-category/:status", async (req, res) => {
  try {
    let status = req.params.status;
    if (status == "all") status = null;
    else if (status == "true") status = true;
    else if (status == false) status == false;
    let categoryGroups = [];
    const _categoryGroups = await CategoryGroup.find(status ? { status } : {});
    for (var i = 0; i < _categoryGroups.length; i++) {
      const categorys = await Category.find({
        categoryGroupId: _categoryGroups[i]._id,
      });
      categoryGroups.push({
        categoryGroup: _categoryGroups[i],
        categorys: categorys,
      });
    }

    res.send(new Respones(0, categoryGroups));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = postCategoryGroupValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  const categoryGroup = new CategoryGroup({
    name: req.body.name,
    status: true,
  });
  try {
    const saveCategoryGroup = await categoryGroup.save();
    res.send(new Respones(0, saveCategoryGroup));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const categoryGroup = await CategoryGroup.findById(req.params._id);
    res.send(new Respones(0, categoryGroup));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = putCategoryGroupValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    await CategoryGroup.updateOne(
      { _id: req.body._id },
      { $set: { name: req.body.name, status: req.body.status } }
    );
    await Category.updateMany(
      { categoryGroupId: req.body._id },
      { $set: { status: req.body.status } }
    );
    const categorys = await Category.find({ categoryGroupId: req.body._id });
    for (var i = 0; i < categorys.length; i++) {
      await Product.updateMany(
        { categoryId: categorys[i]._id },
        { $set: { status: req.body.status } }
      );
    }
    res.send(new Respones(0, req.body));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
