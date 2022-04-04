var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var User = new Schema (
    {
        first_name: {type: String, required: true, maxLength: 20},
        last_name: {type: String, required: true, maxLength: 30},
        username: {type: String, required: true, maxLength: 20},
        password: {type: String, required: true},
        membership_status: {type: Boolean, required: true},
        admin: {type: Boolean, required: true},

    }
)

User
.virtual('url')
.get(function () {
    return '/user/' + this._id
});

module.exports = mongoose.model('User', User);