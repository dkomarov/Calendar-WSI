'use strict';

const mongoose = require('mongoose');

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

module.exports = mongoose.model('Event', eventSchema);