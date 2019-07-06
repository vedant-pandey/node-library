var middlewareObj = {};
var User = require('../models/users');
var Book = require('../models/books');

middlewareObj.isAdmin = function(req, res, next){
    if (req.isAuthenticated()){
        User.findById(req.user._id, function(err, user){
            if (err) {
                req.flash('error','User not found');
                res.redirect('back');
            } else {
                if (!user) {
                    req.flash('error', 'User does not exist');
                    return res.redirect('/login');
                }
                if(user.whichUser=='admin'){
                    next();
                } else {
                    req.flash('error',"You don't have required permission to do that.")
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error','You need to be logged in to do that');
        res.redirect('/login')
    }
}

middlewareObj.isLibrarian = function(req, res, next){
    if (req.isAuthenticated()){
        User.findById(req.user._id, function(err, user){
            if (err) {
                req.flash('error','User not found');
                res.redirect('back');
            } else {
                if (!user) {
                    req.flash('error', 'User does not exist');
                    return res.redirect('/login');
                }
                if(user.whichUser=='librarian' || user.whichUser=='admin'){
                    next();
                } else {
                    req.flash('error',"You don't have required permission to do that.")
                    res.redirect('back');
                }
            }
        })
    } else {
        req.flash('error','You need to be logged in to do that');
        res.redirect('/login')
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