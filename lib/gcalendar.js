/** Google calendar CRUD functions module.
 * @module lib/gcalendar
 */

/** Require module for MongoDB connection.
 * @requires mongoose
 */
const mongoose = require('mongoose');

/** Require module for event model file.
 * @requires event_model
 */
const Event = require('../models/event_model');

/** Require module for fs library.
 * @requires fs
 */
const fs = require('fs');

/** Require module for readline library.
 * @requires readline
 */
const readline = require('readline');

/** Require module for Google API library.
 * @requires googleapis
 */
const {google} = require('googleapis');

/** Calendar data variable.
 * @var calendarData
 */
var calendarData;

/** Event ID variable.
 * @var eventID
 */
var eventID;

/** Google ID variable.
 * @var gID
 */
var gID;

/** Update variable.
 * @var update
 */
var update;

/** User data variable.
 * @var userData
 */
var userData;

/** Main class function to inherit CRUD operation methods from.
 * @function gCal
 * @param {object} functionName - Function name to be passed
 */
function gCal(functionName) {

  /** Use fs module to read credentials file and then use authorize function to authorize CRUD functions for authorized user. */
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    /** Authorize a client with credentials, then call the Google Calendar API. */
    if(functionName == "insertEvents"){
      authorize(JSON.parse(content), insertEvents);
    }else if(functionName == "listEvents"){
      authorize(JSON.parse(content), listEvents);
    }else if(functionName == "updateEvent"){
      authorize(JSON.parse(content), updateEvent);
    }else if(functionName == "deleteEvent"){
      authorize(JSON.parse(content), deleteEvent);
    }else if(functionName == "getList") {
      authorize(JSON.parse(content), getList);
    }
  });

  /** Authorize function used to authenticate credentials.
   * @function authorize
   * @param {object} credentials - User credentials
   * @param {object} callback - Call back function
   */
  function authorize(credentials, callback) {
    /** Client secret key.
     * @const {object} client_secret 
     */
    /** Client ID.
     * @const {object} client_id
     */
    /** Redirection URIs.
     * @const {object} redirect_uris
     */
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    /** Google client oAuth.
     * @const {object} oAuth2Client
     */
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    /** Check if we previously stored a token. */
    oAuth2Client.setCredentials({access_token: userData.googleToken});
    callback(oAuth2Client);
  }

  /** List events function used to list current authorized user calendar events.
   * @function listEvents
   * @param {string} auth - User auth string
   */
  function listEvents(auth) {
    /** Google calendar user auth.
     * @const {object} calendar 
     */
    const calendar = google.calendar({version: 'v3', auth});
    
    /** Google calendar list function call */
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

  /** Insert events function used to insert a new event to current authorized users' calendar.
   * @function insertEvents
   * @param {string} auth - User auth string
   */
  function insertEvents(auth) {
    const calendar = google.calendar({ version: 'v3', auth});

    /** Event information object for insertEvents containing summary, location, description, start(dateTime & timeZone), end(dateTime & timeZone), attendees, and reminders.
     * @var {object} event 
     */
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

    /** Google calendar insert function call */
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
        if (events.length) {
          events.map((event, i) => {
            Event.findOne({
              event_id: event.id
          }).then((currentEvent) => {
              if(currentEvent){
                  /** User exists */
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
            ev.save() /** store event in db */
            .then(result => {
              console.log(result); /** display stored event */
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

  /** Update event function used to update an event on authorized user calendar and MongoDB.
   * @function updateEvent
   * @param {string} auth - User auth string
   */
  function updateEvent(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    console.log('inside updateEvent, update is: ', update);

    /** File update object for updatEvent containing summary, location, description, start, end, reccurence, attendees, and reminders.
     * @const {object} FUO
     */
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

    /** Parameters object for updateEvent containing calendarId, eventId, and resource.
     * @var {object} params 
     */
    var params = {
      'calendarId': 'primary',
      'eventId': update.eventID,
      'resource': FUO
    };

    console.log('Resource Parameter is: ', params.resource);

    /** Google calendar update function call */
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
      
  /** Delete event function used to delete an event on authorized user calendar and MongoDB.
   * @function deleteEvent
   * @param {string} auth - User auth string
   */
  function deleteEvent(auth) {
    const calendar = google.calendar({version: 'v3', auth});

    /** Parameters object for deleteEvent containing calendarId and eventId.
     * @var {object} params 
     */
    var params = {
      calendarId: 'primary',
      eventId: eventID
    };

    /** Google calendar delete function call */
    calendar.events.delete(params, (res) => {
      if (res) {
        return console.log('Event Deletion Verification: ' + res);
      } else {
        Event.deleteOne({ event_id: eventID }, function (err) {
          if (err) {
            throw err;
          } else {
            console.log('1 document deleted');
          }
        });
      }
    });
  }

  function getList(auth){
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
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
            console.log("status: Event Stored");
        });
      }
    });
        });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }
}

module.exports = { 
  /** Export insert event function. 
   * @function insEvent 
   * @param {object} data - Calendar data
   * @param {object} reqData - User data
   */
  insEvent : function insEvent(data,reqData){
    calendarData = data;
    userData = reqData;
    gCal("insertEvents");
  }, 
  /** Export list event function. 
   * @function listEvent
   * @param {object} reqData - User data
   */
  listEvent : function listEvent(reqData){
    gID = reqData.googleId;
    userData = reqData;
    gCal("listEvents");
    return "done";
  },
  /** Export update event function. 
   * @function updateEvent
   * @param {object} newData - Updated data
   * @param {object} reqData - User data
   */
  updateEvent: function updateEvent(newData, reqData){
    //eventID = newData.eventID;
    update = newData;
    userData = reqData;
    gCal("updateEvent");
  },
  /** Export delete event function. 
   * @function deleteEvent
   * @param {object} dEvent - Event ID
   * @param {object} reqData - User data
   */
  deleteEvent: function deleteEvent(dEvent, reqData){
    eventID = dEvent;
    userData = reqData;
    gCal("deleteEvent");
  },
  /** Export get event list function. 
   * @function getEventList
   * @param {object} reqData - User data
   */
  getList: function getEventList(reqData){
    userData = reqData;
    gCal("getList");
  }
}



    

  
