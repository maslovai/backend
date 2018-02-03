'use strict';

const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: {type: String, required: true}

})

const Group = Mongoose.model('group',groupSchema);

export default Group;
