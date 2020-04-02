const router = require('express').Router();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const gcalFunction = require('../controllers/gCalendar');
const Event = require('../models/event_model');

var calendarData = {};
var startDateObj;
var endDateObj;
var events;

const authCheck = (req,res, next) =>{
    if(!req.user){
        // if user is not logged in
        res.redirect('/');
    }else{
        next();
    }
};

router.get('/',authCheck,(req,res)=>{  
    res.render('appointment',{user:req.user});
});

router.get('/view-appointment',authCheck, (req,res)=>{
    gcalFunction.listEvent(req.user.googleId);
    getAppointmentList(res,req);
});

router.get('/view-appointment/edit/:id',authCheck, (req,res)=>{
  console.log('Passed id: ' + req.params.id);
  //console.log('req is: ' + req);

  getAppointmentInfo(res, req);

});
  // Event.find({userID: req.user.googleId}).exec(async function(err, event) {   
  //   if (err) {
  //     throw err;
  //   }else{
  //     res.render('edit', { "event": event})
  //   }
  // });




router.put("/view-appointment/edit/", authCheck, (req, res)=>{
  console.log("req.body in UPDATE is: ", req.body)
  let e = req.body.ue;

  async function run(){
    gcalFunction.updateEvent(e);
    gcalFunction.listEvent(req.user.googleId);
  }
  run().then(getAppointmentList(res,req));
});

router.delete("/view-appointment",authCheck,(req,res)=>{
  console.log("req.body in DELETE is: ", req.body)

  let e = req.body.de;
  async function run(){
    gcalFunction.deleteEvent(e);
    gcalFunction.listEvent(req.user.googleId);
  }
  run().then(getAppointmentList(res,req));
});

router.post("/", function(req, res){
    let rb = req.body;

    startDateObj = new Date(rb.startTime +" "+ rb.startDate);
    endDateObj = new Date(rb.endTime +" "+ rb.endDate);

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
    gcalFunction.insEvent(calendarData);
    res.render('appointment',{user:req.user});
    //res.redirect('/menu');
  });
  
function getAppointmentList(res,req){
    Event.find({userID: req.user.googleId}).exec(async function(err, events) {   
      if (err) {
        throw err;
      } else {
        res.render('view-appointment', { "events": events})
      }
    });
  }

function getAppointmentInfo(res, req) {

  console.log("Request params is: " + req.params.id);

  Event.find({userID: req.user.googleId}).exec(async function(err) {   
    
    if (err) {
      console.log("Unable to find user.")
      //throw err;
    } else {

      Event.find({event_id: req.params.id}).exec(async function(err, event) {  
        
        if (err) {
          console.log("Unable to find event id.")
          //throw err;
        } else {

      // events.map((event, i) => {
      //   Event.findById({event_id:req.params.id

      //   }).then((match) => {

      //   if (match) {
          console.log("ID is matching! " + event)
          res.render('edit', { "event": event})
        //}

      //});


    }
  });
    }
    });
  }


  
module.exports = router;