/** Database connection test module.
 * @module test/dbconnection-test
 */

 /** Require module for mocha testing.
 * @requires mocha
 */
const mocha = require('mocha');

/** Require module for MongoDB connection.
 * @requires mongoose
 */
var mongoose = require('mongoose');

/** Mocha describe method for function testing 
 * @name describe
*/
describe('mongoDB database Tests', function(){
    it('should connect successfully to mongoDB database', function() {
        before('connect', function(){
            return mongoose.createConnection('mongodb+srv://itmd567:'+process.env.MONGODB_PW+'@567websystems-qgpxm.azure.mongodb.net/test?retryWrites=true&w=majority');
        });
    });

    it('should successfully close mongoDB connection', function (){
        it('close', function(){
            return mongoose.disconnect();
        });
    });
});
