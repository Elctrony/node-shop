const express = require('express');

const router = express.Router();

const auth = require('../controller/auth');

router.get('/login',auth.getLogin);
router.post('/login',auth.postLoign);

router.get('/signup',auth.getSignup);
router.post('/signup',auth.postSignup)

router.post('/logout',auth.postLogout);

router.get('/reset',auth.getRest);
router.post('/reset',auth.postRest);

router.get('/reset/:token',auth.getNewPassword);
router.post('/new-password',auth.postNewPassword)


module.exports = router;