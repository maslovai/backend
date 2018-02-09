import express from 'express';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';
import User from '../model/user.js'
import Task from '../model/task.js'
import Group from '../model/group.js';
import namor from 'namor';

const groupRouter = module.exports = express.Router();

groupRouter.put('/group', bearer, bodyParser.json(), (req, res, next) => {
  //add createdBy to group and set to user._id

  //it needs req.body.name which becomes the name for the new group
  //it needs req.user._id to locate and update the user with the new groupID
  const alias = namor.generate({ words: 3, numbers: 0 });

  console.log('req.body in group put is ', req.body);
  let group = new Group({name: req.body.name, alias: alias})

  group.save()
    .then( group => {

      User.findById(req.body.id)
        .then(user => {
          if(user) {
            user.group_IDs.push(group._id);
            user.groupNames.push(req.body.name);
            return user.save()
          }
        })
        .then(user => {console.log('user in server is ', user); res.send(user)});
    })
    .catch(next)
})

//get an array of objects containing task information for each user
groupRouter.put('/group/:groupID', bearer, bodyParser.json(), (req, res, next) => {
  let table = []

  Group.find({_id: req.params.groupID})
    .then(group => {
      group.user_ID.map(userID => {
        table.push({_id: userID})
      })
    })

    table.map( userID, i => {
    /  User.find({_id: userID})
        .then(user => {
          table[i].name = user.username;
          table[i].completed = user.completed;
        })
    })

    return table;
})

//unsubs for most users, deletes group for group creator.
groupRouter.delete('/group/:id', (req, res, next) => {
    let userID = req.body.id;
    let groupID = req.params.id;

    //if the user sending the unsub is the creator...
    if(group.createdBy == userID){

      //find group to be deleted or unsubscribed
      Group.find({_id:groupID})
        .then(group => {

          //map over userIDs in group to find each user.
          group.user_IDs.map(user_ID => {
            User.find({id: userID})
              .then(user => {

                //filter group name and group id from user
                user.save();
              })
            })

            //remove all tasks associated with group
            Task.find({group_ID: group._id})
            .then(tasks => {
              let toRemove = tasks.filter(task => task.group_ID == group._id);
              toRemove.forEach(task => Task.remove({_id: task._id}));
            })

            //and finally remove the group itself.
            Group.remove({_id:req.params.id})
            .then(()=>res.send('success, group ' + groupID + ' removed.'))
            .catch(next)
      })

    //if the user sending the request is NOT the creator of the group...
  } else if(group.createdBy !== userID){

    //find the user
      User.find(_id: userID)
        .then(user => {

          //find the group
          Group.find(_id: groupID)
          .then(group => {

            //filter out the user from group.user_IDs
            group.user_IDs = group.user_IDs.filter( id =>  id !==  userID)
            group.save();

            //filter out groupIDs from the user
            user.group_IDs = user.group_IDs.filter( id => id !== groupID)

            //filter out groupNames from the user.
            user.groupNames = user.groupNames.filter(name => name !== group.name)
            user.save();
          })
        })
    }
})
