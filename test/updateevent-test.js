const assert = require('chai').assert;
const gcalFunction = require('../lib/gcalendar');

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

describe('updateEvent()', function() {
  it('should return successfully updated event', function(){
    assert.isObject(gcalFunction.updateEvent(updatedData), 'object');
  });
});
