var express = require('express');

require('dotenv').config()

var router = express.Router();

const mongoose = require('mongoose');

const userModel = require('./users');

const {errorHandler} = require('../Helpers/dbErrorHandler')

const {body, validationResult} = require('express-validator');

const jwt  = require('jsonwebtoken'); // to generate signed token

const expressJwt  = require('express-jwt'); // for authorization check

const {create, categoryById, categoryRead, categoryUpdate, categoryRemove, list} = require('../Controllers/category');

const {productCreate, productById, read, remove, update, productlist, listRelated, listCategories, listBySearch, photo, listSearch } = require('../Controllers/product');

const{ requireSignin, isAuth, isAdmin } = require('../Controllers/auth');

const{ userById, readUser, updateUser } = require('../Controllers/userRequiredSigninAuth');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message : 'hey there'})
});

router.get('/user/:userId', requireSignin, isAuth, readUser);

router.put('/user/:userId', requireSignin, isAuth, updateUser)

router.post('/signup', 
  
  body('name', 'Name is required')
    .notEmpty(),
    
  body('email', 'Email must be between 4 to 32 char')
    .trim()
    .isLength({
      min:4,
      max : 32
    })
    .matches(/.+\@.+\..+/)
    .withMessage('Please enter a valid email'),

  body('password') 
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 charaters')
    .matches(/\d/)
    .withMessage('Password must contain a number')

, async(req, res) => {

  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.send(errors.array())
  }
  // console.log('req.body', req.body);
  const user = new userModel(req.body);
  user.save((err, user) =>{
    if(err) {
      return res.status(400).json({
        err : errorHandler(err)
      })
    } 
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    })
  });
  // res.status(200).json({user});
});

router.post('/signin', function(req, res){
  
  // find the user based on email
  const {email,password} = req.body

  userModel.findOne({email}, (err, user) => {
  
    if(err || !user){
      
      return res.status(400).json({
      
        error : 'User with that email does not exist. Please signup'
      
      })
    }

    // if user is found maken sure email and password match

    //create authenticate in Usermodel

    if(!user.authenticate(password)){
      return res.status(401).json({
        error: 'Email and password donot match'
      })
    }

    //generate a signed token with user id and secret

    const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET)

    //persist the token as 't' in cookie with expiry date

    res.cookie('t', token, { expire: new Date() + 9999})

    //return response with user and token to frontend client

    const { _id, name, email, role } = user

    return res.json({token, user:{ _id, name, email, role} })
 
   })
});

router.get('/signout', function(req, res){
  res.clearCookie('t')
  res.json({ message : 'Signout successfully'})
});

router.get('/category/:categoryId', categoryRead) // Read Category 

router.post('/category/create/:userId', requireSignin, isAdmin , isAuth, create); // Create Category

router.put('/category/:categoryId/:userId', requireSignin, isAdmin , isAuth, categoryUpdate); // Update Category

router.delete('/category/:categoryId/:userId', requireSignin, isAdmin , isAuth, categoryRemove); // Delete Category

router.get('/categories', list) // See total Categories

router.get('/product/:productId', read) // Read Product

router.post('/product/create/:userId', requireSignin, isAdmin , isAuth, productCreate); // Create Product

router.delete('/product/:productId/:userId', requireSignin, isAdmin , isAuth, remove ); // Delete Product

router.put('/product/:productId/:userId', requireSignin, isAdmin , isAuth, update ); // Update Product

router.get('/products', productlist); // All Product

router.get('/products/search', listSearch); 

router.get('/products/related/:productId', listRelated); // it will show related prducts according to that product id

router.get('/products/categories', listCategories); // to search list of categories in product

router.post('/products/by/search', listBySearch);  // to search product by listing or range boxes

router.get('/product/photo/:productId', photo)

router.param('categoryId', categoryById);

router.param('userId', userById);

router.param('productId', productById);
//Middleware


module.exports = router;
