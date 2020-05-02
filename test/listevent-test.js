/** List event test module.
 * @module test/listevent-test
 */

/** Require module for chai assert.
 * @requires chai
 */
const assert = require('chai').assert;

/** Require module for gCal function file.
 * @requires gcalendar
 */
const gcalFunction = require('../lib/gcalendar');

/** Google ID variable string.
 * @var {string} googleID
 */
var googleID = "";

/** Mocha describe method for function testing 
 * @name describe
 */
describe('listEvents()', function() {
  it('should return list of events', function(){
    assert.isObject(gcalFunction.listEvent(googleID), 'object');
  });
});
