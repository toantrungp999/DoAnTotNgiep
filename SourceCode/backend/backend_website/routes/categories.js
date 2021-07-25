const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("../middleware/verifyToken");
const Category = require("../models/Category");
const CategoryGroup = require("../models/CategoryGroup");
const Product = require("../models/Product");
const {
  postCategoryValidation,
  putCategoryValidation,
} = require("../validation/categoryValidation");
const STATUS = require("../constants/ResponseStatus");
const Respones = require("../models/Respones");

router.get("/:status", async (req, res) => {
  try {
    let status = req.params.status;
    if (status == "all") status = null;
    else if (status == "true") status = true;
    else if (status == false) status == false;
    const categories = await Category.find(status ? { status } : {}).sort([
      ["date", "-1"],
    ]);
    res.send(new Respones(0, categories));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.post("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = postCategoryValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  const categoryGroup = await CategoryGroup.findById(req.body.categoryGroupId);
  if (!categoryGroup)
    return res.send(new Respones(-1, null, "Không tìm thấy nhóm loại này"));
  const category = new Category({
    name: req.body.name,
    categoryGroupId: req.body.categoryGroupId,
    status: true,
  });
  try {
    const saveCategory = await category.save();
    res.send(new Respones(0, saveCategory));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const category = await Category.findById(req.params._id);
    res.send(new Respones(0, category));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = putCategoryValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const categoryGroup = await CategoryGroup.findById(
      req.body.categoryGroupId
    );
    if (!categoryGroup)
      return res.send(new Respones(-1, null, "Không tìm thấy nhóm loại này"));
    await Category.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          categoryGroupId: req.body.categoryGroupId,
          status: req.body.status,
        },
      }
    );
    await Product.updateMany(
      { categoryId: req.body._id },
      { $set: { status: req.body.status } }
    );
    res.send(new Respones(0, req.body));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
