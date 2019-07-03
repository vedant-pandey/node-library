  //=========//
 // Imports //
//=========//

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const expressSanitizer = require('express-sanitizer');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const User = require('./models/users');
const Book = require('./models/books');

  //=============//
 // Connections //
//=============//

// MongoClient.connect('mongodb://localhost:27017',function(err,client){
//     if (err) return console.log(err);
//     db=client.db('library')
// });
mongoose.connect('mongodb://localhost/library', {useMongoClient:true})
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));
app.set("view engine", 'ejs');
app.use(expressSanitizer());
app.use(flash());


  //=================//
 // Passport Config //
//=================//

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flass('success');
});

  //========//
 // Routes //
//========//

app.get('/',function(req, res){
    res.render('home');
});
app.get('/about', function(req, res){
    res.render('about');
});
app.get('/contact', function(req,res){
    res.render('contact');
});
app.get('/register',function(req,res){
    res.render('register');
});
app.post('/register',function(req,res){
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
            req.flash('success',"Welcome, " + user.name + ". You've succesfully logged in as," + user.whichUser);
            res.redirect('/books');
        });
    });
});
app.get('/login', function(req, res){
    res.render('login');
});
app.post('/login', passport.authenticate('local',{
    successRedirect: '/books',
    failureRedirect: '/login',
    failureFlash: true
}),function(req, res){});
app.get('/logout',function(req, res){
    req.logout();
    req.flash('success','You were successfully logged out!')
    res.redirect('/');
})
app.get('*', function(req,res){
    res.render('notfound');
})

  //==========//
 // Listener //
//==========//

app.listen(1234, function(){
    console.log('Server running 1234');
});
process.on('SIGINT',function(){
    console.log('\nClosing server');
    process.exit();
})