var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Posts = require('../models/posts')
const path = require('path');
const bcrypt = require("bcryptjs")
const passport = require("passport");


var user_controller = require('../controllers/userController');
var posts_controller = require('../controllers/postsController')

router.get('/', posts_controller.index)

router.get('/createPost', posts_controller.posts_create_get)

router.post('/createPost', posts_controller.posts_create_post)

router.get('/deletePost/Posts/:id', posts_controller.posts_delete_get)

router.post('/deletePost/Posts/:id', posts_controller.posts_delete_post)

router.get('/posts/:id', posts_controller.posts_details_get)

router.get('/sign-up', user_controller.user_sign_get)

router.post('/sign-up', user_controller.user_sign_post)

router.get('/become-vip', user_controller.user_become_get)

router.post('/become-vip', user_controller.user_become_post)

router.get('/admin', user_controller.user_admin_get)

router.post('/admin', user_controller.user_admin_post)

router.get('/login', user_controller.user_login_get)

router.get('/failedToLogin', function(req, res, next) {
  res.render('failedToLogin')
})
router.post('/login', passport.authenticate("local", {
    successRedirect: "/login",
    failureRedirect: "/failedToLogin", 
  }))

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect("/");
})


module.exports = router;