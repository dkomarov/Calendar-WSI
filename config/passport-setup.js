/** Passport.js configuration setup module.
 * @module config/passport-setup
 */
'use strict';

/** Require module for passport js.
 * @requires passport
 */
const passport = require('passport');

/** Require module for passports google authentication.
 * @requires passport-google-oauth20
 */
const GoogleStrategy = require('passport-google-oauth20');

/** Require module for keys file.
 * @requires keys
 */
const keys = require('./keys');

/** Require module for user model file.
 * @requires user-model
 */
const User = require('../models/user-model');

/** Passport serialize user function.
 * @function serializeUser
 * @param {object} user - User object
 * @param {object} done - Done object
 */
passport.serializeUser((user, done)=> {
  done(null, user.id);
});

/** Passport deserialize user function.
 * @function deserializeUser
 * @param {object} id - User ID object
 * @param {object} done - Done object
 */
passport.deserializeUser((id,done)=> {
  User.findById(id).then((user)=> {
    done(null,user);
  });
});

/** Passport use function for google strategy.
 * @function use
 */
passport.use(
  new GoogleStrategy({
    /** Options for the google strategies. */
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    }, (accessToken, refreshToken, profile, done)=> {
        /** Passport callback function. */
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
            if(currentUser){
                /** User exists. */
                User.update({googleId: profile.id},{googleToken : accessToken},function(err, obj) {
                    if (err){
                      throw err;
                    }else{
                      console.log("Token updated");
                    }});
                console.log('user already exists', currentUser);
                done(null,currentUser);
            }else{
                /** Create User. */
                new User({
                    userName: profile.displayName,
                    googleId: profile.id,
                    googleToken: accessToken,
                    googleRefresh: refreshToken
                }).save().then((newUser) => {
                    console.log('new user was created' +newUser);
                    done(null, newUser);
                });
            }
        });
      })
)
