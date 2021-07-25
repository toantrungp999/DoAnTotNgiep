const router = require("express").Router();
const { verifyTokenSuperAdmin } = require("./../middleware/verifyToken");
const Product = require("../models/Product");
const User = require("../models/User");
const Brand = require("../models/Brand");
const Category = require("../models/Category");
const CategoryGroup = require("../models/CategoryGroup");
const ColorOption = require("../models/ColorOption");
const SizeOption = require("../models/SizeOption");
const {
  postProductValidation,
  putProductValidation,
} = require("../validation/productValidation");
const { findMostFrequency } = require("../services/Extention");
const mongoose = require("mongoose");
const STATUS = require("../constants/ResponseStatus");
const { SPECIAL_SEARCH, OPTION } = require("../constants/ProductSearchType");
const Respones = require("../models/Respones");
const { sort, concat } = require("mathjs");

//option 0 is normal
//option 1 sort by price from low to high
//option 2 sort by price from high to low
//option 3 is bestseller
//option 4 is most prominent
router.get("/homepage/", async (req, res) => {
  try {
    var condition = [];
    const hots = await Product.find({ status: true })
      .select(
        "_id name brandId categoryId images orgin material description price saleOff numberComment numberRate numberVisit avgRate status"
      )
      .sort([["numberVisit", -1]])
      .limit(8);
    for (var i = 0; i < hots.length; i++) {
      condition.push({ productId: hots[i]._id });
    }
    //
    const bestSellers = await Product.find({ status: true })
      .select(
        "_id name brandId categoryId images orgin material description price saleOff numberComment numberRate numberVisit avgRate status"
      )
      .sort([["numberBuy", -1]])
      .limit(8);
    for (var i = 0; i < bestSellers.length; i++) {
      condition.push({ productId: bestSellers[i]._id });
    }

    //
    const news = await Product.find({ status: true })
      .select(
        "_id name brandId categoryId images orgin material description price saleOff numberComment numberRate numberVisit avgRate status"
      )
      .sort([["date", -1]])
      .limit(4);

    for (var i = 0; i < news.length; i++) {
      condition.push({ productId: news[i]._id });
    }

    // const recommended = await findRecommended(req.params.userId);
    // const recommendedProducts = recommended ? recommended.products : [];
    // condition = recommended ? condition.concat(recommended.optionCondition) : condition;
    condition = { $or: condition };
    const colorOptions = await ColorOption.find(condition);
    const sizeOptions = await SizeOption.find(condition);
    res.send(
      new Respones(0, { hots, bestSellers, news, colorOptions, sizeOptions })
    );
  } catch (error) {
    console.log(error.message);
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get(
  "/recommended/userId=:userId&productId=:productId",
  async (req, res) => {
    try {
      const { userId, productId } = req.params;
      if (!userId)
        return res.send(new Respones(0, { recommendedProducts: [] }));
      const user = await User.findById(userId);
      if (!user || !user.visitProduct || !user.visitCategory)
        return res.send(new Respones(0, { recommendedProducts: [] }));
      var visitProduct =
        user.visitProduct.length > 10
          ? user.visitProduct.slice(0, 9)
          : user.visitProduct;
      var visitCategory =
        user.visitCategory.length > 15
          ? user.visitCategory.slice(0, 14)
          : user.visitCategory;
      let products = [];
      let condition = [{ status: true }];
      if (productId && productId !== "undefined") {
        condition.push({ _id: { $ne: productId } });
      }
      let optionCondition = [];

      for (var i = 0; i < 2; ) {
        const mostProduct = findMostFrequency(visitProduct);
        if (mostProduct) {
          const product = await Product.findOne({
            $and: condition.concat([{ _id: mostProduct }]),
          });
          if (product) {
            products.push(product);
            condition.push({ _id: { $ne: mostProduct } });
            optionCondition.push({ productId: mostProduct });
            i++;
          }
          visitProduct = visitProduct.filter(
            (product) => product != mostProduct
          );
        } else {
          break;
        }
      }

      for (var i = 0; i < 6; ) {
        const mostCategory = findMostFrequency(visitCategory);
        if (mostCategory) {
          const product = await Product.find({
            $and: condition.concat([{ categoryId: mostCategory }]),
          })
            .sort([["numberBuy", -1]])
            .limit(4);
          if (product) {
            for (var j = 0; j < product.length && i < 6; j++) {
              products.push(product[j]);
              condition.push({ _id: { $ne: product[j]._id } });
              optionCondition.push({ productId: product[j]._id });
              i++;
            }
          }
          visitCategory = visitCategory.filter(
            (category) => category != mostCategory
          );
        } else {
          break;
        }
      }

      const bestSellers = await Product.find({ $and: condition })
        .sort([["numberBuy", -1]])
        .limit(10 - products.length);
      for (var i = 0; i < bestSellers.length; i++) {
        optionCondition.push({ productId: bestSellers[i]._id });
      }

      products = products.concat(bestSellers);
      const colorOptions = await ColorOption.find({ $or: optionCondition });
      const sizeOptions = await SizeOption.find({ $or: optionCondition });

      if (user && productId && productId !== "undefined") {
        const product = await Product.findById(productId);
        if (product) {
          var visitProduct = user.visitProduct;
          var visitCategory = user.visitCategory;
          if (visitProduct) {
            visitProduct.unshift(product._id);
            if (visitProduct.length > 30) {
              visitProduct = visitProduct.slice(0, 29);
            }
          } else visitProduct = [product._id];
          if (visitCategory) {
            user.visitCategory.unshift(product.categoryId);
            if (visitCategory.length > 30) {
              visitCategory = visitCategory.slice(0, 29);
            }
          } else visitCategory = [product.categoryId];
          // console.log(visitProduct);
          // console.log(visitCategory);
          await User.updateOne(
            { _id: userId },
            { visitProduct: visitProduct, visitCategory: visitCategory }
          );
        }
      }
      res.send(
        new Respones(0, {
          recommendedProducts: products,
          colorOptions,
          sizeOptions,
        })
      );
    } catch (error) {
      console.log(error.message);
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
);

router.get(
  "/path=:path&key=:key&min=:min&max=:max&option=:option&page=:page&status=:status",
  async (req, res) => {
    const pageSize = 8;
    const currentPage = Number(req.params.page);
    const { path, key, min, max, option } = req.params;
    var sort = [];
    var condition = {};
    var searchInfo = "";
    try {
      switch (path) {
        // case 'search':
        //     condition.name = { $regex: key, $options: 'i' };
        //     break;
        case "search":
          condition.$text = { $search: key };
          break;
        case "category":
          condition.categoryId = key;
          const categoryName = await Category.findById(key)
            .select("name categoryGroupId")
            .populate("categoryGroupId", "name");
          searchInfo = { categoryName };
          break;
        case "category-group":
          const categorys = await Category.find({
            categoryGroupId: key,
            status: true,
          });
          const categoryGroupName = await CategoryGroup.findById(key).select(
            "name"
          );
          searchInfo = { categoryGroupName };
          condition = [];
          for (var i = 0; i < categorys.length; i++) {
            condition.push({ categoryId: categorys[i]._id });
          }
          condition = { $or: condition };
          break;
        case "sale-off":
          condition.saleOff = { $gte: 1 };
          break;
        case "all":
          break;
        case "black-color":
          const colors = await ColorOption.find({ color: "Đen" }).select(
            "productId"
          );
          condition = [];
          for (var i = 0; i < colors.length; i++) {
            condition.push({ _id: colors[i].productId });
          }
          condition = { $or: condition };
          break;
        //this is special search, not use option to sort, not have a key
        case "hot-product":
        case "new-product":
        case "best-seller":
          for (var i = 0; i < SPECIAL_SEARCH.length; i++) {
            if (SPECIAL_SEARCH[i].path == path) {
              sort.push(SPECIAL_SEARCH[i].field);
              break;
            }
          }
          break;
      }
      condition.$and = [
        { price: { $gte: Number(min) } },
        { price: { $lte: Number(max) } },
      ];
      if (sort.length === 0) {
        for (var i = 0; i < OPTION.length; i++) {
          if (OPTION[i].key.toString() === option) {
            sort.push(OPTION[i].sort);
            break;
          }
        }
      }

      condition.status = true;
      console.log(condition);

      console.log(Date.now());
      const products = await Product.find(condition)
        .sort(sort)
        .select(
          "_id name brandId categoryId images orgin material description price saleOff numberComment numberRate numberVisit avgRate status"
        )
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
      const count = await Product.countDocuments(condition);
      let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
      if ((totalPage - 1) * pageSize >= count) totalPage--;
      var condition = [];
      console.log(Date.now());
      for (var i = 0; i < products.length; i++) {
        condition.push({ productId: products[i]._id });
      }
      condition = condition.length > 0 ? { $or: condition } : {};
      const colorOptions = await ColorOption.find(condition);
      const sizeOptions = await SizeOption.find(condition);

      res.send(
        new Respones(0, {
          products,
          colorOptions,
          sizeOptions,
          pagingInfo: { totalPage, currentPage, pageSize, option },
          searchInfo,
        })
      );
      console.log(Date.now());
    } catch (error) {
      console.log(error.message);
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
);

router.get("/search/key=:key", async (req, res) => {
  let key = req.params.key;
  try {
    const products = await Product.find(
      { $text: { $search: key } },
      { score: { $meta: "textScore" } },
      { status: true }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("_id name images price saleOff")
      .limit(5);
    res.send(new Respones(0, { products }));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/admin", async (req, res) => {
  const pageSize = 20;
  let { search, category, status } = req.query;
  let currentPage = Number(req.query.page);
  let condition = {};
  try {
    if (search) condition.$text = { $search: search };
    if (category && category !== "all") condition.categoryId = category;
    if (status && status !== "all") condition.status = status;

    const products = await Product.find(condition)
      .select("_id name brandId categoryId price saleOff  status")
      .populate("brandId", "name")
      .populate("categoryId", "name")
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .sort([["date", "-1"]]);
    const count = await Product.countDocuments(condition);
    let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
    if ((totalPage - 1) * pageSize >= count) totalPage--;

    res.send(
      new Respones(0, {
        products,
        pagingInfo: { totalPage, currentPage, pageSize },
      })
    );
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

//option 0 is normal
//option 1 sort by price from low to high
//option 2 sort by price from high to low
//option 3 is bestseller
//option 4 is most prominent
router.get(
  "/searchString=:searchString&page=:page&pagesize=:pagesize&option=:option&status=:status",
  async (req, res) => {
    let pageSize = parseInt(req.params.pagesize);
    let currentPage = parseInt(req.params.page);
    const searchString = req.params.searchString;
    const option = parseInt(req.params.option);
    let sort = "_id";
    let direction = -1;
    if (option == 1) {
      sort = "price";
      direction = 1;
    } else if (option == 2) sort = "price";
    else if (option == 4) sort = "numberVisit";
    const searchPrice = parseInt(searchString);
    let minSearchPrice = 0;
    let maxSearchPrice = 9999999999;
    if (searchPrice) {
      minSearchPrice = searchPrice - 1000000;
      maxSearchPrice = searchPrice + 1000000;
    }
    let status = req.params.status;
    if (status == "all") status = null;
    else if (status == "true") status = true;
    else if (status == "false") status = false;
    try {
      const brands = await Brand.find(
        { $or: [{ name: { $regex: searchString } }] },
        { _id: 1 }
      );
      const categoryGroups = await CategoryGroup.find(
        { $or: [{ name: { $regex: searchString } }] },
        { _id: 1 }
      );
      const categories = await Category.find(
        {
          $or: [
            { _id: { $in: categoryGroups }, name: { $regex: searchString } },
          ],
        },
        { _id: 1 }
      );
      const condition = {
        $or: [
          { brandId: { $in: brands } },
          { categoryId: { $in: categories } },
          { name: { $regex: searchString } },
          { status: status },
        ],
      };
      const products = await Product.find(condition)
        .select(
          "_id name brandId categoryId images orgin material description price numberComment numberRate numberVisit avgRate status"
        )
        .populate("brandId", "name")
        .populate("categoryId", "name")
        .sort([[sort, direction]])
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
      const count = await Product.countDocuments(condition);
      let totalPage = Math.round(parseFloat(count) / pageSize + 0.5);
      if ((totalPage - 1) * pageSize >= count) totalPage--;
      res.send(
        new Respones(0, { products, pagingInfo: { totalPage, currentPage } })
      );
    } catch (error) {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
);

router.post("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = postProductValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );

  try {
    const brand = await Brand.findById(req.body.brandId);
    if (!brand) return res.send(new Respones(-1, null, "Không tìm thấy hãng"));

    const category = await Category.findById(req.body.categoryId);
    if (!category)
      return res.send(new Respones(-1, null, "Không tìm thấy loại"));

    const product = new Product({
      name: req.body.name,
      brandId: req.body.brandId,
      categoryId: req.body.categoryId,
      orgin: req.body.orgin,
      material: req.body.material,
      description: req.body.description,
      images: req.body.images,
      price: req.body.price,
      saleOff: req.body.saleOff,
      review: req.body.review,
      status: true,
    });
    const saveProduct = await product.save();
    res.send(new Respones(0, saveProduct));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId")
      .populate({ path: "categoryId", populate: { path: "categoryGroupId" } });
    if (!product)
      return res.send(new Respones(-1, null, "Không tìm thấy sản phẩm"));
    await Product.updateOne(
      { _id: req.params.id },
      { $inc: { numberVisit: 1 } }
    );

    res.send(new Respones(0, product));
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.send(new Respones(0));
    } else {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
});

router.get("/admin/:_id", async (req, res) => {
  try {
    const product = await Product.findById(req.params._id)
      .populate("categoryId")
      .populate({ path: "categoryId", populate: { path: "categoryGroupId" } });
    if (!product)
      return res.send(new Respones(-1, null, "Không tìm thấy sản phẩm"));
    await Product.updateOne(
      { _id: req.params._id },
      { $inc: { numberVisit: 1 } }
    );

    res.send(new Respones(0, product));
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.send(new Respones(0));
    } else {
      res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
    }
  }
});

router.put("/", verifyTokenSuperAdmin, async (req, res) => {
  const { error } = putProductValidation(req.body);
  if (error)
    return res.send(
      new Respones(STATUS.INPUT_DATA, null, error.details[0].message)
    );
  try {
    const brand = await Brand.findById(req.body.brandId);
    if (!brand) return res.send(new Respones(-1, null, "Không tìm thấy hãng"));

    const category = await Category.findById(req.body.categoryId);
    if (!category)
      return res.send(new Respones(-1, null, "Không tìm thấy loại"));

    await Product.updateOne(
      { _id: req.body._id },
      {
        $set: {
          name: req.body.name,
          brandId: req.body.brandId,
          categoryId: req.body.categoryId,
          orgin: req.body.orgin,
          material: req.body.material,
          description: req.body.description,
          images: req.body.images,
          price: req.body.price,
          saleOff: req.body.saleOff,
          review: req.body.review,
          status: req.body.status,
        },
      }
    );
    res.send(new Respones(0));
  } catch (error) {
    res.send(new Respones(STATUS.UNKNOWN_EEROR, null, error.message));
  }
});

module.exports = router;
