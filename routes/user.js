const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middlewares/async');
const {getUsers, register, getUserDerails, login} = require('../controllers/user');


router.get('/', asyncMiddleware(getUsers));
router.post('/register', asyncMiddleware(register));
router.get('/:id', asyncMiddleware(getUserDerails));
router.post('/login', asyncMiddleware(login));




module.exports = router;