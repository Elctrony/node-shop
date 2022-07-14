const express = require('express');

const router = express.Router();

const shopController = require('../controller/shop');
const { route } = require('./admin');
const isAuth = require('../middleware/isAuth');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductsbyID);

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart',isAuth,shopController.postCart);

router.post('/cart-delete-item',isAuth,shopController.postDeleteCartItem);
router.post('/cart-change-item',isAuth,shopController.postChangeCartItem);

router.post('/create-order',isAuth,shopController.postCreateOrder);


router.get('/orders',isAuth, shopController.getOrders);


router.get('/orders/:orderId',isAuth,shopController.getInovice)

module.exports = router;