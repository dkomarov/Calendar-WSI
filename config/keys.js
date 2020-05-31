'use strict';
require('dotenv').config()

module.exports = {
  google: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET
  },
  session: {
    cookieKey: process.env.COOKIE
  }
};