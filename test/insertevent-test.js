/** Insert event test module.
 * @module test/insertevent-test
 */

/** Require module for chai assert.
 * @requires chai
 */
const assert = require('chai').assert;

/** Require module for gCal function file.
 * @requires gcalendar
 */
const gcalFunction = require('../lib/gcalendar');

/** Calendar data object.
 * @const {object} calendarData
 */
const calendarData =  {
  _id: '5e928d5da2f4db9e1a413205',
  summary: 'event5',
  location: 'loc',
  description: 'desc',
  start: '2020-04-12T06:00:00.000Z',
  end: '2020-04-12T07:00:00.000Z',
  recurrence: '3',
  attendees: 'mail@mail.co',
  reminders: 'none'
};

/** Mocha describe method for function testing 
 * @name describe
 */
describe('insertEvent()', function() {
  it('should return an inserted event object', function(){
    assert.isObject(gcalFunction.insEvent(calendarData), 'object');
  });
});
