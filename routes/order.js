const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/async");
const {
  getOrders,
  addOrder,
  getOrderDetails,
  updateOrder,
  deleteOrder,
  totalSales,
  getOrdersCount,
} = require("../controllers/order");

router.get("/", asyncMiddleware(getOrders));
router.post("/", asyncMiddleware(addOrder));
router.get("/:id", asyncMiddleware(getOrderDetails));
router.put("/:id", asyncMiddleware(updateOrder));
router.delete("/:id", asyncMiddleware(deleteOrder));
router.get("/total-sales", asyncMiddleware(totalSales));
router.get("/count-sales", asyncMiddleware(getOrdersCount));

module.exports = router;
