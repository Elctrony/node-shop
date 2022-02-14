const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = express.Router();
const rootDir = require('../util/path');


routes.use(bodyParser.urlencoded({ extended: false }));

const products = [];

routes.get('/add-product', (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});

routes.post('/add-product', (req, res, next) => {
    const titleData = req.body.title;
    products.push({ title: titleData });
    res.redirect('/');
})


exports.routes = routes;
exports.products = products;