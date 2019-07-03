var middlewareObj = {};
var User = require('../models/users');
var Book = require('../models/books');

middlewareObj.isAdmin = function(req, res, next){
    if (req.isAuthenticated()){
        User.findById(req.params.id, function(err, user){
            if (err) {
                req.flash('error','User not found');
                res.redirect('back');
            } else {
                if (!user) {
                    req.flash('error', 'User does not exist');
                    return res.redirect('/login');
                }
                if(user.whichUser.equals('admin')){
                    next();
                } else {
                    req.flash('error',"You don't have required permission to do that.")
                    res.redirect('back');
                }
            }
        })
    }
}

middlewareObj.isLibrarian = function(req, res, next){
    if (req.isAuthenticated()){
        User.findById(req.params.id, function(err, user){
            if (err) {
                req.flash('error','User not found');
                res.redirect('back');
            } else {
                if (!user) {
                    req.flash('error', 'User does not exist');
                    return res.redirect('/login');
                }
                if(user.whichUser.equals('librarian') || user.whichUser.equals('admin')){
                    next();
                } else {
                    req.flash('error',"You don't have required permission to do that.")
                    res.redirect('back');
                }
            }
        })
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','You need to be logged in to do that.');
    res.redirect('/login');
}

module.exports = middlewareObj;