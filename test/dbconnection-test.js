const mocha = require('mocha');
var mongoose = require('mongoose');

describe('mongoDB database Tests', function(){
    it('Application sholud connect to mongoDB database', function() {
        before('connect', function(){
            return mongoose.createConnection('mongodb+srv://itmd567:'+process.env.MONGODB_PW+'@567websystems-qgpxm.azure.mongodb.net/test?retryWrites=true&w=majority');
        });
    });

    it('Application Database connection should be closed', function (){
        it('close', function(){
            return mongoose.disconnect();
        });
    });
});