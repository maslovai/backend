'use strict';

import expect from 'expect';
import mongoose from 'mongoose';
import Group from '../../model/group';

mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});

const mockGroup = {
  "name": "Power Group",
};
let testGroup = new Group(mockGroup);
let id = (testGroup._id);

// Test 1. If records get created
describe('Group Model', () => {
  it('should create a record', () =>{
    expect(testGroup.name).toEqual('Power Group');
    expect(testGroup._id).not.toBe('undefined');
  })
  it ('sould save a record to the DB', ()=>{

    testGroup.save();
    Group.findOne({_id:id})
    .then(group=>{
        expect(group._id).toEqual(id);
    })
    .catch(console.error)
   }) 

    it ('sould remove a record from the DB', ()=>{ 
        Group.remove({'name':'Power Group'})
        .then(()=>{
          Group.findOne({_id:id})
          .then(group=> expect(group._id).toEqual(undefined))  
        })
        .catch();
    })
   
 
})
mongoose.disconnect();


