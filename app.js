const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const admin = require('./routes/admin');
const shop = require('./routes/shop');

const error = require('./controller/error');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))


app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(shop);
app.use('/admin', admin);
app.use('/',error.get404)

app.listen(3000)
