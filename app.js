const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const mongoDatabase = require('./util/database').mongoConnect;

const admin = require('./routes/admin');
const shop = require('./routes/shop');

const error = require('./controller/error');

const app = express();

const User = require('./models/user');
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
    User.findById('62c4898d38ef387b6a2ebed6').then((user) => { 
        console.log('user new ID:',user._id);
        req.user =new User(user.name,user.email,user.cart,user._id);
        next();
    }).catch(err => {
        console.log(err);
    })
})

app.use(shop);
app.use('/admin', admin);
app.use('/', error.get404)


mongoDatabase(client => {
    app.listen(3000)
})

