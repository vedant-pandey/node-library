const express = require('express');
const router = express.Router();
const User = require('../models/users');
const passport = require('passport');
const middleware = require('../middleware');

router.get('/', middleware.isAdmin, function(req,res){
    console.log('here')
    User.find({'whichUser':'librarian'},function(err, librarians){
        if(err){
            console.log('An error occured with your db');
            console.log(err);
        } else {
            res.render('librarians/index',{librarians:librarians})
        }
    });
});

router.post('/', middleware.isAdmin, function(req, res){
    var newLibrarian = {
        name:req.body.name,
        username:req.body.username,
        whichUser: 'librarian'
    }
    User.register(newLibrarian,req.body.password,function(err,librarian){
        if(err){
            req.flash('error',err.message);
            res.redirect('back');
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success',"Welcome, " + librarian.name + ". You've succesfully logged in as," + librarian.whichUser);
            res.redirect('/librarians');
        });
    });
});

router.get('/new', middleware.isAdmin, function(req,res){
    res.render('librarians/new');
});

router.get('/:id', middleware.isAdmin, function(req,res){
    User.findById(req.params.id).populate('users').exec(function(err, librarian){
        if (err){
            console.log(err);
            req.flash('error','Sorry, the requested user does not exist in this library');
            res.status(404).redirect('/notfound');
        } else {
            if (!librarian){
                req.flash('error', 'Requested user was not found.');
                return res.status(404).redirect('/notfound');
            }
            res.render('librarians/show', {librarian:librarian});
        }
    });
});

router.get('/:id/edit', middleware.isAdmin, function(req, res){
    User.findById(req.params.id).exec(function(err, librarian){
        if (err) {
            console.log(err);
            req.flash('error', 'Sorry the requested user does not exist');
            res.redirect('/notfound');
        } else {
            if(!librarian){
                req.flash('error','User not found');
                return res.redirect('notfound');
            }
            res.render('librarians/edit',{librarian:librarian});
        }
    });
});

router.put('/:id', middleware.isAdmin, function(req, res){
    var newUser = req.body.librarian;
    newUser.whichUser = 'librarian';
    User.findByIdAndUpdate(req.params.id, {$set: newUser}, function(err, user){
        if (err) {
            res.redirect("/librarians");
        } else {
            if (!user) {
                    req.flash("error", "User not found.");
                    return res.redirect("/notfound");
                }
            req.flash("success","Your User was updated.");
            res.redirect("/librarians/"+req.params.id);
        }
    })
});

router.delete('/:id', middleware.isAdmin, function(req, res){
    User.findOneAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect("/librarians");
        } else {
            req.flash("success","Your user was removed.");
            res.redirect("/librarians");
        }
    });
});


module.exports = router;