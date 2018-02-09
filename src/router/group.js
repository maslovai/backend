import express from 'express';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';
import User from '../model/user.js'
import Task from '../model/task.js'
import Group from '../model/group.js';
import namor from 'namor';

const groupRouter = module.exports = express.Router();

groupRouter.post('/group', bearer, bodyParser.json(), (req, res, next) => {

  //it needs req.body.name which becomes the name for the new group
  //it needs req.user._id to locate and update the user with the new groupID
  const alias = namor.generate({ words: 3, numbers: 0 });

  console.log('req.body in group POST is ', req.body);
  let group = new Group({name: req.body.name, alias: alias, createdBy: req.body.id})

  group.save()
    .then( group => {
      User.findById(req.body.id)
        .then(user => {
          if(user) {
            user.group_IDs.push(group._id);
            user.groupNames.push(req.body.name);
            user.groupAliases.push(alias);
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
      User.find({_id: userID})
        .then(user => {
          table[i].name = user.username;
          table[i].completed = user.completed;
        })
    })

    return table;
})

//Either unsubscribe user from group, or delete group (if user is creator)
groupRouter.delete('/group/:id', bearer, bodyParser.json(), (req, res, next) => {

  if(!req.body.id || !req.params.id) next(400);  

  let userID = req.body.id;
  let groupID = req.params.id;  
  let index = undefined; 

  Group.findById(groupID)
    .then(group => {
       console.log('Step 1: delete group')
       if(group.createdBy === userID){
          Group.remove({_id: groupID})
            .then(() => { return; })
       }
       else {
       console.log('Step 1: unsubscribe')
          //remove the user's id from the group's array of user_IDs
          group.user_IDs.filter(user => (user._id !== userID));
          group.save();
       }
    });
     
  Task.remove({group_ID: groupID})
    .then(() => {console.log('Step 2: remove tasks'); return; })
    .catch(next)
      
  User.findById(userID)
    .then(user => {
      //get index of group at group_IDs array
      index = user.group_IDs.indexOf(groupID);
      //filter out groupIDs from the user
      user.group_IDs = user.group_IDs.filter(id => id === groupID)
      user.save();
      return user;
    })
    .then(user => {
      user.groupAliases = user.groupAliases.filter(alias => alias !== user.groupAliases[index]);
      user.save();
      return user;
    })
    .then(user => {
      //filter out groupNames from the user by index retrieved from group_IDs.
      user.groupNames = user.groupNames.filter(name => name !== user.groupNames[index])
      user.save();
      res.send(user);
    })
    .catch(next);
})

// return the createdBy user for a given group
groupRouter.get('/group/mod/:groupID', (req, res, next) => {

  let groupID = req.params.groupID;

    Group.findById(groupID)
      .then(group => {console.log('group.CreateBy is: ', group.createdBy); res.send(group.createdBy)})
      .catch(next);
})
