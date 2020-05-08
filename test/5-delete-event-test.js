/** Delete event test module.
 * @module test/deleteevent-test
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

/** Event ID variable string.
 * @var {string} eventID
 */
var eventID = '5e928d5da2f4db9e1a413205';

/** Mocha describe method for function testing 
 * @name describe
 */
describe('deleteEvent()', function() {
  it('should return a successfully deleted event ID', function(){
    assert.isString(gcalFunction.deleteEvent(eventID, User), 'string');
  });
});
