import express from 'express';
import Group from '../model/group.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';

const groupRouter = module.exports = express.Router();

/*

  Group router will

      >create new group
        -Takes in a name
        -updates mongo with the name.
        -the user who created the group gets the group added to the users'
          group_ID array

*/
