const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;


/**
 *User Schema module
 *@module userSchema
 *@param {String} userName - google user name
 *@param {String} googleId - google user ID
 */
const userSchema = new Schema({
    userName: String,
    googleId: String,
    googleToken: String,
    googleRefresh: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;