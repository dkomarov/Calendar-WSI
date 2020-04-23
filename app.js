const appointmentRoutes = require('./routes/appointment-routes');
const authRoutes = require('./routes/auth-routes');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const keys = require('./config/keys');
const logger = require('morgan');
const menuRoutes = require('./routes/menu');
const mongodb = require('./lib/connect');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const path = require('path');
const usersRouter = require('./routes/users');

/**
 * @description Connects the application to mongoDB Database
 */
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

/**
 * @description Initialise the passport
 */
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
