'use strict'

import express from 'express';
import Task from '../model/task.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';
import Group from '../model/group.js'

const taskRouter = module.exports = express.Router();

taskRouter.get('/task', bearer, bodyParser, (req, res, next) => {
  //get a list of tasks for the group
  let query = { 
    group_ID: req.body.id, 
    completed: {$eq: false}
  };
  Task.find(query)
    .then( tasks => res.send(tasks) )
    .catch(next)
})

taskRouter.post('/task', bearer, bodyParser, (req, res, next) => {
  //post a new task
  task = new Task({
    name: req.body.name,
    group_ID: req.body.group_ID
  })
  task.save()
    .then( task => res.send(task) )
    .catch(next)
})

taskRouter.put('/task', bearer, (req, res, next) => {
  //update a task as completed/not completed
  //completed tasks get the user_ID in completedBy
  //uncompleted tasks have the user_ID removed.
  //each task belongs to the group from which the user is posting.


})

/*

  Task router will
    >create new tasks
        -new tasks have
            -name
            -completed - no by default
            -group_ID

    >complete task
        -marks task as completed: true
        -updated completedBy to contain the user_ID of the user who completed.

    >delete task
        -completely removes the task

*/
