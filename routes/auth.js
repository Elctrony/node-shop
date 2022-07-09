const express = require('express');

const router = express.Router();

const auth = require('../controller/auth');

router.get('/login',auth.getLogin);
router.post('/login',auth.postLoign);

router.post('/logout',auth.postLogout);


module.exports = router;