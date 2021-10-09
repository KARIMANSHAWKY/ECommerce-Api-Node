const Order = require("../models/order");
const _ = require("lodash");
const OrderItem = require("../models/order-item");

// get orders
async function getOrders(req, res) {
  const orders = await Order.find()
    .populate("user", "name")
    .sort("dateOrdered");

  if (!orders) {
    res.status(500).json({ success: false });
  }

  res.send(orders);
}

// add new order
async function addOrder(req, res) {
  const orderItemsId = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );

  const orderItemsIdResolved = await orderItemsId;
  const totalPrices = Promise.all(
    orderItemsIdResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = (await totalPrices).reduce((a, b) => a + b, 0);

  const order = new Order({
    orderItems: orderItemsIdResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    phone: req.body.phone,
    zip: req.body.zip,
    country: req.body.country,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) {
    return res.status(400).send("order can not be created");
  }
  res.json({ success: true, data: order });
}

// get an order details
async function getOrderDetails(req, res) {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }

  res.send(order);
}

// update order status
async function updateOrder(req, res) {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, ["status"]),
    { new: true }
  );

  if (!order) {
    return res.status(200).json({ success: true, message: "order not found" });
  } else {
    return res.status(404).json({ success: false, data: order });
  }
}

//   delete order
function deleteOrder(req, res) {
  Category.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });

        return res
          .status(200)
          .json({ success: true, message: "Order deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, error: "Order not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
}

// total sales
async function totalSales(req, res) {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, $totalSales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res
      .status(400)
      .json({ success: false, error: "totalSales can not be generated" });
  }

  res.send({ totalSales: totalSales.pop().totalSales });
}

// total count of orders
async function getOrdersCount(req, res) {
  const ordersCount = await Order.countDocuments((count) => count);

  if (!ordersCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    ordersCount: ordersCount,
  });
}

// get orders
async function getUserOrders(req, res) {
  const userOrders = await User.find(req.params.userId).populate({
    path: "orderItems",
    populate: { path: "product", populate: "category" },
  });

  if (!userOrders) {
    res.status(500).json({ success: false });
  }

  res.send(userOrders);
}

module.exports = {
  getOrders,
  addOrder,
  getOrderDetails,
  updateOrder,
  deleteOrder,
  totalSales,
  getOrdersCount,
  getUserOrders,
};
