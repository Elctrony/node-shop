const path = require('path');
const fs = require('fs');

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

let cart = {
    product: [],
    totalPrice: 30,
}

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = {
                products: [],
                totalPrice: 0,
            }
            if (!err) {
                cart = { ...JSON.parse(fileContent) };
            }
            console.log(cart);
            const products = cart.products;
            let existingProductIndex = products.findIndex(p => p.id === id);
            let existingProduct = products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = existingProduct.qty + 1;

                cart.totalPrice = cart.totalPrice + +productPrice;
                cart.products = [...cart.products];

                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1, price: +productPrice };
                cart.totalPrice = cart.totalPrice + +productPrice;
                cart.products = [...cart.products, updatedProduct];

            }
            fs.writeFileSync(p, JSON.stringify(cart));
        })
    }
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = { ...JSON.parse(fileContent) };
            if (err) {
                cb(null)
            } else {
                cb(cart);
            }
        })
    }
    static deleteById(id) {
        fs.readFile(p, (err, fileContent) => {
            const existingCart = JSON.parse(fileContent);
            let updatedCart = { ...existingCart };
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product) return;
            updatedCart.totalPrice = updatedCart.totalPrice - product.price * product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            fs.writeFileSync(p, JSON.stringify(updatedCart));
        });
    }
}