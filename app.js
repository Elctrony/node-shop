const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const mongoose = require('mongoose');

const mongoDatabase = require('./util/database').mongoConnect;

const admin = require('./routes/admin');
const shop = require('./routes/shop');

const error = require('./controller/error');

const app = express();

const User = require('./models/user');
const { mongoConnect } = require('./util/database');
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false }))


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/mcu', (req, res, next) => {
    console.log(req);
    res.statusCode = 202;

    res.send('HELLLO');
    next();
})
app.use((req, res, next) => {

    User.findById('62c70672cbf80114b2743485')
    .then((user) => {
        console.log('user ID:', user._id);
        console.log('user Name:', user.name);
        console.log('user email:', user.email);
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    })
})


app.use(shop);
app.use('/admin', admin);
app.use('/', error.get404)



mongoose.connect('mongodb+srv://Abuelnaga:bLYqerigtc1sW5OZ@cluster0.pcqfa.mongodb.net/shop?retryWrites=true&w=majority').then(client => {
    console.log('Database succssed')
    app.listen(3000);
})

