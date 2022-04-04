var User = require('../models/user')
var Posts = require('../models/posts')
var async = require('async');
const {body, validationResult } = require("express-validator");
const posts = require('../models/posts');

//index

exports.index = function (req, res, next) {
    Posts.find()
    .sort([['name', 'ascending']])
    .exec(function (err, posts_list) {
        if (err) { return next(err); }
        //Sucessful, so render


        res.render('index', {posts_list: posts_list, } )
    });

}

exports.posts_details_get = function(req, res, next) {

    async.parallel({
        posts: function(callback) {
            Posts.findById(req.params.id)
            .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.posts==null) { // No results.
            var err = new Error('Post not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('posts_details', {posts: results.posts, link: "/deletePost"+results.posts.url,} )
    });
  
};

// Display create posts form
exports.posts_create_get = function(req, res, next) {
    res.render('create_posts',{errors: undefined} );
};

// Handle create posts post
exports.posts_create_post = [
   // Validate and sanitize 
    body('title', '').trim().escape(),
    body('post_text', 'Your text must not be empty').isLength({min : 1}).escape(),

   // Process request after validation and sanitization
   (req, res, next) => {
    const errors = validationResult(req);

    // Create post with escaped data

    var posts = new Posts({
        title: req.body.title,
        timestamp: Date.now(),
        text: req.body.post_text,
        author: req.user.username,
    });

    if(!errors.isEmpty()) {
        res.render('create_posts', {errors: errors.array()} )
        return
    }

        posts.save(function (err) {
            if (err) { return next(err); }
            res.redirect(posts.url);
        })
   }

]

// Display delete posts 
exports.posts_delete_get = function(req, res, next) {
    async.parallel({
        posts: function(callback) {
            Posts.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.posts==null) { // No results.
            res.redirect('/');
        }
        // Successful, so render.
        res.render('delete_posts', { posts: results.posts, } );
    });
};

// Handle delete posts post
exports.posts_delete_post = function(req, res, next){
      Posts.findByIdAndRemove(req.body.postsid, function deletePosts(err) {
          if (err) { return next(err); }
      res.redirect('/')
      })

}


