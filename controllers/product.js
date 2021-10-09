const Product = require("../models/product");
const _ = require("lodash");
const mongoose = require("mongoose");
const storeImage = require("../services/store-image");
const fs = require("fs");

// get products
async function getProducts(req, res) {
  const products = await Product.find().populate("category");

  if (!products) {
    res.status(500).json({ success: false });
  }

  res.send(products);
}

// add new product
async function addProduct(req, res) {
  // check if category is existing
  const category = Category.findById(req.body.category);
  if (!category)
    return res
      .status(404)
      .json({ success: false, message: "Category Invalid" });

  if (req.files.image) {
    let uniqueImageName = await storeImage(req.files.image, __dirname);
  }

  const product = new Product({
    name: req.body.name,
    image: uniqueImageName,
    countInStock: req.body.countInStock,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    numberOfReviews: req.body.numberOfReviews,
    isFeatured: req.body.isFeatured,
    dateCreated: req.body.dateCreated,
  });
  await product.save();

  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });

  return res.status(200).json({ success: true, data: product });
}

// Get a product details
async function getProductDetails(req, res) {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product)
    return res.status(500).json({ success: false, error: "Product Not Found" });

  return res.status(200).json({ success: true, data: product });
}

// update a product
async function updateProduct(req, res) {
  // check if id is valid
  if (!mongoose.isValidObjectId(req, params.id))
    return res.status(400).json({ message: "Id is invalid" });

  // check if category is existing
  const category = Category.findById(req.body.category);
  if (!category)
    return res
      .status(404)
      .json({ success: false, message: "Category Invalid" });

  if (req.files.image) {
    const product = Product.findById(req.params.id);
    fs.unlink(__dirname + "/uploads/" + product.image);
    const uniqueImageName = await storeImage(req.files.image, __dirname);
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      image: uniqueImageName,
      countInStock: req.body.countInStock,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      rating: req.body.rating,
      numberOfReviews: req.body.numberOfReviews,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    },
    { new: true }
  );

  if (!product) {
    return res
      .status(200)
      .json({ success: true, message: "product not found" });
  } else {
    return res.status(404).json({ success: false, data: product });
  }
}

// delete product
async function deleteProduct(req, res) {
  await Product.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "Product deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, error: "Product not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
}

// Get products count
async function getProductsCount(req, res) {
  const productsCount = await Product.countDocuments((count) => count);

  if (!productsCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    productsCount: productsCount,
  });
}

// Get products count
async function getProductsFeatured(req, res) {
  const productsFeatured = await Product.find({ isFeatured: true });

  if (!productsFeatured) {
    res.status(500).json({ success: false });
  }

  res.send({
    productsFeatured: productsFeatured,
  });
}

// filter products
async function filterProductsByCategory(req, res) {
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const products = Product.find(filter).populate("category");
  if (!products) return res.status(500).json({ success: false });

  return res.status(200).json({ success: true, data: products });
}

module.exports = {
  getProducts,
  addProduct,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getProductsCount,
  getProductsFeatured,
  filterProductsByCategory,
};
