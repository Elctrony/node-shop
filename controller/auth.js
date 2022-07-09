const User = require('../models/user');

exports.getLogin = (req,res,next)=>{
    var isAuth = req.session.isAuthenticated;
    console.log('session',isAuth);
    res.render('auth/login',{
        pageTitle:'Login',
        path:'/login',
        isAuthenticated:isAuth, 
    });
}

exports.postLoign = (req,res,next)=>{
    User.findById('62c72531d464c017315befce')
    .then(user => {
      req.session.isAuthenticated = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req,res,next)=>{
    console.log('user log out');
     req.session.destroy();
        res.redirect('/');
}