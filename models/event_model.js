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
 * @param {object} _id - Mongoose object ID
 * @param {string} event_id - Google calendar event ID
 * @param {string} userID - User google ID
 * @param {string} summary - Appointment summary
 * @param {string} location - Appointment location
 * @param {string} description - Appointment description
 * @param {string} start - Appointment start date&time
 * @param {string} end - Appointment end date&time
 */
const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  event_id: { type: String, required: true },
  userID: { type: String, required: true },
  summary: { type: String, required: false },
  location: { type: String, required: false },
  description: { type: String, required: false },
  start: { type: String, required: false },
  end: { type: String, required: false },
  recurrence: { type: String, required: false },
  attendees: { type: String, required: false },
  reminders: { type: String, required: false }
});

/** Inserting authorized event data to event collection schema. */
module.exports = mongoose.model('Event', eventSchema);