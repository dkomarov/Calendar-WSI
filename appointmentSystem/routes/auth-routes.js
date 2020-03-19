const router = require('express').Router();
const passport = require('passport');
//AUTH LOGIN

router.get('/login',(req,res)=>{
    res.render('login');
});

//auth logout
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
});

//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/calendar']
}));


//callback route for google to redirect to
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
   //res.send('you have reached the call back URL!!!');
    res.redirect('/menu');
});
module.exports = router;