const Products = require('../model/products');


exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const product = new Products(title);
    product.save();
    res.redirect('/');
}

exports.getAllProduct = (req, res, next) => {
    Products.fetchAllProduct((products)=>{
        res.render('shop', { pageTitle: 'Shop', prods: products, path: '/' })
    })
}

