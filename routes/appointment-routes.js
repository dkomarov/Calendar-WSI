/** Appointment routes module.
 * @module routes/appointment-routes
 */

/** Require module for express lightweight middleware.
 * @requires express
 */
const express = require('express');

/** Require module for express router.
 * @requires Router
 */
const router = express.Router();

/** Require module for MongoDB connection.
 * @requires mongoose
 */
const mongoose = require('mongoose');

/** Require module for gCal function in gcalendar file.
 * @requires gcalendar
 */
const gcalFunction = require('../lib/gcalendar');

/** Require module for event model file.
 * @requires event_model
 */
const Event = require('../models/event_model');

/** Calendar data object variable.
 * @var {number} success
 */
var success = 0;

/** Calendar data object variable.
 * @var {object} calendarData
 */
var calendarData = {};

/** Start date data object variable.
 * @var {object} startDateObj
 */
var startDateObj;

/** End date data object variable.
 * @var {object} endDateObj
 */
var endDateObj;

/** Updated user data object variable.
 * @var {object} newData
 */
var newData = {};

var flag;

/** Authentication check to see if the user is already logged in
 * @function authCheck
 * @param {object} req - The request object 
 * @param {object} res - The response object
 * @param {object} next - The next object
 * @param {object} req.user - Google User object
 */
const authCheck = (req,res,next) =>{
    if(!req.user){
        // if user is not logged in
        res.redirect('/');
    }else{
        next();
    }
};

/** Route to index page
 * @name get/appointment
 * @param {object} user - Send the user object
 * @param {string} success - Store Success message
 */
router.get('/', authCheck, (req, res) => {
  res.render('appointment', { user: req.user, success: '' });
});

/** Route to get view appointment page
 * @name get/view-appointment
 * @param {object} req.user.googleId - User Google ID
 */
router.get('/view-appointment', authCheck, (req, res) => {
  gcalFunction.listEvent(req.user);
  getAppointmentList(res, req);
});

router.get('/view-appointment/update/:id', authCheck, (req, res) => {
  console.log('Passed ID: ' + req.params.id);
  getAppointmentInfo(res, req, success);
});

/** Routing to root page served on '/'.
 * @name post/
 * @param {object} req - Call back request
 * @param {object} res - Call back response
 */
router.post('/', function (req, res) {
  let rb = req.body;

  startDateObj = new Date(rb.startTime + " " + rb.startDate);
  endDateObj = new Date(rb.endTime + " " + rb.endDate);

  // console.log(Date(startDateObj.getTimezoneOffset()));
  // console.log(Date(endDateObj.getTimezoneOffset()));

  console.log("startDateObj is: " + startDateObj);
  console.log("endDateObj is: " + endDateObj);

  calendarData = {
    _id: mongoose.Types.ObjectId(),
    'summary': rb.summary,
    'location': rb.location,
    'description': rb.description,
    'start': startDateObj,
    'end': endDateObj,
    'recurrence': rb.recurrence,
    'attendees': rb.attendees,
    'reminders': rb.reminders
  }
  console.log(calendarData);

  async function run() {
    flag = gcalFunction.insEvent(calendarData, req.user);
    gcalFunction.listEvent(req.user);
  }
  
  run().then(()=>{
    if(flag != 0){
      res.render('appointment', { user: req.user, success: "success" })
    }else{
      res.render('appointment', { user: req.user, success: "fail" })
    }
  });
  
});

/** Routing to update appointment by ID
 * @name get/view-appointment/update/id
 * @param {object} req.params.id - User Event ID
 */
router.get('/view-appointment/update/:id', authCheck, (req, res)=>{
  console.log('Passed ID: '+req.params.id);
  getAppointmentInfo(res, req);
});

/** Routing to post to view-appointment page.
 * @name post/view-appointment
 * @param {object} req - Call back request
 * @param {object} res - Call back response
 */
router.post("/view-appointment/update/:id", authCheck, (req, res)=>{
  let rb = req.body;

  startDateObj = new Date(rb.startTime + " " + rb.startDate).toISOString();
  endDateObj = new Date(rb.endTime + " " + rb.endDate).toISOString();

  console.log("startDateObj is: " + startDateObj);
  console.log("endDateObj is: " + endDateObj);

  newData = {
    'mongoID': rb.mongoID,
    'eventID': rb.eventID,
    'summary': rb.summary,
    'location': rb.location,
    'description': rb.description,
    'start': startDateObj,
    'end': endDateObj,
    'attendees': rb.attendees,
    'reminders': rb.reminders
  }

  console.log("inside put route, newData is: %j", newData)


  async function run() {
    await gcalFunction.updateEvent(newData)
    gcalFunction.listEvent(req.user);
  }

  success = 1;
  run().then(getAppointmentInfo(res, req, success))
  success = 0;
  //run().then(res.render('update', { user: req.user, "event": event, success: "Update successful!"}));
  
  //getAppointmentList(res, req);
  //run().then(getAppointmentList(res, req));
  //run().then(res.redirect("/appointment/view-appointment"))


});

  

/** Routing to delete appointment on view-appointment page.
 * @name delete/view-appointment
 * @param {object} req - Call back request
 * @param {object} res - Call back response
 */
router.delete('/view-appointment',authCheck,(req,res)=>{
  console.log("req.body in DELETE is: %j" ,req.body)
  let e = req.body.de;

  /** Function to run gCal functions asynchronously
   * @async
   * @function run
   */
  async function run(){
    gcalFunction.deleteEvent(e);
    gcalFunction.listEvent(req.user);
  }
  
  run().then(getAppointmentList(res, req));
});

/** Function to get appointment list of authenticated user.
 * @function getAppointmentList
 * @param {object} res - Response
 * @param {object} req - Request
 */  
function getAppointmentList(res,req){
  Event.find({userID: req.user.googleId}).exec(function(err, events) {   
    if (err) {
      throw err;
    }else{
      res.render('view-appointment', { "events": events})
    }
  });
}

/** Function to get appointment info of authenticated user.
 * @function getAppointmentInfo
 * @param {object} res - Response
 * @param {object} req - Request
 */  
function getAppointmentInfo(res, req, success){
  console.log("Request params is: "+req.params.id);
  Event.find({userID: req.user.googleId}).exec(async function(err) {
    if(err){
      console.log("Unable to find user.");
    } else {
      Event.find({_id: req.params.id}).exec(async function(err, event) {
        if(err){
          console.log("Unable to find event id.");
        } else {
          console.log("Event found", event);

          if (success == 0) {
            res.render('update', { user: req.user, "event": event, success: '' })
          }
          else if (success == 1) {
            res.render('update', { user: req.user, "event": event, success: 'Update successful!' })
          }
        }
      })
    }
  });
}


module.exports = router;