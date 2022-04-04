var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Posts = new Schema (
    {
        title: {type: String, maxLength: 1000},
        timestamp: {type: Date},
        text: {type: String, maxLength: 60000},
        author: {type: String},
    }
)

Posts
.virtual('url')
.get(function () {
    return '/posts/' + this._id
});

module.exports = mongoose.model('Posts', Posts);