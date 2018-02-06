'use strict';
import {promisify} from '../lib/promisify.js';
import Mongoose, {Schema} from 'mongoose';

const groupSchema = Mongoose.Schema({
  name: {type: String, required: true},
  alias: {type: String}
})

const Group = Mongoose.model('group', groupSchema);

export default Group;
