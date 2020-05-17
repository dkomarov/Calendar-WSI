/** @file An ExpressJS web app that allows users to book appointments with each other using Google Calendar API data 
 * @author Denis Komarov <dkomarov@hawk.iit.edu>
 * @author Dhiraj Jain <djain14@hawk.iit.edu> 
 * @author Jimmy Tran <jtran8@hawk.iit.edu>
 * @copyright Denis Komarov, Dhiraj Jain, and Jimmy Tran
 * @version 1.2.0-beta.1 release
 * @license 
 * Copyright 2020 by Denis Komarov, Dhiraj Jain, and Jimmy Tran
 * 
 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the 
 * above copyright notice and this permission notice appear in all copies.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY 
 * DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
 * ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
'use strict';

/** Require module for cookie session.
 * @requires cookie-session
 */
const cookieSession = require('cookie-session');

/** Require module for http errors.
 * @requires http-errors
 */
const createError = require('http-errors');

/** Require module for express lightweight middleware.
 * @requires express
 */
const express = require('express');

 /** App constant using express middleware.
 * @const {object} app 
 */
const app = express();

/** Require module for ejs layouts using express.
 * @requires express-ejs-layouts
 */
const expressLayouts = require('express-ejs-layouts');

/** Require module for index routing file.
 * @requires index
 */
const indexRouter = require('./routes/index');

/** Require module for keys file.
 * @requires keys
 */
const keys = require('./config/keys');

/** Require module for morgan.
 * @requires morgan
 */
const logger = require('morgan');

/** Require module for menu routing file.
 * @requires menu
 */
const menuRoutes = require('./routes/menu');

/** Require module for database connection file.
 * @requires connect
 */
const mongodb = require('./lib/connect');

/** Require module for passport file.
 * @requires passport
 */
const passport = require('passport');

/** Require module for passport configuration file.
 * @requires passport-setup
 */
const passportSetup = require('./config/passport-setup');

/** Require module for method override. To convert Post requests to Delete and Update.
 * @requires method-override
 */
const methodOverride = require('method-override')

/** Require module for path.
 * @requires path
 */
const path = require('path');

/** Require module for user routing file.
 * @requires users
 */
const usersRouter = require('./routes/users');

/** Require module for authentication routing file.
 * @requires auth-routes
 */
const authRoutes = require('./routes/auth-routes');

/** Require module for appointment routing file.
 * @requires appointment-routes
 */
const appointmentRoutes = require('./routes/appointment-routes');

/** Connects the application to MongoDB database. */
mongodb.dbConnect();

/** Setting up views, view engine, and layouts. */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'))

/** Manage cookie sessions. */
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
  keys: [keys.session.cookieKey]
}));

/** Initialise and configure passport. */
app.use(passport.initialize());
app.use(passport.session());
app.set(passportSetup);

/** Configure morgan and express middleware. */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/** Establish proper page routings */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRoutes);
app.use('/menu', menuRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/appointment/appt-success', appointmentRoutes);
app.use('/appointment/view-appointment', appointmentRoutes);

/** Catch 404 error and forward to error handler. */
app.use(function(req, res, next) {
  next(createError(404));
});

/** Error handler */
app.use(function(err, req, res) {
  /** Set locals, only providing error in development. */
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  /** Render the error page */
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
