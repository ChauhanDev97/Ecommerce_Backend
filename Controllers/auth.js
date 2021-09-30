const jwt = require('jsonwebtoken');

const expressJwt = require('express-jwt');


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });

exports.isAuth = (req, res, next) =>{
  let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user){
      return res.status(403).json({
        error : "Access Denied !"
      })
    }
    next();
}  

exports.isAdmin= (req, res, next) => {
  if(req.profile.role === 0 ){
    return res.status(403).json({
      error : 'Admin resource ! Access denied !'
    })
  }
  next();
}