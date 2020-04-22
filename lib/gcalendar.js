const mongoose = require('mongoose');
const Event = require('../models/event_model');
var calendarData;
var eventID;
var gID;
var update;
var userData;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

function gCal(functionName) {
  

  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    // authorize(JSON.parse(content), listAllEvents);
      if(functionName == "insertEvents"){
        authorize(JSON.parse(content), insertEvents);
      }else if(functionName == "listEvents"){
        authorize(JSON.parse(content), listEvents);
      }else if(functionName == "updateEvent"){
        authorize(JSON.parse(content), updateEvent);
      }else if(functionName == "deleteEvent"){
        authorize(JSON.parse(content), deleteEvent);
      }
    });
    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
          client_id, client_secret, redirect_uris[0]);

      // Check if we have previously stored a toke
        oAuth2Client.setCredentials({access_token: userData.googleToken});
        callback(oAuth2Client);
    }


    function listEvents(auth) {
      const calendar = google.calendar({version: 'v3', auth});
      //console.log("calendarList is: " + calendar.calendarList.list);
      calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
      });
    }

    
        

    function insertEvents(auth) {

      const calendar = google.calendar({ version: 'v3', auth});

      //console.log("calendarData is: " +calendarData);
      var event = {
        'summary': calendarData.summary,
        'location': calendarData.location,
        'description': calendarData.description,
        'start': {
          'dateTime': calendarData.start,
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'end': {
          'dateTime': calendarData.end,
          'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        'attendees': calendarData.attendees,
        'reminders': calendarData.reminders
        
      };

      calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created: %s', event.data.summary);

        calendar.events.list({
          calendarId: 'primary',
          timeMin: (new Date()).toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: 'startTime',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const events = res.data.items;
          //console.log(events);
          if (events.length) {
            events.map((event, i) => {
              Event.findOne({
                event_id: event.id
            }).then((currentEvent) => {
                if(currentEvent){
                    //User exists
                    console.log('Event already exists: ', event.summary + " " + event.id);
                }else{
                const ev = new Event({ // parse event
                _id: mongoose.Types.ObjectId(),
                userID: gID,
                event_id: event.id,
                summary: event.summary,
                location: event.location,
                description: event.description,
                start: event.start.dateTime,
                end: event.end.dateTime
              });
  
              console.log("event is: " + ev)
              console.log("Attempting to store in db...")
              ev.save() // store event in db
              .then(result => {
                console.log(result); // display stored event
                 // res.status(201).json({
              console.log("status: Event Stored");
            });
          }
        });
            });
          } else {
            console.log('No upcoming events found.');
          }
        });
      });
    }
  }

    // UPDATE events in Calendar and MongoDB
    function updateEvent(auth) {
      //console.log('Now running:', functionName);
      console.log('inside updateEvent, update is: ', update);
  
      const FUO = {
        'summary': update.summary,
        'location': update.location,
        'description': update.description,
        'start': { 'dateTime': update.start, 'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
        'end': { 'dateTime': update.end, 'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone },
        'recurrence': update.recurrence,
        'attendees': update.attendees,
        'reminders': update.reminders
      };
  
      // console.log('update eventID', update.eventID);
      // console.log('mongo id: ', update.mongoID);
  
      const calendar = google.calendar({version: 'v3', auth});
  
      var params = {
        'calendarId': 'primary',
        'eventId': update.eventID,
        'resource': FUO
      };
  
      console.log('Resource Parameter is: ', params.resource);
  
      calendar.events.update(params, (res) => {
  
        if (res) {
          return console.log('Event Update Verification: ' + res); // GAPI
        } else {
          Event.findByIdAndUpdate({ // MongoDB
            '_id': update.mongoID},
          {
            'event_id': update.eventID,
            'summary': update.summary,
            'location': update.location,
            'description': update.description,
            'start': update.start,
            'end': update.end
          },function(err) {
            if (err) {
              throw err;
            } else {
              console.log('1 document updated');
            }
          });
        }
      });
    } 
    
    // DELETE events from Calendar and MongoDB
    function deleteEvent(auth) {
      //console.log('Now running:', functionName);
      const calendar = google.calendar({version: 'v3', auth});
  
      var params = {
        calendarId: 'primary',
        eventId: eventID
      };
  
      calendar.events.delete(params, (res) => {
        if (res) {
          return console.log('Event Deletion Verification: ' + res);
        } else {
          Event.deleteOne({event_id : eventID},function(err) {
            if (err){
              throw err;
            }else{
              console.log('1 document deleted');
            }
          });
        }
      });
    }
   

module.exports = { 
  insEvent : function insEvent(data,reqData){
    calendarData = data;
    userData = reqData;
    gCal("insertEvents");
  }, 
  listEvent : function listEvent(reqData){
    gID = reqData.googleId;
    userData = reqData;
    gCal("listEvents");
    return "done";
  },
  updateEvent: function updateEvent(newData, reqData){
    //eventID = newData.eventID;
    update = newData;
    userData = reqData;
    gCal("updateEvent");
  },
  deleteEvent: function deleteEvent(dEvent, reqData){
    eventID = dEvent;
    userData = reqData;
    gCal("deleteEvent");
  }
}
  