'use strict';

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  name: {type: String, required: true},
  group_ID: {type: String, required: true},
  completed: {type: Boolean, default: false},
  completedBy: {type: number, required: false},
  createDate: {type: Date, default: Date.now}
})

const Task = Mongoose.model('task', taskSchema);

export default Task;
