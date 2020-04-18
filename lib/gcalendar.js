'use strict';

const mongoose = require('mongoose');
const Event = require('../models/event_model');
var calendarData;
var event;
var eventID;
var gID;
var update;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

function gCal(functionName) {
  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar'];
  // const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'token.json';

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    // authorize(JSON.parse(content), listAllEvents);
    if(functionName == 'insertEvents'){
      authorize(JSON.parse(content), insertEvents);
    }else if(functionName == 'listEvents'){
      authorize(JSON.parse(content), listEvents);
    }else if(functionName == 'updateEvent'){
      authorize(JSON.parse(content), updateEvent);
    }else if(functionName == 'deleteEvent'){
      authorize(JSON.parse(content), deleteEvent);
    }
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    console.log('Now running:', functionName);
    const calendar = google.calendar({version: 'v3', auth});
    // console.log("calendarList is: " + calendar.calendarList.list);
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err) => {
      if (err) return console.log('The API returned an error: ' + err);
    });
  }

  function deleteEvent(auth) {
    console.log('Now running:', functionName);
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

  function updateEvent(auth) {
    console.log('Now running:', functionName);
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

    console.log("Resource Parameter is: ", params.resource)

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
        
  function insertEvents(auth) {
    console.log('Now running: ', functionName);
    
    const calendar = google.calendar({ version: 'v3', auth});

    console.log('in insertEvents, calendarData is: ', calendarData);

    event = {
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
      //console.log('Complete event data: ', event)

      calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        //console.log("events are: ", events);
        if (res) {
          //console.log("inside if statement now")
          events.map((event) => {
            Event.findOne({
              event_id: event.id
            }).then((currentEvent) => {
              if(currentEvent){
                // User exists
                console.log('Event already exists: ', event.summary + ' ' + event.id);
              } else {
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

                console.log('event is: ' + ev);
                console.log('Attempting to store in db...');
                ev.save() // store event in db
                  .then(result => {
                    console.log(result); // display stored event
                    console.log('status: Event Stored');
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

module.exports = { 
  insEvent : function insEvent(data){
    calendarData = data;
    gCal('insertEvents');
  }, 
  listEvent : function listEvent(id){
    gID = id;
    gCal('listEvents');
  },
  updateEvent: function updateEvent(newData){
    // eventID = newData.eventID;
    update = newData;
    gCal('updateEvent');
  },
  deleteEvent: function deleteEvent(dEvent){
    eventID = dEvent;
    gCal('deleteEvent');
  }
};