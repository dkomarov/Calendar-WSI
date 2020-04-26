/** User model module for user data insertion to database.
 * @module models/user-model
 */
'use strict';

/** Require module for MongoDB connection.
 * @requires mongoose
 */
const mongoose = require('mongoose'); 

/** Establishing MongoDB collection schema.
 * @const {object} Schema
 */
const Schema = mongoose.Schema;

/** User data schema object.
 * @const {object} userSchema
 */
const userSchema = new Schema({
    userName: String,
    googleId: String,
    googleToken: String,
    googleRefresh: String
});

/** Inserting authorized user data to user collection schema.
 * @const {object} User
 */
const User = mongoose.model('user', userSchema);

module.exports = User;