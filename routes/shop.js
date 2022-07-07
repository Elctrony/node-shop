const express = require('express');

const router = express.Router();

const shopController = require('../controller/shop');
const { route } = require('./admin');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductsbyID);

router.get('/cart', shopController.getCart);

router.post('/cart',shopController.postCart);

router.post('/cart-delete-item',shopController.postDeleteCartItem);
router.post('/cart-change-item',shopController.postChangeCartItem);

router.post('/create-order',shopController.postCreateOrder);


router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;