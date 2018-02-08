import express from 'express';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';
import User from '../model/user.js'
import Group from '../model/group.js';
import namor from 'namor';

const groupRouter = module.exports = express.Router();

groupRouter.put('/group', bearer, bodyParser.json(), (req, res, next) => {

  //this route accepts a post to create.
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
      User.find({_id: userID})
        .then(user => {
          table[i].name = user.username;
          table[i].completed = user.completed;
        })
    })

    return table;

})


// //get the groups for a user, by user.group_IDs
// groupRouter.get('/groups/:userID', bearer, (req, res, next) => {

//   let userID = req.params;

//     User.findById(userID)
//       .then(user => res.send(user.groupNames))
//       .catch(next);
// })
