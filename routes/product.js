const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/async");
const {
  getProducts,
  addProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getProductsCount,
  filterProductsByCategory
} = require("../controllers/product");

router.get("/", asyncMiddleware(getProducts));
router.post("/", asyncMiddleware(addProduct));
router.post("/:id", asyncMiddleware(getProductDetails));
router.put("/:id", asyncMiddleware(updateProduct));
router.delete("/:id", asyncMiddleware(deleteProduct));
router.get("/count", asyncMiddleware(getProductsCount));
router.get("/filter", asyncMiddleware(filterProductsByCategory));


module.exports = router;
