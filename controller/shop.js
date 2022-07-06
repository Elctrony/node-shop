const Product = require('../models/products');
const Cart = require('../models/cart');
const User = require('../models/user');

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getProductsbyID = (req, res, next) => {
  const id = req.params.productId;
  console.log('detail',id);
  Product.fetctProductbyId(id).then(product => {
    res.render('shop/product-detail', {
      product: product,
      path: '/products',
      pageTitle: product.title,
    })
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAllProducts().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/'
    });
  }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {

  req.user.getCart().then(cartProducts=>{
    console.log('count', cartProducts);
   
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts
    });
  })
     
   
};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;

  console.log('cart',id);
  Product.fetctProductbyId(id).then(product=>{
    const user = req.user;
    console.log(user._id);
    console.log('item to Cart:',product);
    user.addToCart(product);
  })
  res.redirect('/cart');
}

exports.postDeleteCartItem = (req, res, next) => {
  const id = req.body.id;
  console.log('delete IDDDD', id);
  Cart.deleteById(id);
  res.redirect('/cart');
}


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
