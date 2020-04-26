/** Delete event test module.
 * @module test/deleteevent-test
 */

const assert = require('chai').assert;
const gcalFunction = require('../lib/gcalendar');

var eventID = '5e928d5da2f4db9e1a413205';

describe('deleteEvent()', function() {
  it('should return successfully deleted eventID', function(){
    assert.isObject(gcalFunction.deleteEvent(eventID), 'object');
  });
});
