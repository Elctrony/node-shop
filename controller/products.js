const Product = require('../model/products');

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
}

exports.postAddProduct = (req, res, next) => {
    const titleData = req.body.title;
    const product = new Product(titleData);
    product.save();
    res.redirect('/');
}

exports.getAllProduct = (req, res, next) => {
    Product.fetchAllProducts((products)=>{
        res.render('shop', { pageTitle: 'Shop', prods: products, path: '/' })
    })
   
}

exports.pageNotFound = (req,res,next)=>{
    res.status(404).render('404',{pageTitle: 'Page not Found'})
}