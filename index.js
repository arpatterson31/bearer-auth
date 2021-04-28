'use strict';

// Start up DB Server
const mongoose = require('mongoose');
require('dotenv').config(); // bug, need to bring in dotenv for uri and port in .env file
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, options);

//Start the web server
require('./src/server.js').startup(process.env.PORT); // bug - called startup in server file, not start