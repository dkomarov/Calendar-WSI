const mongoose = require('mongoose'); 

/**
 * Event Schema module
 *@module eventSchema
 *@param {ObjectId} _id - mongoose objectID
 *@param {String} event_id - stores the google Calendar eventId of the appointment  
 *@param {String} userID - stores the google user ID
 *@param {String} summary - summary of the appointment
 *@param {String} location - location of the appointment
 *@param {String} description - Description of the appointment
 *@param {String} start - start date and time of the appointment
 *@param {String} end - end date and time of the appointment
 */
const eventSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  event_id: { type:String, require: true},
  userID: {type:String, require:true},
  summary: { type: String, required: false },
  location: { type: String, required: false },
  description: { type: String, required: false },
  start: { type: String, required: false },
  end: { type: String, required: false }
});

module.exports = mongoose.model('Event', eventSchema);