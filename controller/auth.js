const crypto = require('crypto');

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: 'c8313dd677a1893a78477cbfd7f1eec6-1b8ced53-7d09d73c',
});




exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
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
    User.findOne({ email: email })
        .then(user => {
            return bcrypt.compare(password, user.password).then(doMatch => {
                console.log(doMatch);
                console.log(user.password);
                if (doMatch) {
                    console.log('user is authorized');
                    req.session.user = user;
                    req.session.isAuthenticated = true;
                    req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    });
                } else {
                    console.log('false password');
                    req.flash('error', 'Invalid email or password')
                    res.redirect('/login');
                }
            })
        })
        .catch(err => console.log(err));
}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message
    });
}

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirmPassword;
    console.log('singup');

    return User.findOne({ email: email }).then(user => {
        if (name === "") {
            req.flash('error', 'Username field can not be empty')
            return res.redirect('/signup')
        }
        if (user) {
            req.flash('error', 'This email is already exist');
            return res.redirect('/signup')
        }
        if (password != confirm) {
            req.flash('error', 'Confirm password does not match');
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12).then(newPass => {
            let newUser = new User({ name: name, email: email, password: newPass, cart: { items: [], totalPrice: 0 } });
            mg.messages
                .create('sandbox231514ce8c954fd1a2c9ecb70bed7e93.mailgun.org', {
                    from: "Mailgun Sandbox <postmaster@sandbox231514ce8c954fd1a2c9ecb70bed7e93.mailgun.org>",
                    to: [email],
                    subject: "Hello",
                    text: "Welcome to E shop application",
                })
                .then(msg => console.log(msg))
                .catch(err => console.log(err));
            return newUser.save().then(user => {
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


exports.getRest = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message
    });
}

exports.postRest = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            res.redirect('/reset');
        }
        const token = buffer.toString('hex')
        return User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                console.log('no user found');
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 360000;
            return user.save().then(result => {
                res.redirect('/');
                mg.messages
                    .create('sandbox231514ce8c954fd1a2c9ecb70bed7e93.mailgun.org', {
                        from: "shop@node.com",
                        to: [req.body.email],
                        subject: "Reset password",
                        html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new passowrd.</p>
                    `,
                    })
                    .then(msg => console.log(msg))
                    .catch(err => console.log(err));
            });

        });
    });
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } }).then(user => {
        if (!user) {
            return res.redirect('/reset')
        }
        let message = req.flash('error');
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-pass', {
            pageTitle: 'Update Password',
            path: '/new-password',
            errorMessage: message,
            userId: user._id.toString(),
            passToken: token,
        });
    }).catch(err => console.log(err))
}

exports.postNewPassword = (req,res,next)=>{
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const resetToken = req.body.passToken;
    return User.findOne({_id: userId, resetToken: resetToken, resetTokenExpiration: { $gt: Date.now() } }).then(user=>{
         bcrypt.hash(newPassword, 12).then(hashedPassword=>{
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined; 
             user.save().then(result=>{
                res.redirect('/login');
             });
        })
    });
}