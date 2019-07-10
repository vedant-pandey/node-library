  //=========//
 // Imports //
//=========//

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
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
const indexRoutes = require('./routes/index');
const bookRoutes = require('./routes/books');
const librarianRoutes = require('./routes/librarians');

  //=============//
 // Connections //
//=============//

mongoose.connect('mongodb://localhost/library', {useNewUrlParser: true,useCreateIndex:true,useFindAndModify:false})
app.use(bodyParser.urlencoded({extended:true}));
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
    res.locals.success = req.flash('success');
    next();
});

  //========//
 // Routes //
//========//

app.use('/',indexRoutes);

// Books routes
app.use('/books',bookRoutes);

// Librarian routes

app.use('/librarians',librarianRoutes);

router.get('/notfound',function(req, res){
    res.render('notfound');
});

router.get('*', function(req,res){
    res.redirect('/notfound');
});

  //==========//
 // Listener //
//==========//

app.listen(1234, function(){
    console.log(`Server running ${1234}`);
});
process.on('SIGINT',function(){
    console.log('\nClosing server');
    process.exit();
});
