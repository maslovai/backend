'use strict';

import Mongoose, {Schema} from 'mongoose';

const taskSchema = new Schema({
  name: {type: String, required: true},
  group_ID: {type: String, required: false},
  groupName: {type: String, required: false },
  completed: {type: Boolean, default: false},
  completedBy: {type: String, required: false},
<<<<<<< HEAD
  createDate: {type: Date, default: Date.now(), expireAfterSeconds:1000*60*5}
=======
  createDate: {type: Date, default: Date.now}
>>>>>>> 10ff12a4c0dea2c8eef034adb1cf898205ad6441
})

const Task = Mongoose.model('task', taskSchema);

export default Task;
