const express = require('express');

const { check, body } = require('express-validator')

const router = express.Router();

const bcrypt = require('bcryptjs');

const auth = require('../controller/auth');
const User = require('../models/user');

router.get('/login', auth.getLogin);
router.post('/login',[check('email').custom((value,{req})=>{
    return User.findOne({email:value}).then(user=>{
        if(!user){
            return Promise.reject('E-mail does not exist, Signup to login')
        }
    })
}),check('password').custom((value,{req})=>{
    return User.findOne({email:req.body.email}).then(user=>{
        console.log()
        return bcrypt.compare(value, user.password).then(doMatch => {
            console.log(doMatch);
            console.log(user.password);
            if (!doMatch){
               return Promise.reject('Password is Invalid')
            }
        })
    })
})], auth.postLoign);



router.get('/signup', auth.getSignup);
router.post('/signup', [
    check('name').isLength({min:1}).withMessage('Username field can not be empty'),
    check('email').isEmail().withMessage('Please eneter a valid email.').custom((value,{req})=>{
       return User.findOne({email:value}).then(user=>{
            if(user){
                return Promise.reject('E-mail exists already, please pick a different one.')
            }
        })
    }),
    body('password', 'Password must be at least 6 character').isLength({ min: 6 }).isAlphanumeric(),
    body('confirmPassword').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Passwords have to match');
        }
        return true;
    })
],
    auth.postSignup)

router.post('/logout', auth.postLogout);

router.get('/reset', auth.getRest);
router.post('/reset', auth.postRest);

router.get('/reset/:token', auth.getNewPassword);
router.post('/new-password', auth.postNewPassword)


module.exports = router;