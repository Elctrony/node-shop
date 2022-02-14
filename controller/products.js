const products = [];

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
}

exports.postAddProduct = (req, res, next) => {
    const titleData = req.body.title;
    products.push({ title: titleData });
    res.redirect('/');
}

exports.getAllProduct = (req, res, next) => {
    for (let product of products) {
        console.log(product)
    }
    res.render('shop', { pageTitle: 'Shop', prods: products, path: '/' })
}

exports.pageNotFound = (req,res,next)=>{
    res.status(404).render('404',{pageTitle: 'Page not Found'})
}