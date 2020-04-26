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

/** Updated event data object.
 * @const {object} updatedData
 */
const updatedData =  {
  _id: '5e928d5da2f4db9e1a413205',
  summary: 'event5updated',
  location: 'loc-updated',
  description: 'desc-updated',
  start: '2020-05-15T02:00:00.000Z',
  end: '2020-05-15T07:00:00.000Z',
  recurrence: '0',
  attendees: 'mailupdated@mail.co',
  reminders: 'updated'
};

/** Mocha describe method for function testing 
 * @name describe
 */
describe('updateEvent()', function() {
  it('should return successfully updated event', function(){
    assert.isObject(gcalFunction.updateEvent(updatedData), 'object');
  });
});
