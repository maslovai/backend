'use strict';

import expect from 'expect';
import mongoose from 'mongoose';
import Task from '../../model/task';

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

const mockTask = {
  "name": "Dishes - do them!",
  "group_ID":"0000"
};
let testTask = new Task(mockTask);
let id = (testTask._id);

// Test 1. If records get created
describe('Task Model', () => {
  it('should create a record', () =>{
    expect(testTask.name).toEqual('Dishes - do them!');
    expect(testTask.group_ID).toEqual('0000');
    expect(testTask._id).not.toBe('undefined');
  })
  it ('sould save a record to the DB', ()=>{
    testTask.save();
    Task.findOne({_id:id})
    .then(task=>{
        expect(task._id).toEqual(id);
    })
    .catch(console.error)
   })
   it ('sould remove a record from the DB', ()=>{ 
        Task.remove({'name':'Dishes - do them!'})
        .then(()=>{
          Task.findOne({_id:id})
          .then(task=> expect(task._id).toEqual(undefined))  
        })
        .catch();
    })
})

mongoose.disconnect();

