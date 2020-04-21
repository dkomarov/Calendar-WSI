const assert = require('chai').assert;
const gcalFunction = require('../lib/gcalendar');

var googleID = "";

describe('listEvents()', function() {
  it('should return list of events', function(){
    assert.isObject(gcalFunction.listEvent(googleID), 'object');
  });
});
