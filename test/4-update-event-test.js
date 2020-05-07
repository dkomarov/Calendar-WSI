/** Update event test module.
 * @module test/updateevent-test
 */

/** Require module for chai assert.
 * @requires chai
 */
const assert = require('chai').assert;

/** Require module for gCal function file.
 * @requires gcalendar
 */
const gcalFunction = require('../lib/gcalendar');

const mongoose = require('mongoose');

const User = require('../models/user-model');

User.findOne({
  googleId: "100122958946797179078"
}).then((currentUser) => {
    User = currentUser;
});

/** Updated event data object.
 * @const {object} updatedData
 */
const updatedData =  {
  _id: '5e928d5da2f4db9e1a413205',
  summary: 'event5updated',
  location: 'loc-updated',
  description: 'desc-updated',
  start: { 'dateTime': '2020-05-15T02:00:00.000Z', 'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
  end: { 'dateTime': '2020-05-15T07:00:00.000Z', 'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
  recurrence: '4',
  attendees: 'mailupdated@mail.co',
  reminders: 'updated'
};

/** Mocha describe method for function testing 
 * @name describe
 */
describe('updateEvent()', function() {
  it('should return a successfully updated event', function(){
    assert.isObject(gcalFunction.updateEvent(updatedData, User), 'object');
  });
});
