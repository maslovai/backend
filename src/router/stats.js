'use strict'

import express from 'express';
import Group from '../model/groups.js';
import User from '../model/user.js';
import Tasks from '../router/task.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';

const statsRouter = module.exports = express.Router();

let userStats = //groupURL
let userQueue = []

Group.find(
  {_ID: ID })
  .then(group => {
    Group.userIDs.map(ID => {
      userStats.push({_ID: ID })
    })
  })

  userStats.forEach(user => {
    Tasks.find({ completedBy: user._ID })
    .then(Tasks => {

    })
  })
