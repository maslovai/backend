import express from 'express';
import Task from '../model/task.js';
import bodyParser from 'body-parser';
import bearer from '../middleware/bearer-auth.js';
import superagent from 'superagent';

const taskRouter = module.exports = express.Router();

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
