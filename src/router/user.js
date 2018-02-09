'use strict'

import express from 'express';
import User from '../model/user.js';
import Group from '../model/group.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';

const userRouter = module.exports = express.Router();

userRouter.get('/user', bearer, (req, res, next) => {
  let user = req.user;
  console.log('User is /user is ', user)
  if (user) res.send(user);
  else next();
})

//this route returns the entire user, so it also contains group_IDs
userRouter.get('/user/:id', bearer, (req, res, next) => {
  let id = req.params._id;

  User.findOne({_id: id})
    .then(user => {
      if(user) res.send(user.group_IDs);
      else res.send('');
    })
  .catch(next);
})

//create route for adding a group_ID to the user & adding user_ID to group.
userRouter.put('/user/:alias', bearer, bodyParser.json(), (req, res, next) => {
  //add a group ID and group name to the user's list of IDs and names.
  //the group is identified by alias, in the request param
  //if group exists, search for user and update user.
  //Return user or return false if no group exists
  let userID = req.body.id;
  let alias = req.params.alias;
 
  console.log('userID is ', userID)

  Group.findOne({alias: alias})
    .then(group => {
      if(group) {
        group.user_IDs.push(userID)
        group.save();
        User.findById(userID)
          .then(user => {
            user.group_IDs.push(group._id);
            user.groupNames.push(group.name);
            user.groupAliases.push(group.alias);
            user.save();
            res.send(user);
          })
      } else {
        res.send({noGroupExists: true})
      }
    })
    .catch(next);
})


//Can we can use this route to update any of our user information.
userRouter.put('/user', bearer, bodyParser.json(), (req, res, next) => {

  if(!req.user) next(400)
  let user = req.user;

  User.findOne({_id: user._id})
    .then(user => {
      if(user){
        Object.assign(user, req.body);
        user.save();
        res.send(user);
      }
    })
    .catch(next);
})
