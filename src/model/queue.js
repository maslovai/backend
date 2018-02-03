'use strict';

const mongoose = require('mongoose');

const queueSchema = mongoose.Schema({
  task:{type: String, required: true},
  group_ID: {type: String, required: true},
  completed: {type: Boolean, default: false},
  completedBy: {type: number, required: false},
  createDate: {type: Date, default: Date.now}

})

const Queue = Mongoose.model('queue',queueSchema);

export default Queue;
