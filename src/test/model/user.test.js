'use strict';

import expect from 'expect';
import mongoose from 'mongoose';
import User from '../../model/user';

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});


let testUser = new User({"username": "Princess Ariel"});
let id = (testUser._id);

// Test 1. If records get created
describe('User Model', () => {
  it('should create a record', () =>{
    // console.log('user id:', testUser.id);
    expect(testUser.username).toEqual('Princess Ariel');
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
          mongoose.disconnect();
        })
        .catch(err=> {
          console.error;
          mongoose.disconnect()
        });
    })
})

