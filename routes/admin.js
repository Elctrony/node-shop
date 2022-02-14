const express = require('express');
const bodyParser = require('body-parser');

const routes = express.Router();

const products = require('../controller/products');

routes.use(bodyParser.urlencoded({ extended: false }));


routes.get('/add-product', products.getAddProduct);

routes.post('/add-product', products.postAddProduct)


exports.routes = routes;
