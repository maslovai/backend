'use strict';
require('dotenv').config();
import express,{Router} from 'express';
import mongoose from 'mongoose';
import expect from 'expect';
import superagent from 'superagent';
import Group from '../../model/group';
import User from '../../model/user'
import groupRouter from '../../router/group';

mongoose.Promise = require('bluebird');

const server = require('express')();
server.use(groupRouter);


server.use((err, req, res, next ) => {
    res.status(err.statusCode||500).send(err.message||'server error')
})

const API = 'http://localhost:5000/group';
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"

beforeAll(()=>{
    server.listen(PORT);
    mongoose.connect(process.env.MONGODB_URI)
})

afterAll(()=>{
    server.close();
    console.log('closing');
})

describe("Group router ", ()=>{

    let testUser = new User({
        username: "testUser",
        email:"testUser@gmail.com"
    })
    testUser.save();
    let userIdToUse = testUser._id;
    let testGroupId;

    it ('POST should respond with 400 if no body', ()=>{
        superagent
        .post(`API`)
        .set('Authorization', `Bearer ${token}`)
        .send()
        .end((err, res) => {
            expect(err.status).toBe(400)
        })
    })

    it('POST should return user with the group data assigned, if the group name is provided', ()=>{
        superagent
        .post(`${API}/post`)
        .set('Authorization', `Bearer ${token}`)
        .set({'content-type':'application/json'})
        .send({"name": "testGroup", "alias": "some-unique-alias", "createdBy":userIdToUse, "user_IDs": userIdToUse})
        .then(res => {
          console.log("test user is: ", testUser)
          console.log("Users groups:  ", testUser.groupNames);
          expect(testUser.groupNames.length).notToEqual(0);
          expect(testUser.groupAliases.length).notToEqual(0);
          expect(testUser.groupNames[0]).toEqual("testGroup");
          testGroupId = testUser.group_IDs[0];
        })
        .catch(err => {
            console.log(err.message);
            mongoose.connection.close();
        })
    })

    // it('PUT should update group with the new user information', ()=>{
    //     superagent.put(`${API}/put/${testGroupId}`)
    //     .set('Authorization', `Bearer ${token}`)
    //     .set({'content-type':'application/json'})
    //     .send({'_id':testUser._id})
    // })
    mongoose.connection.close();
})

