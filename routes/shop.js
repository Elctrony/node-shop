const express = require('express');
const path = require('path');

const rootDir = require('../util/path');

const shopRoutes = express.Router();
const products = require('./admin').products;


shopRoutes.get('/', (req, res, next) => {
    for (let product of products) {
        console.log(product)
    }
    res.render('shop', { pageTitle: 'Shop', prods: products, path: '/' })
})

module.exports = shopRoutes;