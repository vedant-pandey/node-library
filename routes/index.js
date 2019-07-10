const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');

router.get('/',function(req, res){
    res.render('home');
});

// User register routes

router.get('/register',function(req,res){
    res.render('register');
});
router.post('/register',function(req,res){
    var newUser = new User({
        name:req.body.name,
        username: req.body.username
    });
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash('error',err.message);
            res.redirect('back');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success',"Welcome, " + user.name + ". You've succesfully logged in as, " + user.whichUser);
            res.redirect('/books');
        });
    });
});

// User login routes

router.get('/login', function(req, res){
    res.render('login');
});
router.post('/login', passport.authenticate('local',{
    successRedirect: '/books',
    failureRedirect: '/login',
    failureFlash: true
}),function(req, res){});
router.get('/logout',function(req, res){
    req.logout();
    req.flash('success','You were successfully logged out!')
    res.redirect('/');
});

module.exports = router;