'use strict';

const users = require('../models/user.js');

module.exports = async (req, res, next) => {
  if(!req.headers.authorization) { next('Invalid Login') }
  try {
   const token = req.headers.authorization.split(' ').pop();
   const validUser = await users.authenticateWithToken(token);

   req.user = validUser;
   req.token = validUser.token;
  } catch (e) {
    res.status(403).send('Invalid Login');
  }
}