'use strict';
const PORT = 5000;
require('dotenv').config();
import express,{Router} from 'express';
import mongoose from 'mongoose';
import expect from 'expect';
import superagent from 'superagent';
import Task from '../../src/model/task';
import taskRouter from '../../src/router/task';

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI);

const server = require('express')();
server.use(taskRouter);


server.use((err, req, res, next ) => {
    // console.log(err);
    res.status(err.statusCode||500).send(err.message||'server error')
})

beforeAll(()=>{
    server.listen(PORT);
    return  Task.remove({})
})

afterAll(()=>{
    // Task.remove({});
    mongoose.connection.close();
    server.close();
    console.log('closing');
})

describe('Task router', ()=>{
    it('should respond with a 404 for unregistered paths ',()=>{
        return superagent
        .post(`localhost:${PORT}/si`)
        .set({"Content-Type":"application/json"})
        .send({"name":"test"})
        .then(Promise.reject)
        .catch(res=>{
            // console.log('in the 404 one:::::', res.body)
            expect(res.status).toEqual(404);
            expect(res.message).toBe('Not Found')
        })
    })
})

let groupID = '5a7a04a22a1b52cf493006dc';
describe('Task router:', ()=>{
    let idForGet;

    it ('should respond with 400 if no body', ()=>{
        superagent
        .post(`http://localhost:${PORT}/task`)
        .set({'Content-Type':'application/json'})
        .send({})
        .then()
        .catch(res => {
         expect(res.status).toEqual(415);
        })
    })

    it('post should respond with the body content for a post request with a valid body',()=>{
        superagent 
        .post(`http://localhost:${PORT}/task`)
        .set({'Content-Type':'application/json'})
        .send({'name':'test task', 'group_ID':groupID})
        .then((res) => {
            console.log('in post, res::::::::::::: ' , res.body)
            expect(res.body.name).toBe('test task');
            expect(res.body.group_ID).toBe(groupID)
            idForGet = res.body.id;
        })
        .catch(next)
        // .catch(err => console.log(err))
    })

    it ('get tasks should return a list of tasks with a group ID', ()=>{
        
        // for (let i = 0; i<2;i++){
        //     superagent
        //     .get(`http://localhost:${PORT}/task`)
        //     .send({'name':`task${[i]}`, 'groupID':groupID})
        // }
        superagent
        .get(`http://localhost:${PORT}/tasks/${groupID}`)
        .end((err, res) => {
            expect(res.body).not.toBe(null);
            expect(res.body.groupID).toEqual(groupID)
        })

    })

    it ('update tasks should update a record in db', ()=>{
        
        for (let i = 0; i<2;i++){
        superagent
        .put(`http://localhost:${PORT}/task`)
        .set({"Content-Type":"application/json"})
        .send({'completedBy':`iryna`})
        .end()
        }
        superagent
        .get(`http://localhost:${PORT}/tasks/${groupID}`)
        .end((err, res) => {
            expect(res.body).not.toBe(null);
            expect(res.body.completedBy).toEqual('hello')
        })
    })

    it ('delete task should delete a record in db', ()=>{

    })




})