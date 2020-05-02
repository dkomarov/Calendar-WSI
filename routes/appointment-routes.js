/**
 * @module routers
 */

/**
* router module
* @const
*/
const router = require('express').Router();
const mongoose = require('mongoose');
const gcalFunction = require('../lib/gcalendar');
const Event = require('../models/event_model');
var calendarData = {};
var startDateObj;
var endDateObj;
var newData = {};



/**
 * Checks if the user is alredy loggedIn
 * @memberof module:routers
 * @function authCheck
 * @param {object} req - The request object 
 * @param {object} res - The response object
 * @param {object} next - The next object
 * @param {object} req.user - Google User object
 */


const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/');
  } else {
    next();
  }
};

/**
 * Route to index page
 * @name get/appointment
 * @function
 * @memberof module:routers
 * @route {get} /appointment
 * @param {object} user - Send the user object
 * @param {string} success - Store Success message
 */
router.get('/', authCheck, (req, res) => {
  res.render('appointment', { user: req.user, success: '' });
});

/**
 * Route to view appointment page
 * @name get/view-appointment
 * @function gcalFunction
 * @memberof module:routers
 * @inner
 * @param {object} req.user.googleId - user googleID
 */
router.get('/view-appointment', authCheck, (req, res) => {
  gcalFunction.listEvent(req.user);
  getAppointmentList(res, req);
});

router.get('/view-appointment/update/:id', authCheck, (req, res) => {
  console.log('Passed ID: ' + req.params.id);
  getAppointmentInfo(res, req);
});

//router.post("/view-appointment", authCheck, (req, res) => {
//router.post('/view-appointment/update/:id', authCheck, (req, res) => {
router.post('/view-appointment/update/:id', authCheck, (req, res) => {
  //console.log("req.body in UPDATE is: %j" ,req.body)
  let rb = req.body;

  // console.log("rb.startDate is: " + rb.startDate)
  // console.log("rb.startTime is: " + rb.startTime)

  startDateObj = new Date(rb.startTime + " " + rb.startDate).toISOString();
  endDateObj = new Date(rb.endTime + " " + rb.endDate).toISOString();

  console.log("startDateObj is: " + startDateObj);
  console.log("endDateObj is: " + endDateObj);

  //  console.log(Date(startDateObj.getTimezoneOffset()));
  // console.log(Date(endDateObj.getTimezoneOffset()));


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
    gcalFunction.updateEvent(newData);
    gcalFunction.listEvent(req.user);
    Event.find({ _id: req.params.id }).exec(async function (err, event) {
      if (err) {
        console.log("Unable to find event id.");
      } else {
        console.log("Event id found: " + event);
        res.send({ "event": event })
      }
  });
  getAppointmentList(res, req);
}
  run().then(res.redirect("/appointment/view-appointment"))
  //.then(getAppointmentList(res, req)); 
})

router.delete("/view-appointment", authCheck, (req, res) => {
  console.log("req.body in DELETE is: %j", req.body)
  let e = req.body.de;

  async function run() {
    gcalFunction.deleteEvent(e);
    gcalFunction.listEvent(req.user);
  }
  
  run().then(getAppointmentList(res, req));
});

// router.get('/appt-success',authCheck,(req,res)=>{
//   gcalFunction.listEvent(req.user.googleId);
//   res.render('appt-success',{user:req.user});
// });

router.post("/", function (req, res) {
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
  gcalFunction.insEvent(calendarData, req.user);
  res.render('appointment', { user: req.user, success: "Appointment booked successfully!" });
});

function getAppointmentList(res, req) {
  Event.find({ userID: req.user.googleId }).exec(function (err, events) {
    if (err) {
      throw err;
    } else {
      res.render('view-appointment', { "events": events }) //, success: ''
    }
  });
}

function getAppointmentInfo(res, req) {
  console.log("Request params is: " + req.params.id);
  Event.find({ userID: req.user.googleId }).exec(async function (err) {
    if (err) {
      console.log("Unable to find user.");
    } else {
      Event.find({ _id: req.params.id }).exec(async function (err, event) {
        if (err) {
          console.log("Unable to find event id.");
        } else {
          console.log("Event id found: " + event);
          res.render('update', { "event": event })
        }
      })
    }
  });
}

module.exports = router;

