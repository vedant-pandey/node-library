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
const methodOverride = require('method-override');
const User = require('./models/users');
const Book = require('./models/books');
const middleware = require('./middleware');

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
app.use(methodOverride('_method'));
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

// User register routes

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

// User login routes

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
});

// Books routes

app.get('/books', middleware.isLoggedIn, function(req,res){
    Book.find({},function(err, books){
        if(err){
            console.log('An error occured with your db');
            console.log(err);
        } else {
            res.render('books/index',{books:books})
        }
    });
});

app.post('/books', middleware.isLibrarian, function(req, res){
    var book = {
        name:req.body.name,
        author:req.body.author,
        issuedBy: {
            id: req.user._id,
            name: req.user.name
        }
    }
    Book.create(book,function(err,book){
        if(err){
            console.log('DB could not add new book');
            console.log(err);
        } else {
            res.redirect('/books');
        }
    })
});

app.get('/books/new', middleware.isLibrarian, function(req,res){
    res.render('books/new');
});

app.get('/books/:id', function(req,res){
    Book.findById(req.params.id).populate('books').exec(function(err, book){
        if (err){
            console.log(err);
            req.flash('error','Sorry, the requested book does not exist in this library');
            res.redirect('/notfound');
        } else {
            if (!book){
                req.flash('error', 'Requested book was not found.');
                return res.redirect('/notfound');
            }
            res.render('books/show', {book:book});
        }
    });
});

app.get('/books/:id/edit', middleware.isLibrarian, function(req, res){
    Book.findById(req.params.id).exec(function(err, book){
        if (err) {
            console.log(err);
            req.flash('error', 'Sorry the requested book does not exist');
            res.redirect('/notfound');
        } else {
            if(!book){
                req.flash('error','Book not found');
                return res.redirect('notfound');
            }
            res.render('book/edit',{book:book});
        }
    });
});

app.put('/:id', middleware.isLibrarian, function(req, res){
    var newBook = req.body.book;
    newBook.name = req.body.name;
    newBook.author = req.body.author;
    Book.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, book){
        if (err) {
            res.redirect("/books");
        } else {
            if (!book) {
                    req.flash("error", "Book not found.");
                    return res.redirect("/notfound");
                }
            req.flash("success","Your Book was updated.");
            res.redirect("/books/"+req.params.id);
        }
    })
});

app.delete(':/id', middleware.isLibrarian, function(req, res){
    Book.findOneAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/books");
        } else {
            req.flash("success","Your book was removed.");
            res.redirect("/books");
        }
    });
});

// Wildcard routes

app.get('notfound',function(req, res){
    res.render('notfound');
});

app.get('*', function(req,res){
    res.redirect('/notfound');
});

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