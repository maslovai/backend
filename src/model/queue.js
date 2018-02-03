'use strict';

const mongoose = require('mongoose');

const tasksSchema = mongoose.Schema({
  group: {type: String, unique: true, required: true}
  task:{type: String, required: true}
  completed: {type: Boolean, required: true}
})
