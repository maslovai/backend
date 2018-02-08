'use strict'

import express from 'express';
import Task from '../model/task.js';
import User from '../model/user';
import bodyParser from 'body-parser';
// import bearer from '../middleware/bearer-auth.js';
// import superagent from 'superagent';
import Group from '../model/group.js'


const taskRouter = module.exports = express.Router();

//get a list of tasks by groupID
taskRouter.get('/tasks/:groupID', (req, res, next) => {

  if(!req.params.groupID) next(400);

  console.log('req.params is ', req.params.groupID)
  let groupID = req.params.groupID;
  let groupName = '';

  //Get the Group Name to send back to frontend for display purposes
  Group.findById(groupID)
    .then(group => { console.log('group is ', group); groupName = group.name})

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
  if(!req.body) next(400);
  console.log('in task router post:::', req.body)
  let task = new Task({
    "name": req.body.name,
    "group_ID": req.body.group_ID
  })
  task.save()
    .then(task => {
      console.log('NEWLY CREATED TASK::::', task)
      res.send(task)
    })
    .catch(next)
  //update task in group array??
  //is group array needed if we can search in tasks for groupID and return
  //an array?

})

taskRouter.put('/task/:id', bodyParser.json(), (req, res, next) => {
  // console.log('in put task router: req.body::::', req.body);
  let task = new Task({
    "name": req.body.name,
    "group_ID": req.body.group_ID
  })
   //updating task
   Task.findOne({_id:req.params.id})
   .then( task => {
     // console.log('task found:', task.name, 'req.body:::', req.body)
     Object.assign(task, req.body);
     task.save();
     res.send(task)
   })  
   .catch(next); 

  //adding checked task to completed tasks array in user model
  if (req.body.completed){
    User.findOne({_id:req.body.completedBy})
        .then(user => {
          if(user){
            Object.assign(user, {completedTasks:[...user.completedTasks, req.body._id]});
            user.save();
            // console.log('user model after updating::::', user)
          }
        })
        .catch(err => console.log(err))
  } else {
    //removing unchecked tasks from completed tasks array in user model
    User.findOne({_id:req.body.completedBy})
        .then(user => {
          if(user){
            // console.log('use before uncheck:::', user)
            user.completedTasks = user.completedTasks.filter(task => {return task!==req.body._id})
            user.save();
          //  console.log('user model after unchecking::::', user)
          }
        })
        .catch(err => console.log(err))
  }
})
  
taskRouter.delete('/task/:id',   (req, res, next) => {
    // console.log('in delete task router: req.body, id::::', req.params._id)

    //delete a task
    Task.remove({_id:req.params.id})
     .then(()=>res.send('success!'))
     .catch(next)

    //if task is deleted, delete from all user's lists of completed tasks
    User.find({})
        .then(user => user.forEach(element => {
          element.completedTasks = element.completedTasks.filter(id => {return id!==req.params._id})
          element.save();
          console.log('user model after delete task::::', user)
        }))
        .catch(err => console.log(err))  
})



//remove task from group task list    - not doing this one, right?