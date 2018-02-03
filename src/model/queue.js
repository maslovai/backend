'use strict';

const mongoose = require('mongoose');

const queueSchema = mongoose.Schema({
  group_ID: {type: String, required: true},
  task:{type: String, required: true},
  completed: {type: Boolean, default: false},
  completedBy: {type: number, required: false}
})

const Queue = Mongoose.model('queue',queueSchema);

export default Queue;
