const Product = require('../models/products');
const Cart = require('../models/cart');
const User = require('../models/user');
const orders = require('../models/orders');

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getProductsbyID = (req, res, next) => {
  const id = req.params.productId;
  console.log('detail', id);
  Product.findById(id).then(product => {
    res.render('shop/product-detail', {
      product: product,
      path: '/products',
      pageTitle: product.title,
    })
  })
}

exports.getIndex = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/'
    });
  }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {

  req.user.populate('cart.items.productId').then(user => {
    console.log('count', user.cart.items);

    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: user.cart.items
    });
  })


};

exports.postCart = (req, res, next) => {
  const id = req.body.productId;

  console.log('cart', id);
  Product.findById(id).then(product => {
    const user = req.user;
    console.log(user);
    console.log('item to Cart:', product);
    return user.addToCart(product);
  }).then(result => {
    console.log('cart result',result);
    res.redirect('/');

  })
}

exports.postCreateOrder = (req, res, next) => {
  req.user.addOrder().then(result => {
    res.redirect('/orders')
  });

}

exports.postDeleteCartItem = (req, res, next) => {
  const id = req.body.productId;
  console.log('delete IDDDD', id);
  req.user.deleteCartItem(id).then(result => {
    res.redirect('/cart');
  });
}

exports.postChangeCartItem = (req, res, next) => {
  const id = req.body.productId;
  console.log('operation',id);
  const increament = req.body.increment;
  if (increament == 'true') {
    console.log('increament')

    req.user.increamentCartItem(id).then(result => {
      res.redirect('/cart');
    });

  } else {

    console.log('decreament')
    req.user.decreamentCartItem(id).then(result => {
      res.redirect('/cart');
    });

  }
}


exports.getOrders = (req, res, next) => {
orders.find({userId:req.user._id}).populate('items.productId').populate('userId').then(orders => {
      console.log('datass',orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    
  });

};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
