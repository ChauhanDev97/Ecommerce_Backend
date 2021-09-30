var express = require('express');

var router = express.Router();

const{ requireSignin, isAuth } = require('../Controllers/auth');

const{ userById } = require('../Controllers/userRequiredSigninAuth');

const{ generateToken, processPayment } = require('../Controllers/braintree');

router.get('/braintree/getToken/:userId', requireSignin, isAuth , generateToken );

router.post('/braintree/payment/:userId', requireSignin, isAuth , processPayment );

router.param('userId', userById)


module.exports = router;