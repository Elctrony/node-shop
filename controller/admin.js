const Product = require('../models/products');

const mongoose = require('mongoose');

const { validationResult } = require('express-validator');

const ITEM_PER_PAGE = 3;

const fs = require('fs');


exports.getAddProduct = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    editing: false,
    hasError: false,
    errorMessage: message,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const title = req.body.title;
  const user = req.user;

  console.log('Errrrrrrrrrrrrrrrrrrrr');
  console.log(image);
  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: false,
      hasError: true,
      product: { title: title, price: price, description: description },
      errorMessage: 'Attached file is not an image',
      validationErrors: errors.array()
    });
  }
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: false,
      hasError: true,
      product: { title: title, price: price, description: description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const imageUrl = image.path;
  const product = new Product({ title: title, imageUrl: imageUrl, description: description, price: price, userId: user });
  product.save().then(result => {
    res.redirect('/');
  }).catch(err => {
    console.log('errorrrrr')
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productId;
  const editing = req.query.edit;
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  console.log(id);
  console.log(editing);
  if (!editing) {
    console.log('data');
    res.redirect('/');
  }
  Product.findById(id).then(product => {
    console.log('DATA', product);
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      product: product,
      editing: true,
      hasError: false,
      errorMessage: message,
      validationErrors: [],
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.productId;
  const updateImage = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;
  const updatedTitle = req.body.title;
  const errors = validationResult(req);

  if (!updateImage) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: true,
      hasError: true,
      product: { title: title, price: price, description: description },
      errorMessage: 'Attached file is not an image',
      validationErrors: errors.array()
    });
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true,
      editing: true,
      hasError: true,
      product: { title: updatedTitle, price: updatedPrice, description: updatedDescription, _id: id },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  Product.findOne({ _id: id, userId: req.user._id }).then(product => {
    if (!product) {
      console.log('not authorized ID');
      return res.redirect('/')
    }
    if (updateImage) {
          product.imageUrl = updateImage.path;
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDescription;
    console.log('UPDATED DATA:', product);
    product.save().then(result => {
      res.redirect('/');
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  });
}

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  console.log('idd', id);
  Product.findById(id).then(product => {
    if (!product) {
      return next(new Error('Product not found'));
    }
    Product.deleteOne({ _id: id, userId: req.user._id }).then(result => {
      res.status(200).json({message:'Success!'})
    }).catch(err => {
      res.status(500).json({message:'Deleting product Failed!'})

    });;
  })


}

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  console.log('loading....')
  Product.find({ userId: req.user._id }).countDocuments().then(numProucts => {
    totalItems = numProucts;
    console.log(numProucts)
    return Product.find({ userId: req.user._id }).skip((page - 1) * ITEM_PER_PAGE).limit(ITEM_PER_PAGE);
  })
    .then(products => {
      console.log(page);
      console.log(totalItems);
      console.log(Math.ceil(totalItems / ITEM_PER_PAGE))
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        totalProduct: totalItems,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        currentPage: page,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
      });
    })
};
