'use strict'

import express from 'express';
import Group from '../model/group';
import User from '../model/user';
import Task from '../router/task';
// import bodyParser from 'body-parser';
// import bearer from '../middleware/bearer-auth';
// import superagent from 'superagent';

const statsRouter = module.exports = express.Router();

//get an array of objects containing task information for each user
statsRouter.get('/stats/:id', (req, res, next) => {
  let table = []
console.log('in backend, stats route ', req.params)
  Group.findOne({_id: req.params.id})
    .then(group => {
      console.log('::::::::::::', group)
      group.user_ID.forEach(user).map(userID => {
        table.push({_id: user.userID})
      })
    })
   console.log('::::::::::::', table)
    // <Piechart x={100} y={100} outerRadius={100} innerRadius={50}
    //           data={[{value: 92-34, label: 'Code lines'},
    //                  {value: 34, label: 'Empty lines'}]} />

    table.map( userID, i => {
      User.find({_id: userID})
        .then(user => {
          table[i].value = user.completed;
          table[i].label = user.username;
        })
    })
  res.send(table);

})
