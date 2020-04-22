const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');
passport.serializeUser((user, done)=> {
    done(null, user.id);
});

passport.deserializeUser((id,done)=> {
    User.findById(id).then((user)=> {
        done(null,user);
    });
});

passport.use(
    new GoogleStrategy({
    //options gor the google strategies
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    }, (accessToken, refreshToken, profile, done)=> {
        //passport callback function
        User.findOne({
            googleId: profile.id
        }).then((currentUser) => {
            if(currentUser){
                //User exists
                User.update({googleId: profile.id},{googleToken : accessToken},function(err, obj) {
                    if (err){
                      throw err;
                    }else{
                      console.log("Token updated");
                    }});
                console.log('user already exists', currentUser);
                done(null,currentUser);
            }else{
                //create User
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

