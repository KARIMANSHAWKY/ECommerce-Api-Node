const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const {getCategories, addCategory, deleteCategory,updateCategory , getCategoryDetails} = require('../controllers/category');


router.get('/', asyncMiddleware(getCategories));
router.post('/', asyncMiddleware(addCategory));
router.delete('/:id', asyncMiddleware(deleteCategory));
router.get('/:id', asyncMiddleware(getCategoryDetails));
router.put('/:id', asyncMiddleware(updateCategory));






module.exports = router;