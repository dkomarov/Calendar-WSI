var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongodb = require('./lib/connect');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRoutes = require('./routes/auth-routes');
var menuRoutes = require('./routes/menu');
var methodOverride = require('method-override');
const passportSetup = require('./config/passport-setup');
var appointmentRoutes = require('./routes/appointment-routes');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
var app = express();
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');

// mongoDB connection
mongodb.dbConnect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.set(passportSetup);

app.use(cookieSession({
  maxAge:24 * 60 * 60 *1000,
  keys:[keys.session.cookieKey]
}));

app.use(methodOverride('_method'));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/auth',authRoutes);
app.use('/menu', menuRoutes);
app.use('/appointment',appointmentRoutes);
app.use('/appointment/appt-success', appointmentRoutes);
app.use('/appointment/view-appointment',appointmentRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
