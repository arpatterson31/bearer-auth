'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // bug need to bring in jwt
require('dotenv').config(); // bug, need to bring in dotenv for app secret in .env file

const users = new mongoose.Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true }
}, { toJSON: { virtuals: true }}); // bug need 2nd arguement for .virtual

// Add a virtual to schema and get a token on every user object
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username
  }
  return jwt.sign(tokenObject, process.env.SECRET); // bug needs APP secret as 2nd param
});

users.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
}); // bug added await and removed the ismodified

// Basic Auth
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username });
  const valid = await bcrypt.compare(password, user.password);
  if (valid) { return user; }
  throw new Error('Invalid User');
}

// Bearer Auth
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = await jwt.verify(token, process.env.SECRET);
    const user = await this.findOne({ username: parsedToken.username });
    if (user) { return user; }
    throw new Error('User Not Found');
  } catch (e) {
    throw new Error(e.message);
  }
}

module.exports = mongoose.model('users', users);