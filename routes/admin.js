const express = require('express');
const bodyParser = require('body-parser');

const { check } = require('express-validator')


const adminController = require('../controller/admin');
const router = express.Router();
const isAuth = require('../middleware/isAuth');



// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, [
    check('title').isString().isLength({ min: 3 }).withMessage('Title can\'t be Empty'),
    check('price').isFloat().withMessage('Price can\'t be Empty'),
    check('description').isLength({ min: 6, max: 400 }).withMessage('Description can\'t be less than 6 charcter')
], adminController.postAddProduct);

// /admin/add-product => POST
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product/', isAuth,[
    check('title').isString().isLength({ min: 3 }).withMessage('Title can\'t be Empty'),
    check('price').isFloat().withMessage('Price can\'t be Empty'),
    check('description').isLength({ min: 6, max: 400 }).withMessage('Description can\'t be less than 6 charcter')
], adminController.postEditProduct);

// /delete-product
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
