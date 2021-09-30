const createError = require('http-errors');
const express = require('express');
require('dotenv').config()
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require ('cors');
const logger = require('morgan');
const {expressValidator} = require('express-validator');
const expressSession = require('express-session');

const indexRouter = require('./routes/index');
const usersModel = require('./routes/users');
const userRoute = require('./routes/ReqSigninAuthUser');
const braintreeRoutes = require('./routes/braintree')

const app = express(); 

const morgan = require('morgan');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/api', indexRouter);
app.use('/users', usersModel);
app.use('/api', userRoute);
app.use('/api', braintreeRoutes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
}); 

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
