/** Event model module for event data insertion to database.
 * @module models/event_model
 */
'use strict';

/** Require module for MongoDB connection.
 * @requires mongoose
 */
const mongoose = require('mongoose'); 

/** Event data schema object.
 * @const {object} eventSchema
 */
const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  event_id: { type: String, require: true },
  userID: { type: String, require: true },
  summary: { type: String, required: false },
  location: { type: String, required: false },
  description: { type: String, required: false },
  start: { type: String, required: false },
  end: { type: String, required: false }
});

/** Inserting authorized event data to event collection schema. */
module.exports = mongoose.model('Event', eventSchema);