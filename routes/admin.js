const express = require('express');
const bodyParser = require('body-parser');


const adminController = require('../controller/admin');
const router = express.Router();
const isAuth = require('../middleware/isAuth');



// /admin/add-product => GET
router.get('/add-product',isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddProduct);

// /admin/add-product => POST
router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/edit-product/',isAuth,adminController.postEditProduct);

// /delete-product
router.post('/delete-product',isAuth,adminController.postDeleteProduct);

module.exports = router;
