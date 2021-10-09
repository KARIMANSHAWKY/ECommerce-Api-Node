const Category = require("../models/category");
const _ = require("lodash");

async function getCategories(req, res) {
  const categories = await Category.find();

  if (!categories) {
    res.status(500).json({ success: false });
  }

  res.send(categories);
}


async function addCategory(req, res) {
  let uniqueIconName = '';
  if(req.files.icon){
     uniqueIconName = await storIconImage(req.files.icon, __dirname);
  }

  const category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: uniqueIconName
  });
  await category.save();

  res.json({ success: true, data: category });
}

async function updateCategory(req, res) {

  if(req.files.icon){
    const category = Category.findById(req.params.id);
    fs.unlink(__dirname + "/uploads/" + category.image);
    const uniqueIconName = await storeImage(req.files.icon, __dirname);
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      color: req.body.color,
      icon: uniqueIconName
    }, 
    {new: true}
  );

  if(!category){
    return res.status(200).json({ success: true, message: "Category not found" });
  }else {
    return res
      .status(404)
      .json({ success: false, data: category });
  }
}


async function getCategoryDetails(req, res) {
  const category = await Category.findById(req.params.id);
  if (category) {
    return res.status(200).json({ success: true, data: category });
  } else {
    return res
      .status(404)
      .json({ success: false, error: "Category not found" });
  }
}


async function deleteCategory(req, res) {
  await Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "Category deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, error: "Category not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
}

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  getCategoryDetails,
  updateCategory
};
