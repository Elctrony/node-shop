const express = require('express');

const shopRoutes = express.Router();

const products = require('../controller/products');

shopRoutes.get('/', products.getAllProduct)

module.exports = shopRoutes;