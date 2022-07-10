const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
    });
}

exports.postLoign = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
        .then(user => {
          return  bcrypt.compare(password,user.password).then(doMatch=>{
            console.log(doMatch);
            console.log(user.password);
            if(doMatch){
                console.log('user is authorized');
                req.session.user = user;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }else{
                console.log('false password');
                req.flash('error','Invalid email or password')
                res.redirect('/login');
            }
            })
        })
        .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
        message = message[0];
    }else{
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Login',
        path: '/signup',
        errorMessage: message
    });
}

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirm =req.body.confirmPassword;
    console.log('singup');

   return User.findOne({ email: email }).then(user => {
        if(name===""){
            req.flash('error','Username field can not be empty')
            return res.redirect('/signup')
        }
        if (user) {
            req.flash('error','This email is already exist');
           return res.redirect('/signup')
        }
        if(password != confirm){
            req.flash('error','Confirm password does not match');
            return res.redirect('/signup')
        }
        return bcrypt.hash(password,12).then(newPass=>{
            let newUser = new User({ name: name, email: email, password: newPass, cart: { items: [],totalPrice:0 } });
            newUser.save().then(user => {
                res.redirect('/login');
            });
        })

    })
}

exports.postLogout = (req, res, next) => {
    console.log('user log out');
    req.session.destroy();
    res.redirect('/');
}