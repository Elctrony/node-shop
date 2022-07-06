const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
let _db;

const mongoConnect = callback => {
    MongoClient
        .connect('mongodb+srv://Abuelnaga:bLYqerigtc1sW5OZ@cluster0.pcqfa.mongodb.net/?retryWrites=true&w=majority')
        .then(client => {
            _db = client.db();
            callback(client)
        })
        .catch(err => console.log(err));
}

const getdb = () => {
    if (_db) {
        console.log('Database');
        return _db;
    }
    console.log('No Database');
    throw 'No Database Found';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getdb;

///bLYqerigtc1sW5OZ