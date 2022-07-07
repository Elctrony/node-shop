const mongo = require('mongodb');

const getDb = require('../util/database').getDb;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true, },
    price: { type: Number, required: true }
});


module.exports = mongoose.model('Product', ProductSchema, 'products');


//module.exports = class Product {
//constructor(title, imageUrl, description, price, id, userId) {
//        this.title = title;
//        this.imageUrl = imageUrl;
//        this.description = description;
//        this.price = price;
//        this._id = id;
//        this.userID = userId;
//    }
//
//    save() {
//        const db = getDb();
//        if (this._id) {
//            console.log('UPDATE PRODUCT', this._id);
//            console.log(this.price);
//            console.log(mongo.ObjectId(this._id));
//            return db.collection('products').updateOne({ _id: mongo.ObjectId(this._id) }, {
//                $set: {
//                    title: this.title,
//                    imageUrl: this.imageUrl,
//                    description: this.description,
//                    price: this.price,
//                }
//            })
//                .then(res => {
//                    console.log('sucess', res);
//                    return res;
//                }).catch(err => console.log('err', err));;
//        } else {
//            console.log('SAVE PRODUCT');
//
//            return db.collection('products').insertOne(this)
//                .then(res => { return res })
//                .catch(err => console.log(err));
//
//        }
//
//    }
//
//    static deleteById(id) {
//        const db = getDb();
//        console.log('db delete');
//        return db.collection('products').deleteOne({ _id: mongo.ObjectId(id) }).then(res => console.log(res)).catch(err => console.log(err));
//    }
//
//    static fetchAllProducts() {
//        const db = getDb();
//        return db
//            .collection('products')
//            .find().toArray()
//            .then(products => {
//                console.log(products);
//                return products;
//            })
//            .catch(err => console.log(err));
//    }
//
//    static fetctProductbyId(id) {
//        const db = getDb();
//        console.log('porduct:', id);
//        return db
//            .collection('products')
//            .find({ _id: mongo.ObjectId(id) }).toArray()
//            .then(products => {
//                console.log(products);
//                return products[0];
//            })
//            .catch(err => console.log(err));
//    }
//}