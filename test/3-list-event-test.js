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
var googleID = "100122958946797179078"; // id of ITMD567 account

/** Mocha describe method for function testing 
 * @name describe
 */
describe('listEvents()', function() {
  it('should return list of events', function(){
    assert.isString(gcalFunction.listEvent(googleID), 'string');
  });
});
