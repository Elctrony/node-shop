const express = require('express');
const path = require('path')
const rootDir = require('../util/path');


const app = express.Router();

app.use('/',(req,res,next)=>{
    res.status(404).render('404',{pageTitle: 'Page not Found'})
})

module.exports = app;