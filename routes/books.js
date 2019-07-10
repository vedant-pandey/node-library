const express = require('express');
const router = express.Router();
const Book = require('../models/books');
const passport = require('passport');
const middleware = require('../middleware');


router.get('/', middleware.isLoggedIn, function(req,res){
    Book.find({},function(err, books){
        if(err){
            console.log('An error occured with your db');
            console.log(err);
        } else {
            res.render('books/index',{books:books})
        }
    });
});

router.post('/', middleware.isLibrarian, function(req, res){
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

router.get('/new', middleware.isLibrarian, function(req,res){
    res.render('books/new');
});

router.get('/:id', middleware.isLoggedIn, function(req,res){
    Book.findById(req.params.id).populate('books').exec(function(err, book){
        if (err){
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

router.get('/:id/edit', middleware.isLibrarian, function(req, res){
    Book.findById(req.params.id).exec(function(err, book){
        if (err) {
            req.flash('error', 'Sorry the requested book does not exist');
            res.redirect('/notfound');
        } else {
            if(!book){
                req.flash('error','Book not found');
                return res.redirect('/notfound');
            }
            res.render('books/edit',{book:book});
        }
    });
});

router.put('/:id', middleware.isLibrarian, function(req, res){
    var newBook = req.body.book;
    newBook.issuedBy = {
        id: req.user._id,
        name: req.user.name
    }
    Book.findByIdAndUpdate(req.params.id, {$set: newBook}, function(err, book){
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
    });
});

router.delete('/:id', middleware.isLibrarian, function(req, res){
    Book.findOneAndRemove(req.params.id, function(err){
        if (err) {
            req.flash('error','Book could not be removed');
            res.redirect("/books");
        } else {
            req.flash("success","Your book was removed.");
            res.redirect("/books");
        }
    });
});

module.exports=router;