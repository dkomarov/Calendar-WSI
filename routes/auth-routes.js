/** Authentication routes module.
 * @module routes/auth-routes
 */

/** Require module for express lightweight middleware.
 * @requires express
 */
const express = require('express');

/** Require module for express router.
 * @requires Router
 */
const router = express.Router();

/** Require module for passport js.
 * @requires passport
 */
const passport = require('passport');
const gcalFunction = require('../lib/gcalendar');

/** Authenticate user log in
 * @name get/login
 * @param {object} req - Request 
 * @param {object} res - Response
 */
router.get('/login',(req,res)=>{
  res.render('login');
});

/** Authenticate user log out
 * @name get/logout
 * @param {object} req - Request 
 * @param {object} res - Response
 */
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
});

/** Authenticate with google
 * @name get/google
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'https://www.googleapis.com/auth/calendar']
}));

/** Callback route for google to redirect to
 * @name get/google/redirect
 */
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  // res.send('you have reached the call back URL!!!');
  gcalFunction.getList(req.user);
  res.redirect('/menu');
});

module.exports = router;