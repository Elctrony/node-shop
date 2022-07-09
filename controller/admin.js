const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
   var isAuth = req.session.isAuthenticated;
    console.log('session',isAuth);
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing:false,
    isAuthenticated: isAuth, 
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const title = req.body.title;
  const user = req.session.user;
  const product = new Product({ title: title, imageUrl: imageUrl, description: description, price: price ,userId:user});
  product.save().then(result=>{
    res.redirect('/');
  });
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
  Product.findById(id).then(product => {
    console.log('DATA', product);
    var isAuth = req.session.isAuthenticated;
    console.log('session',isAuth);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: product,
      description: product.description,
      editing: true,
      isAuthenticated: isAuth, 

    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedTitle = req.body.title;
  Product.findById(id).then(product=>{
    product.title=updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.description = updatedDescription;
    console.log('UPDATED DATA:', product);
    product.save().then(result=>{

      res.redirect('/');
    });
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productId;
  console.log('idd', id);
  Product.findByIdAndRemove(id).then(result=>{

    res.redirect('/');
  });

}

exports.getProducts = (req, res, next) => {
  console.log('loading....')
  Product.find().populate('userId').then(products => {
    console.log('admdddd', products);
    var isAuth = req.session.isAuthenticated;
    console.log('session',isAuth);
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated: isAuth, 

    });
  });
};
