'use strict'

import express from 'express';
import Group from '../model/groups.js';
import User from '../model/user.js';
import Tasks from '../router/task.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';

const statsRouter = module.exports = express.Router();

//get an array of objects containing task information for each user
statsRouter.get('/stats/:id', bearer, bodyParser.json(), (req, res, next) => {
  let table = []

  Group.find({id: req.body.group_ID})
    .then(group => {
      group.user_ID.map(userID => {
        table.push({_id: userID})
      })
    })

    table.map( userID, i => {
      User.find({_id: userID})
        .then(user => {
          table[i].name = user.username;
          table[i].completed = user.completed;
        })
    })

    return table;

}
