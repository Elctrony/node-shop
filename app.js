const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const admin = require('./routes/admin').routes;
const shop = require('./routes/shop');
const error = require('./routes/404');

const app = express();
app.use(express.static(path.join(__dirname, 'public')))


app.set('view engine', 'ejs');
app.set('views', 'views');



app.use(shop);
app.use('/admin', admin);
app.use(error);

app.listen(3000)
