const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

//user schema to store the user information in the mongoDB
const userSchema = new Schema({
    userName: String,
    googleId: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;