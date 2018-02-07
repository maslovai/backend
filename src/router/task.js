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

  Group.findById(req.params.groupID)
    .then( group => {
      if(group) res.send(group.tasks);
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
  console.log('in task router post:::', req.body)
  let task = new Task({
    name: req.body.name,
    group_ID: req.body.group_ID
  })
  task.save()
    .then( task => res.send(task) )
    .catch(next)

  //adding task to completed task array.
  User.find({_id:req.body.user._id})
    .then(user => {
      if(user){
        user.completed.push(task)
        return user.save()
      }
    })

  //update task in group array??
  //is group array needed if we can search in tasks for groupID and return
  //an array?

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

  if(req.body.completed){
    //if completed
      //add to user's list of completed tasks
      //update task in group's task list.

  }else if (!req.body.completed){
    //if not completed
      //remove from user's list of completed tasks
      //update task in group's task list.

  }
})

taskRouter.delete('/task/:id',   (req, res, next) => {
    console.log('in delete task router: params, id::::', req.params.id)

    Task.remove({_id:req.params.id})
     .then(()=>res.send('success!'))
     .catch(next)

    //remove task from group task list
    //if task is completed, delete from user's list of completed tasks.

})
