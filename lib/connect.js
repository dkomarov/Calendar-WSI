/** MongoDB database connection module.
 * @module lib/connect
 */
'use strict';

/** Require module for MongoDB connection.
 * @requires mongoose
 */
const mongoose = require('mongoose');

/** Exports a module function for database connection.
 * @function dbConnect
 */
module.exports = {
  dbConnect: function() {
    /** mongoDB connection */
    mongoose.connect('mongodb+srv://itmd567:'+process.env.MONGODB_PW+'@cluster0-crfwh.mongodb.net/test?retryWrites=true&w=majority', {
    //mongoose.connect('mongodb+srv://itmd567:'+process.env.MONGODB_PW+'@567websystems-qgpxm.azure.mongodb.net/test?retryWrites=true&w=majority', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }).then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Error: ', err));
  }
};