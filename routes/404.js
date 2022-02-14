const express = require('express');

const app = express.Router();

const page = require('../controller/error');

app.use('/',page.get404)

module.exports = app;