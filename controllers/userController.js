var User = require('../models/user')
var Posts = require('../models/posts')
var async = require('async');
const bcrypt = require("bcryptjs");
const {body, validationResult } = require("express-validator");
const session = require("express-session");
const passport = require("passport");

// Display sign-up form
exports.user_sign_get = function(req, res, next) {
    res.render('sign-up_form', {user: undefined, errors: undefined, messageTaken: undefined})
}

// Handle sign-up post
exports.user_sign_post = [
   // Validate and sanitize 
   body('first_name', 'First name must not be empty').isLength({min : 1}).trim().escape(),
   body('last_name', 'Last name must not be empty').isLength({min : 1}).trim().escape(),
   body('username', 'Username must not be empty').isLength({min : 1}).trim().escape(),
   body('password', "Password must not be empty and must contain atleast three characters").isLength({min : 3}).trim().escape(),
   body('password_confirm').trim()
   .custom((value, {req}) => {
       if(value != req.body.password) {
           return Promise.reject("Password mismatch!");
       }
       return true
   }).escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
   
   const errors = validationResult(req);

   // Create post with escaped data

   bcrypt.hash(req.body.password, 10, (error, newHash) => {
    if (error) {
     return next(error)
    }
    req.body.password = newHash
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      membership_status: false,
      admin: false,
    })
   if(!errors.isEmpty()) {
       res.render('sign-up_form', { user: user, errors: errors.array(), messageTaken: undefined})
       return
    } 
    else {
 // Data from form is valid.
        // Check if user with same name already exists.
        User.findOne({ 'username': req.body.username })
          .exec( function(err, found_user) {
             if (err) { return next(err); }
  
             if (found_user) {
               // User exists, redirect to its detail page.
               res.render('sign-up_form', {user: user, errors: errors.array(), messageTaken: "This username is already taken"});
             }
             else {
               user.save(function (err) {
                 if (err) { return next(err); }
                 // User saved. Redirect to genre detail page.
                 res.redirect("/");
               });
  
             }
  
           });
    }
  })} 
]

exports.user_become_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    // User cannot access the members form unless logged in
    return res.redirect("/login");
  }
  return res.render("become_vip", { title: "Become a Member", user: res.locals.currentUser, errors: undefined  })
}

exports.user_become_post = [
  body("secret_pass", "Please enter the right passcode").trim().equals("vip").escape(),
  
   (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there is an error submitting the member validation form, re-render the form with an error
      return res.render("become_vip", { title: "Become a Member", user: res.locals.currentUser, errors: errors.array() });
    }

    const user = new User(res.locals.currentUser);
    user.membership_status = true;

   User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  },
];

exports.user_admin_get = function (req, res, next) {
  if (!res.locals.currentUser) {
    // User cannot access the members form unless logged in
    return res.redirect("/login");
  }
  return res.render("admin", { title: "ADMIN", user: res.locals.currentUser  })
}

exports.user_admin_post = [
  body("admin_pass", "Please enter the right passcode").trim().equals("admin").escape(),
  
   (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there is an error submitting the member validation form, re-render the form with an error
      return res.render("admin", { title: "ADMIN", user: res.locals.currentUser, errors: errors.array() });
    }

    const user = new User(res.locals.currentUser);
    user.admin = true;

   User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  },
];



// Display login
exports.user_login_get = function(req, res, next) {
    res.render('login', { user: req.user, wrong: false} )
}

