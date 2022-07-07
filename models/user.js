const mongo = require('mongodb');
const Product = require('./products');
const getdb = require('../util/database').getDb;


class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this.id = id
    }

    save() {
        const db = getdb();
        return db.collection('users').insertOne(this).then(result => {
            console.log('user', result);
            return result;
        }).catch(err => console.log(err));
    }

    addToCart(product) {
        let updatedCart = {};
        if (this.cart) {
            const items = this.cart.items;
            console.log('item', product);
            const productIndex = items.findIndex(p => p.productId.toString() === product._id.toString());
            console.log('index:', productIndex);

            const existingProduct = items[productIndex];
            if (productIndex >= 0) {
                items[productIndex].quantity = existingProduct.quantity + 1;
                updatedCart = {
                    items: [...items],
                    totalPrice: +this.cart.totalPrice + +product.price
                }
            } else {
                updatedCart = {
                    items: [...this.cart.items, { productId: mongo.ObjectId(product._id), quantity: 1 }],
                    totalPrice: +this.cart.totalPrice + +product.price
                }
            }
        } else {
            updatedCart = { items: [{ productId: mongo.ObjectId(product._id), quantity: 1 }], totalPrice: +product.price };
        }
        const db = getdb();
        return db.collection('users')
            .updateOne(
                { _id: mongo.ObjectId(this.id) },
                { $set: { cart: updatedCart } });
    }


    getCart() {
        const db = getdb();
        let productIds = this.cart.items.map(item => item.productId);
        console.log(productIds);
        return db.collection('products').find({ _id: { $in: productIds } })
            .toArray().then(products => {
                products = products.map(item => {
                    const quantity = this.cart.items.find(p => item._id.toString() === p.productId.toString()).quantity;
                    console.log(quantity);
                    item.quantity = quantity;
                    return item;
                });
                console.log('updated', products);
                return products
            }).catch(err => console.log(err));
    }

    deleteCartItem(id) {
        const db = getdb();
        return Product.fetctProductbyId(id).then(product => {
            let existingProduct = this.cart.items.find(p => p.productId.toString() === id.toString())
            this.cart.totalPrice = +this.cart.totalPrice - +product.price * existingProduct.quantity;
            this.cart.items = this.cart.items.filter(p => p.productId.toString() !== id.toString());
            console.log(this.cart);
            return db.collection('users').updateOne({ _id: mongo.ObjectId(this.id) }, {
                $set: {
                    cart: this.cart
                }
            })
        })
    }

    decreamentCartItem(id) {
        const db = getdb();
        return Product.fetctProductbyId(id).then(product => {
            let existingProductIndex = this.cart.items.findIndex(p => p.productId.toString() === id.toString())
            let existingProduct = this.cart.items[existingProductIndex];
            this.cart.totalPrice = +this.cart.totalPrice - +product.price;
            if (existingProduct.quantity > 1) {
                this.cart.items[existingProductIndex].quantity = this.cart.items[existingProductIndex].quantity - 1
            } else {
                this.cart.items = this.cart.items.filter(p => p.productId.toString() !== id.toString());
            }
            console.log(this.cart);
            return db.collection('users').updateOne({ _id: mongo.ObjectId(this.id) }, {
                $set: {
                    cart: this.cart
                }
            })
        })
    }
    increamentCartItem(id) {
        const db = getdb();
        return Product.fetctProductbyId(id).then(product => {
            let existingProductIndex = this.cart.items.findIndex(p => p.productId.toString() === id.toString())
            let existingProduct = this.cart.items[existingProductIndex];
            this.cart.totalPrice = +this.cart.totalPrice + +product.price;
            this.cart.items[existingProductIndex].quantity = this.cart.items[existingProductIndex].quantity + 1

            console.log(this.cart);
            return db.collection('users').updateOne({ _id: mongo.ObjectId(this.id) }, {
                $set: {
                    cart: this.cart
                }
            })
        })
    }
    addOrder() {
        const db = getdb();
        return this.getCart().then(products => {
            return db.collection('orders').insertOne({
                totalPrice: this.cart.totalPrice, items: products,
                user: { _id: mongo.ObjectId(this.id), name: this.name }
            })
                .then(result => {
                    const cart = { items: [], totalPrice: 0 };
                    this.cart = cart;
                    console.log('oders', result);
                    return db.collection('users').updateOne({ _id: mongo.ObjectId(this.id) }, {
                        $set: {
                            cart: cart
                        }
                    })
                });
        })

    }

    getOrders() {
        const db = getdb();
        return db.collection('orders').find({ 'user._id': new mongo.ObjectId(this.id) }).toArray().then(orders => {
            console.log('orders:', orders);
            return orders;
        }).catch(err => console.log(err));
    }


    static fetchAll() {
        const db = getdb();
        return db.collection('users').find({}).toArray().then(users => {
            console.log('users:', users);
            return users;
        })
            .catch(err => console.log(err));
    }



    static findById(id) {
        const db = getdb();
        return db.collection('users').find({ _id: mongo.ObjectId(id) }).toArray().then(users => {


            return users[0];
        })
            .catch(err => console.log(err));
    }
}

module.exports = User;