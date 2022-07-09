const express = require('express');
const session = require('express-session')

const bodyParser = require('body-parser');
const path = require('path')

const mongoose = require('mongoose');

const MongoDBstore = require('connect-mongodb-session')(session);

const mongoDatabase = require('./util/database').mongoConnect;

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const auth = require('./routes/auth');

const error = require('./controller/error');

const app = express();

const MONGODBURI = 'mongodb+srv://Abuelnaga:bLYqerigtc1sW5OZ@cluster0.pcqfa.mongodb.net/shop';

const store = new MongoDBstore({
    uri: MONGODBURI,
    collection: 'sessions'
})

const User = require('./models/user');
const { mongoConnect } = require('./util/database');
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
}))


app.set('view engine', 'ejs');
app.set('views', 'views');



app.use('/mcu', (req, res, next) => {
    console.log(req);
    res.statusCode = 202;
    res.send('HELLLO');
    next();
})


app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    }
    User.findById(req.session.user._id).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));

})


app.use(shop);
app.use(auth);
app.use('/admin', admin);
app.use('/', error.get404)



mongoose.connect(MONGODBURI).then(client => {
    console.log('Database succssed')
    User.findOne().then(user => {
        if (!user) {
            console.log('createUser');
            const user = new User({
                name: 'Ahmed',
                email: 'Ahmed@gmail.com',
                cart: { items: [], totalPrice: 0 }
            });
            user.save();
        }
    })
    app.listen(3000);
})

