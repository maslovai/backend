'use strict'

import express from 'express';
import Task from '../model/task.js';
import bodyParser from 'body-parser';
// import bearer from '../middleware/bearer-auth.js';
// import superagent from 'superagent';
import Group from '../model/group.js'


const taskRouter = module.exports = express.Router();

//get a list of tasks by groupID
taskRouter.get('/tasks/:groupID', (req, res, next) => {

  if(!req.params.groupID) next(400);

  Task.find({group_ID: req.params.groupID})
    .then( tasks => {
      console.log('group tasks are ',tasks)
      if(tasks) res.send(tasks); 
    })
    .catch(next)
})

// we don't have group id's yet, so using the above 
// taskRouter.get('/task', bodyParser, (req, res, next) => {
//   //get a list of tasks for the group
//   let query = { 
//     group_ID: req.body.id, 
//     completed: {$eq: false}
//   };
//   Task.find(query)
//     .then( tasks => res.send(tasks) )
//     .catch(next)
// })

taskRouter.post('/task',  bodyParser.json(), (req, res, next) => {
  
  //post a new task
  let task = new Task({
    "name": req.body.name,
     "group_ID": req.body.group_ID
  })
  task.save()
    .then( task => res.send(task))
    .catch(next)
})

taskRouter.put('/task/:id', bodyParser.json(), (req, res, next) => {
  console.log('in put task router: params.id::::', req.params.id)
  Task.findOne({_id:req.params.id})
    .then( task => {
          console.log('task found:', task.name, 'req.body:::', req.body)
          Object.assign(task, req.body);
          return task.save()
})
.then( task => res.send(task) )
.catch(next);
//   //update a task as completed/not completed
//   //completed tasks get the user_ID in completedBy
//   //uncompleted tasks have the user_ID removed.
//   //each task belongs to the group from which the user is posting
})

taskRouter.delete('/task/:id',   (req, res, next) => {
    console.log('in delete task router: params, id::::', req.params.id)
    Task.remove({_id:req.params.id})
    .then(()=>res.send('success!'))
    .catch(next)
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
