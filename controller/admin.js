const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const title = req.body.title;
  console.log(req.user._id);
  const product = new Product(title, imageUrl, description, price,null,req.user._id);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  const editing = req.query.edit;
  console.log(id);
  console.log(editing);
  if (!editing) {
    console.log('data');
    res.redirect('/');
  }
  Product.fetctProductbyId(id).then(product => {
    console.log('DATA',product);

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: product[0],
      description: product.description,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const title = req.body.title;
  const product = new Product(title, imageUrl, description, +price,id);
  console.log('UPDATED DATA:',product);
  product.save();
  res.redirect('/');
}

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  console.log('idd',id);
  Product.deleteById(id);
  res.redirect('/');

}

exports.getProducts = (req, res, next) => {
  console.log('loading....')
  Product.fetchAllProducts().then(products => {
    console.log('admdddd',products);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
