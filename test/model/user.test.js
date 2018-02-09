'use strict';

import expect from 'expect';
import mongoose from 'mongoose';
import User from '../../src/model/task';

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

const mockUser = {
  "name": "Princess Ariel",
};
let testUser = new User(mockUser);
let id = (testUser._id);

// Test 1. If records get created
describe('User Model', () => {
  it('should create a record', () =>{
    expect(testUser.name).toEqual('Princess Ariel');
    expect(testUser._id).not.toBe('undefined');
  })
  it ('sould save a record to the DB', ()=>{
    testUser.save();
    User.findOne({_id:id})
    .then(user=>{
        expect(user._id).toEqual(id);
    })
    .catch(console.error)
   }) 
   it ('sould remove a record from the DB', ()=>{ 
        User.remove({_id:id})
        .then(()=>{
          User.findOne({_id:id})
          .then(user=> expect(user._id).toEqual(undefined))  
        })
        .catch(console.error);
    })
})

mongoose.disconnect();

