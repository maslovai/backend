'use strict'

import express from 'express';
import User from '../model/user.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';

const userRouter = module.exports = express.Router();

userRouter.get('/user', bearer, (req, res, next) => {
  let user = req.user;
  if (user) res.send(user);  
  else next();
})

userRouter.put('/user', bearer, bodyParser.json(), (req, res, next) => {
 
  console.log('req.user is ', req.user);
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

