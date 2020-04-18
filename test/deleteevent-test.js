const assert = require('chai').assert;
const gcalFunction = require('../lib/gcalendar');

var eventID = 1;

describe('deleteEvent()', function() {
  it('should return with successfully deleted event object', function(){
    assert.isObject(gcalFunction.deleteEvent(eventID), 'object');
  });
});
